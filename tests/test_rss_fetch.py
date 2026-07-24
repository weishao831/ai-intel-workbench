import datetime as dt
import tempfile
import unittest
from pathlib import Path

import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from rss_fetch import parse_feed


RSS_SAMPLE = b"""<?xml version="1.0"?>
<rss version="2.0"><channel><title>Sample</title>
  <item>
    <title>Fresh RSS item</title>
    <link>https://example.com/fresh</link>
    <pubDate>Thu, 23 Jul 2026 01:00:00 GMT</pubDate>
    <description><![CDATA[<p>A useful and attributable summary.</p>]]></description>
    <author>author@example.com</author>
  </item>
  <item>
    <title>Old RSS item</title>
    <link>https://example.com/old</link>
    <pubDate>Mon, 01 Jun 2026 01:00:00 GMT</pubDate>
    <description>Old</description>
  </item>
</channel></rss>"""

ATOM_SAMPLE = b"""<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Atom Sample</title>
  <entry>
    <title>Fresh Atom item</title>
    <link href="https://example.com/atom"/>
    <updated>2026-07-22T18:30:00Z</updated>
    <summary>Atom summary</summary>
    <author><name>Example Author</name></author>
  </entry>
</feed>"""


class RssFetchTest(unittest.TestCase):
    def test_parses_recent_rss_and_filters_old_items(self):
        rows = parse_feed(RSS_SAMPLE, dt.date(2026, 7, 23), 7, 20)
        self.assertEqual(1, len(rows))
        self.assertEqual("Fresh RSS item", rows[0]["title"])
        self.assertEqual("A useful and attributable summary.", rows[0]["excerpt"])

    def test_parses_atom_link_and_nested_author(self):
        rows = parse_feed(ATOM_SAMPLE, dt.date(2026, 7, 23), 7, 20)
        self.assertEqual(1, len(rows))
        self.assertEqual("https://example.com/atom", rows[0]["url"])
        self.assertEqual("Example Author", rows[0]["author"])


if __name__ == "__main__":
    unittest.main()
