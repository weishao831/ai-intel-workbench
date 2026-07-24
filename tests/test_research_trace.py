#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace


SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

import research_trace  # noqa: E402


class ResearchTraceTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original_root = research_trace.ROOT
        research_trace.ROOT = Path(self.temp.name)
        self.date = "2026-07-22"
        research_trace.cmd_init(SimpleNamespace(date=self.date, mode="scheduled"))

    def tearDown(self):
        research_trace.ROOT = self.original_root
        self.temp.cleanup()

    def record(self, run_id, provider, group, url=None, lab=None, track=None, published_at=None):
        evidence = research_trace.run_dir(self.date) / "evidence" / (run_id + ".json")
        payload = {"query": run_id, "results": []}
        if url:
            row = {
                "url": url,
                "title": "Attributable trend candidate",
                "published_at": published_at or "2026-07-22T08:00:00+08:00",
                "excerpt": "This attributable excerpt is long enough for trace verification.",
            }
            if provider in {"public-web-index", "x-browser"}:
                row.update({
                    "author": "@test",
                })
            if provider == "gate-search-x":
                payload["cited_tweets"] = [row]
            else:
                payload["results"].append(row)
        evidence.write_text(json.dumps(payload), encoding="utf-8")
        research_trace.cmd_record(SimpleNamespace(
            date=self.date,
            id=run_id,
            provider=provider,
            group=group,
            query=run_id,
            artifact=str(evidence),
            status="success",
            executed_at=None,
            window_days=7,
            lab=lab,
            track=track,
        ))

    def test_complete_trace(self):
        groups = sorted(research_trace.REQUIRED_GROUPS)
        for index, group in enumerate(groups):
            lane = next((row for row in research_trace.TREND_LANES if row["key"] == group), None)
            count = max(int(lane.get("min_queries") or 1), int(lane.get("min_candidates") or 0)) if lane else 1
            for query_index in range(count):
                domain = "source-a.example" if query_index % 2 == 0 else "source-b.example"
                self.record(
                    "web-%02d-%02d" % (index, query_index),
                    "web-search",
                    group,
                    "https://%s/%s/%d" % (domain, group, query_index),
                )

        for index in range(3):
            self.record(
                "gate-%02d" % index,
                "gate-search-x",
                sorted(research_trace.TREND_GROUPS)[index],
                "https://x.com/test/status/20797460000000000%d" % index,
            )

        for index in range(4):
            self.record(
                "browser-%02d" % index,
                "x-browser",
                "dynamic_kol_views",
                "https://x.com/test/status/20797461000000000%d" % index,
            )

        track_group = {
            "model_release": "domestic_lab_models",
            "product_ops": "domestic_lab_product_ops",
            "research": "domestic_lab_research",
        }
        for lab in sorted(research_trace.CORE_LABS):
            for track in sorted(research_trace.LAB_TRACKS):
                self.record(
                    "lab-%s-%s" % (lab, track),
                    "official-web",
                    track_group[track],
                    lab=lab,
                    track=track,
                )

        payload = research_trace.load_trace(self.date)
        payload["completed_at"] = research_trace.now_iso()
        research_trace.save_trace(self.date, payload)
        self.assertEqual(research_trace.validate_trace(self.date, require_complete=True), 0)

    def test_rejects_artifact_outside_run_directory(self):
        outside = research_trace.ROOT / "outside.json"
        outside.write_text("{}", encoding="utf-8")
        with self.assertRaises(SystemExit):
            research_trace.cmd_record(SimpleNamespace(
                date=self.date,
                id="outside",
                provider="web-search",
                group="community_hotspots",
                query="outside",
                artifact=str(outside),
                status="success",
                executed_at=None,
                window_days=7,
                lab=None,
                track=None,
            ))

    def test_combined_artifact_is_scoped_to_run_query(self):
        evidence = research_trace.run_dir(self.date) / "evidence" / "combined.json"
        evidence.write_text(json.dumps({
            "results": [
                {
                    "query": "first query",
                    "url": "https://x.com/first/status/207974600000000001",
                    "author": "@first",
                    "published_at": "2026-07-22T08:00:00+08:00",
                    "excerpt": "First attributable excerpt with enough detail for verification.",
                },
                {
                    "query": "second query",
                    "url": "https://x.com/second/status/207974600000000002",
                    "author": "@second",
                    "published_at": "2026-07-22T08:00:00+08:00",
                    "excerpt": "Second attributable excerpt with enough detail for verification.",
                },
            ],
        }), encoding="utf-8")
        research_trace.cmd_record(SimpleNamespace(
            date=self.date,
            id="combined-first",
            provider="x-browser",
            group="x_viewpoints",
            query="first query",
            artifact=str(evidence),
            status="success",
            executed_at=None,
            window_days=7,
            lab=None,
            track=None,
        ))

        run = research_trace.load_trace(self.date)["runs"][0]
        self.assertEqual(run["result_count"], 1)
        self.assertEqual(
            run["x_post_urls"],
            ["https://x.com/first/status/207974600000000001"],
        )

        with self.assertRaises(SystemExit):
            research_trace.cmd_record(SimpleNamespace(
                date=self.date,
                id="combined-missing",
                provider="x-browser",
                group="x_viewpoints",
                query="missing query",
                artifact=str(evidence),
                status="empty",
                executed_at=None,
                window_days=7,
                lab=None,
                track=None,
            ))

    def test_bare_public_x_url_is_not_verified_evidence(self):
        evidence = research_trace.run_dir(self.date) / "evidence" / "bare-public.json"
        evidence.write_text(json.dumps({
            "query": "bare public",
            "results": [{"url": "https://x.com/old/status/207974600000000003"}],
        }), encoding="utf-8")
        research_trace.cmd_record(SimpleNamespace(
            date=self.date,
            id="bare-public",
            provider="public-web-index",
            group="x_viewpoints",
            query="bare public",
            artifact=str(evidence),
            status="success",
            executed_at=None,
            window_days=7,
            lab=None,
            track=None,
        ))
        run = research_trace.load_trace(self.date)["runs"][0]
        self.assertEqual(run["result_count"], 1)
        self.assertEqual(run["x_post_urls"], [])
        self.assertEqual(run["fresh_x_post_urls"], [])

    def test_rss_feed_is_a_trace_provider(self):
        self.record(
            "rss-openai",
            "rss-feed",
            "community_hotspots",
            "https://example.com/article",
        )
        run = research_trace.load_trace(self.date)["runs"][0]
        self.assertEqual("rss-feed", run["provider"])
        self.assertEqual(1, run["result_count"])
        self.assertEqual(7, run["window_days"])


if __name__ == "__main__":
    unittest.main()
