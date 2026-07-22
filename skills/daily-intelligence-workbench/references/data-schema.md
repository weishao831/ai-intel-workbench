# Digest Data Schema

The workbench stores one daily digest at:

```text
data/YYYY/MM/DD/digest.js
```

The frontend loads it through:

```javascript
window.__DAILY__ = window.__DAILY__ || {};
window.__DAILY__["YYYY/MM/DD"] = { ... };
```

The deterministic writer also accepts canonical JSON:

```json
{
  "date": "2026-06-29",
  "date_cn": "2026年6月29日 · 周一",
  "generated_at": "2026-06-29",
  "quality_version": 5,
  "language": "zh",
  "refresh_note": "Short generation note",
  "market_mood": "Optional market/context paragraph",
  "coverage_report": {
    "trace_path": ".daily-intel/runs/2026-06-29/research_trace.json",
    "query_groups": [
      {
        "key": "community_hotspots",
        "status": "completed",
        "queries": ["Actual query issued"],
        "run_ids": ["web-community-01"],
        "candidate_count": 5,
        "selected_ids": ["lab-1"],
        "rejection_reasons": []
      }
    ],
    "x_pipeline": {
      "gate_queries": 2,
      "gate_cited_posts": 0,
      "public_index_queries": 2,
      "public_index_posts": 5,
      "browser_queries": 0,
      "browser_verified_posts": 0
    },
    "lab_pipeline": {
      "core_labs_checked": ["qwen", "deepseek", "kimi", "zai", "bytedance_seed", "tencent_hunyuan", "baidu_ernie", "minimax"],
      "activity_tracks": [
        {
          "key": "model_release",
          "status": "completed",
          "queries": ["Actual model-release query"],
          "candidate_count": 2,
          "selected_ids": ["lab-1"],
          "rejection_reasons": []
        }
      ]
    },
    "viewpoint_pipeline": {
      "dynamic_candidates": 6,
      "dynamic_selected_ids": ["kol-1", "kol-2"],
      "static_selected_ids": [],
      "topic_roles": [
        {
          "topic_cluster": "example-topic",
          "roles": {
            "originator": ["lab-1"],
            "independent_evaluation": ["kol-1"],
            "counterpoint": ["kol-2"]
          }
        }
      ]
    }
  },
  "dimensions": [
    {
      "key": "lab",
      "cn": "AI 大厂动态",
      "overview": "Dimension overview",
      "notes": "Source quality notes"
    }
  ],
  "hot_topics_today": [
    {
      "title": "Topic title",
      "heat": "high",
      "dims": ["lab", "kol"],
      "summary": "Why this matters",
      "related": ["lab-1", "kol-1"]
    }
  ],
  "items": [
    {
      "id": "lab-1",
      "dim": "lab",
      "lab_activity_type": "model_release | product_ops | research",
      "title": "Chinese title",
      "orig": "Original title",
      "source": "Source name",
      "url": "https://example.com/source",
      "date": "2026-06-29",
      "heat": "high",
      "tags": ["tag"],
      "summary": "Plain Chinese summary",
      "detail": "Detailed explanation",
      "why": "Why it matters",
      "why_now": "Why now",
      "topic_cluster": "organization-ai",
      "recency_role": "fresh_signal | current | background",
      "buzz": "Community discussion",
      "x_src": ["https://x.com/.../status/..."],
      "evidence": {
        "provider": "x-browser | public-web-index | official-api | official-site",
        "verification_level": "direct_page | public_index | official_api",
        "excerpt": "Attributable source text used for the summary",
        "verified_url": "https://x.com/author/status/1234567890",
        "verified_at": "2026-06-29T09:00:00+08:00",
        "published_at": "2026-06-28T12:00:00Z",
        "direct": true
      },
      "repeat_update": false,
      "new_evidence": "Required only when intentionally repeating a recent source",
      "content_type": "news | x_status | x_article | official_research | paper | technical_report | model_card | github_repo | analysis",
      "depth": "normal | deep",
      "key_points": ["Point 1", "Point 2"],
      "examples": ["Concrete example"],
      "product_implications": ["Product or workflow implication"],
      "limitations": ["What not to over-infer"],
      "meta": {}
    }
  ],
  "kol_list": [],
  "practice_list": []
}
```

## Required Fields

- Root: `date`, `date_cn`, `generated_at`, `dimensions`, `hot_topics_today`, `items`; new production digests should set `quality_version: 5` and include trace-backed `coverage_report`
- Dimension: `key`, `cn`, `overview`
- Hot topic: `title`, `summary`, `related`
- Item: `id`, `dim`, `title`, `source`, `url`, `date`, `summary`, `detail`

## Longform / Research Item Expectations

For `content_type` in `x_article`, `official_research`, `paper`, `technical_report`, or `model_card`, set `depth` to `deep` when the source is an important long article or research note.

Deep items should include:

- `summary`: 2-3 plain-language sentences.
- `detail`: normally 650-1400 Chinese characters for Chinese output. The goal is that the user can understand the article "七七八八" without opening the original.
- `key_points`: 3-6 bullet-like strings capturing the actual argument, not generic labels.
- `examples`: 1-3 concrete examples or analogies when the content is abstract.
- `product_implications`: what this means for AI product, agent engineering, evaluation, open-source adoption, or the configured industry anchors.
- `limitations`: caveats, uncertainties, or where the author may be overclaiming.

Do not compress a high-value longform item into a short news blurb. If the item is included because of a long article, the dashboard should preserve enough structure to be useful offline.

## Language

Set root `language` to one of:

- `zh`: Simplified Chinese user-facing fields.
- `en`: English user-facing fields.
- `bilingual`: Chinese-first bilingual fields.

Language-sensitive fields include `refresh_note`, `market_mood`, `dimensions[].overview`, `dimensions[].notes`, `hot_topics_today[].title`, `hot_topics_today[].summary`, `items[].title`, `items[].summary`, `items[].detail`, `items[].why`, `items[].why_now`, `items[].buzz`, and `practice_list[]`.

Keep technical names, source names, product names, tickers, and URLs unchanged unless an official localized name exists.

## Validation Rules

- `date` must match `YYYY-MM-DD`.
- Manifest key must match `YYYY/MM/DD`.
- Every `hot_topics_today[].related` id should exist in `items[].id`.
- Every item should have a reachable or intentionally marked URL.
- Every item should include a dimension present in `dimensions[].key`.
- Public claims that are single-source, stale, or approximate should be disclosed in `notes`, `buzz`, or `detail`.
- For `quality_version: 2`, KOL X evidence must be a concrete numeric `x.com/<handle>/status/<id>` or `x.com/i/article/<id>` URL. Profile, `with_replies`, home, and search URLs are discovery-only.
- For `quality_version: 2`, set `topic_cluster` on each item and connect hot topics to at least two independent source URLs where possible.
- For `quality_version: 2`, sources older than seven days require `recency_role: background` and a specific `why_now`; sources older than 30 days cannot be standalone daily items.
- For `quality_version: 2`, repeated URLs from the previous seven digests require `repeat_update: true` plus a concrete `new_evidence` explanation.
- For `quality_version: 3`, `coverage_report.query_groups` must contain completed `community_hotspots`, `access_and_quota`, `chinese_frontier_models`, and `x_viewpoints` records with actual queries and candidate counts.
- For `quality_version: 3`, a concrete X item can be verified by an interactive browser (`direct_page`), a public web index (`public_index`), or an official API (`official_api`). Every path needs an attributable excerpt, author/date metadata, and a concrete numeric status/article URL; Gate summaries alone never qualify.
- For `quality_version: 3`, `coverage_report.x_pipeline` records Gate, public-index, and browser query/result counts so a provider failure cannot be mistaken for “no discussion.”
- For `quality_version: 4`, `coverage_report.query_groups` additionally requires `domestic_lab_models`, `domestic_lab_product_ops`, `domestic_lab_research`, and `dynamic_kol_views`.
- For `quality_version: 4`, `coverage_report.lab_pipeline.core_labs_checked` must contain all eight core domestic labs, and `activity_tracks` must complete `model_release`, `product_ops`, and `research` with actual queries and candidate records.
- For `quality_version: 4`, every lab item requires `lab_activity_type`. Every KOL item requires `discovery_mode: watchlist | topic_expansion` and `viewpoint_role: originator | independent_evaluation | counterpoint | context`.
- For `quality_version: 4`, `coverage_report.viewpoint_pipeline` requires at least six dynamic candidates, at least two dynamic selections, at least two topics with originator + independent evaluation, and at least one counterpoint topic.
- For `quality_version: 5`, `coverage_report.trace_path` must reference the same day's finalized `research_trace.json`. Every query group needs `run_ids`; its queries, candidate count, and X pipeline totals must match trace artifacts.
- For `quality_version: 5`, the trace must contain at least three actual Gate X queries. If Gate yields fewer than four concrete cited posts, at least four public-index/browser fallback queries are required.
- For `quality_version: 5`, all eight core domestic labs need separate trace records for `model_release`, `product_ops`, and `research` (24 lab/track pairs). A combined “checked eight labs” sentence is not evidence.
- For `quality_version: 5`, the digest needs at least 12 items, including at least two lab items, four KOL viewpoints, one paper, two open-source projects, and one AI-finance item. X failure must not erase researched non-X dimensions.
- X operators such as `since:` and `filter:` are valid only in X's own search. They are invalid in ordinary public-web queries.
- Do not use generic research indexes, topic pages, profile pages, or provider-monitoring messages as intelligence items.

## Research Trace

Create and finalize the trace before publishing:

```bash
python3 scripts/research_trace.py init --date 2026-06-29 --mode scheduled
python3 scripts/research_trace.py record --date 2026-06-29 --id gate-x-01 --provider gate-search-x --group x_viewpoints --query "AI model evaluation critique" --artifact .daily-intel/runs/2026-06-29/evidence/gate-x-01.json
python3 scripts/research_trace.py finalize --date 2026-06-29
```

Each trace run stores the real query, provider, execution time, raw-result count, discovered URLs, and artifact path. Lab checks additionally set `lab` and `track`.

## Writing Files

Prefer:

```bash
python3 scripts/run_daily.py --date 2026-06-29 --from-json out/digest.json --publish-on-valid
```

Then validate:

```bash
python3 scripts/validate_digest.py --date 2026/06/29
```
