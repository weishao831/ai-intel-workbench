#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Shared helpers for the Daily Intelligence Workbench scripts."""

import datetime as _dt
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read_text(path):
    return Path(path).read_text(encoding="utf-8")


def write_text(path, text):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def today_date():
    return _dt.date.today().isoformat()


def normalize_date(value):
    if not value or value == "today":
        value = today_date()
    value = value.strip()
    if re.match(r"^\d{4}/\d{2}/\d{2}$", value):
        return value.replace("/", "-")
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
        raise SystemExit("日期格式应为 YYYY-MM-DD、YYYY/MM/DD 或 today")
    return value


def slash_date(value):
    return normalize_date(value).replace("-", "/")


def digest_path_for(date_value):
    return ROOT / "data" / slash_date(date_value) / "digest.js"


def manifest_path():
    return ROOT / "data" / "manifest.js"


def parse_simple_yaml(path):
    """Parse simple top-level YAML key/value pairs without external deps."""
    data = {}
    path = Path(path)
    if not path.exists():
        return data
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or ":" not in line or raw.startswith(" "):
            continue
        key, value = line.split(":", 1)
        value = re.split(r"\s+#", value, 1)[0].strip().strip('"').strip("'")
        data[key.strip()] = value
    return data


def deep_merge(base, extra):
    """Merge JSON-style mappings; arrays and scalars replace defaults."""
    if not isinstance(base, dict):
        base = {}
    if not isinstance(extra, dict):
        return base
    for key, value in extra.items():
        if isinstance(value, dict) and isinstance(base.get(key), dict):
            base[key] = deep_merge(dict(base[key]), value)
        else:
            base[key] = value
    return base


def parse_js_config(path):
    """Read `window.NAME = {...};` configuration without executing JavaScript."""
    path = Path(path)
    if not path.exists():
        return {}
    raw = read_text(path).strip()
    match = re.search(r"=\s*(\{[\s\S]*\})\s*;?\s*$", raw)
    if not match:
        raise ValueError("配置文件不是有效的 window.* JSON: %s" % path)
    value = json.loads(match.group(1))
    if not isinstance(value, dict):
        raise ValueError("配置根节点必须是对象: %s" % path)
    return value


def load_workbench_config():
    defaults = parse_js_config(ROOT / "config" / "workbench.js")
    kol_defaults = parse_js_config(ROOT / "config" / "kol.js")
    defaults = deep_merge(defaults, kol_defaults)
    user = parse_js_config(ROOT / "config" / "workbench.user.js")
    return deep_merge(defaults, user)


def enabled_kol_authors():
    return [
        row for row in (load_workbench_config().get("kol") or {}).get("authors") or []
        if isinstance(row, dict) and row.get("enabled", True)
    ]


def runtime_config():
    cfg = parse_simple_yaml(ROOT / "config" / "runtime.yaml")
    cfg = deep_merge(cfg, load_workbench_config().get("runtime") or {})
    env_cmd = os.environ.get("DAILY_INTEL_AGENT_CMD", "").strip()
    if env_cmd:
        cfg["agent_command"] = env_cmd
    return cfg


def load_json(path):
    return json.loads(read_text(path))


def js_string(value):
    return json.dumps(value, ensure_ascii=False)


def date_label(date_value):
    dt = _dt.date.fromisoformat(normalize_date(date_value))
    return dt.strftime("%Y年%m月%d日")


def extract_latest_from_manifest():
    path = manifest_path()
    if not path.exists():
        return None
    text = read_text(path)
    m = re.search(r'latest:\s*"([^"]+)"', text)
    return m.group(1) if m else None
