import json
import tempfile
import unittest
from pathlib import Path

import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from common import deep_merge, load_workbench_config, parse_js_config


class WorkbenchConfigTest(unittest.TestCase):
    def test_deep_merge_replaces_arrays_and_keeps_siblings(self):
        merged = deep_merge(
            {"runtime": {"language": "zh", "push": True}, "rss": {"feeds": [1]}},
            {"runtime": {"push": False}, "rss": {"feeds": [2, 3]}},
        )
        self.assertEqual("zh", merged["runtime"]["language"])
        self.assertFalse(merged["runtime"]["push"])
        self.assertEqual([2, 3], merged["rss"]["feeds"])

    def test_parse_browser_js_config(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "workbench.user.js"
            path.write_text(
                'window.__WORKBENCH_USER_CONFIG__ = {"runtime":{"schedule_push":false}};\n',
                encoding="utf-8",
            )
            value = parse_js_config(path)
        self.assertFalse(value["runtime"]["schedule_push"])

    def test_project_defaults_include_kol_push_and_trend_lanes(self):
        value = load_workbench_config()
        self.assertEqual(69, len(value["kol"]["authors"]))
        self.assertEqual("primary", value["push"]["targets"][0]["role"])
        self.assertEqual(
            {"global_ai_trends", "visual_ai_models", "ai_web3_trends", "ai_finance_trends"},
            {row["key"] for row in value["discovery"]["lanes"] if row["enabled"]},
        )

    def test_frontier_visual_radar_covers_black_forest_labs(self):
        sources = (ROOT / "config" / "sources.yaml").read_text(encoding="utf-8").lower()
        radar = (ROOT / "config" / "research_radar.yaml").read_text(encoding="utf-8").lower()
        self.assertIn("bfl.ai", sources)
        self.assertIn("flux.3", radar)
        self.assertIn("black forest labs", radar)
        self.assertIn("frontier_visual_model_watchlist", radar)


if __name__ == "__main__":
    unittest.main()
