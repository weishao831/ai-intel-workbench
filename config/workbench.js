window.__WORKBENCH_DEFAULTS__ = {
  "version": 1,
  "runtime": {
    "output_language": "zh",
    "schedule_push": true,
    "web_native_recency_days": 7,
    "web_recovery_recency_days": 3,
    "freshness_recovery_enabled": true,
    "freshness_recovery_min_queries": 6,
    "x_scheduled_search_limit": 6,
    "x_scheduled_results_per_query": 8,
    "x_scheduled_min_query_interval_seconds": 10
  },
  "quality": {
    "min_total_items": 12,
    "min_fresh_72h": 5,
    "min_fresh_7d_ratio": 0.65,
    "max_background_ratio": 0.20,
    "dimension_minima": {
      "lab": 2,
      "kol": 4,
      "paper": 1,
      "oss": 2,
      "fin": 1
    }
  },
  "sources": {
    "gate_search_x": true,
    "public_web": true,
    "x_browser": true,
    "official_web": true,
    "github": true,
    "paper_index": true
  },
  "discovery": {
    "enabled": true,
    "lookback_hours": 24,
    "min_trend_items": 3,
    "min_off_watchlist_kol": 2,
    "min_distinct_lanes_selected": 2,
    "lanes": [
      {"key":"global_ai_trends","name":"全行业热点","enabled":true,"min_queries":4,"min_candidates":8},
      {"key":"visual_ai_models","name":"视觉 / 多模态","enabled":true,"min_queries":3,"min_candidates":4},
      {"key":"ai_web3_trends","name":"AI × Web3","enabled":true,"min_queries":3,"min_candidates":4},
      {"key":"ai_finance_trends","name":"AI × 金融","enabled":true,"min_queries":3,"min_candidates":4}
    ]
  },
  "kol": {
    "min_dynamic_candidates": 10,
    "min_topic_expansion_selected": 3
  },
  "push": {
    "enabled": true,
    "target_policy": "primary_only",
    "hot_topics": 4,
    "featured_items": 3,
    "per_dimension": 1,
    "summary_chars": 160,
    "top3_dimensions": ["kol","oss","fin"],
    "title_prefix": "AI 每日情报",
    "targets": [
      {
        "id": "primary-lark",
        "name": "主情报机器人",
        "type": "lark",
        "env_key": "DAILY_INTEL_LARK_WEBHOOK",
        "secret_env_key": "DAILY_INTEL_LARK_SECRET",
        "role": "primary",
        "enabled": true
      }
    ]
  },
  "rss": {
    "enabled": true,
    "lookback_days": 7,
    "max_items_per_feed": 20,
    "timeout_seconds": 15,
    "feeds": [
      {
        "id": "openai-news",
        "name": "OpenAI News",
        "url": "https://openai.com/news/rss.xml",
        "enabled": true,
        "query_group": "community_hotspots",
        "dimension": "lab",
        "priority": "high"
      },
      {
        "id": "deepmind-blog",
        "name": "Google DeepMind Blog",
        "url": "https://deepmind.google/blog/rss.xml",
        "enabled": true,
        "query_group": "community_hotspots",
        "dimension": "lab",
        "priority": "high"
      },
      {
        "id": "huggingface-blog",
        "name": "Hugging Face Blog",
        "url": "https://huggingface.co/blog/feed.xml",
        "enabled": true,
        "query_group": "community_hotspots",
        "dimension": "oss",
        "priority": "normal"
      },
      {
        "id": "arxiv-cs-ai",
        "name": "arXiv cs.AI",
        "url": "https://export.arxiv.org/rss/cs.AI",
        "enabled": true,
        "query_group": "community_hotspots",
        "dimension": "paper",
        "priority": "normal"
      },
      {
        "id": "github-ai-ml",
        "name": "GitHub AI & ML",
        "url": "https://github.blog/ai-and-ml/feed/",
        "enabled": true,
        "query_group": "community_hotspots",
        "dimension": "oss",
        "priority": "normal"
      },
      {
        "id": "coindesk",
        "name": "CoinDesk",
        "url": "https://www.coindesk.com/arc/outboundfeeds/rss",
        "enabled": true,
        "query_group": "community_hotspots",
        "dimension": "fin",
        "priority": "normal"
      }
    ]
  }
};
