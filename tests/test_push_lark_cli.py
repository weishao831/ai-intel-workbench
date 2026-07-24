import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "push_lark.py"


class PushLarkCliTest(unittest.TestCase):
    def run_cli(self, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), *args],
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=10,
        )

    def test_help_never_pushes(self):
        result = self.run_cli("--help")
        self.assertEqual(result.returncode, 0)
        self.assertIn("usage:", result.stdout)
        self.assertNotIn("HTTP 200", result.stdout)
        self.assertNotIn("个机器人", result.stdout)

    def test_unknown_argument_fails_before_push(self):
        result = self.run_cli("--unknown-option")
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn("HTTP 200", result.stdout)
        self.assertNotIn("个机器人", result.stdout)


if __name__ == "__main__":
    unittest.main()
