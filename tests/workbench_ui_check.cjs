const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("dialog", (dialog) => dialog.accept());

  const url = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;
  await page.goto(url);
  await page.waitForLoadState("load");

  await page.locator(".nav-i", { hasText: "配置中心" }).click();
  await page.waitForSelector(".config-shell");
  const minTotal = page.locator('input[onchange*="quality.min_total_items"]');
  await minTotal.fill("15");
  await minTotal.dispatchEvent("change");
  await page.getByRole("button", { name: "保存", exact: true }).click();
  await page.reload();
  await page.locator(".nav-i", { hasText: "配置中心" }).click();
  if ((await minTotal.inputValue()) !== "15") {
    throw new Error("配置未在浏览器本地持久化");
  }
  await page.screenshot({ path: "/tmp/ai-intel-config-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "恢复默认" }).click();
  await page.getByRole("button", { name: "保存", exact: true }).click();

  await page.getByRole("button", { name: "KOL 作者" }).click();
  if ((await page.locator(".manage-row").count()) !== 12) {
    throw new Error("KOL 分页首屏数量不正确");
  }
  await page.screenshot({ path: "/tmp/ai-intel-kol-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "新增作者" }).click();
  await page.locator("#authorName").fill("UI Test Author");
  await page.locator("#authorHandle").fill("@ui_test_author");
  await page.locator("#authorField").fill("测试领域");
  await page.getByRole("button", { name: "保存作者" }).click();
  await page.locator("#kolSearchInput").fill("UI Test Author");
  await page.locator("#kolSearchInput").dispatchEvent("input");
  const authorRow = page.locator(".manage-row", { hasText: "UI Test Author" });
  if ((await authorRow.count()) !== 1) throw new Error("新增 KOL 作者失败");
  await authorRow.locator(".config-icon-btn.danger").click();
  await page.locator("#kolSearchInput").fill("");
  await page.locator("#kolSearchInput").dispatchEvent("input");

  await page.getByRole("button", { name: "推送机器人" }).click();
  if ((await page.locator(".target-row").count()) !== 1) {
    throw new Error("默认推送机器人数量不正确");
  }
  await page.screenshot({ path: "/tmp/ai-intel-push-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "新增机器人" }).click();
  await page.locator("#targetName").fill("UI Test Bot");
  await page.locator("#targetEnvKey").fill("DAILY_INTEL_LARK_WEBHOOK_TEST");
  await page.locator("#targetSecretKey").fill("not-an-env-name");
  await page.getByRole("button", { name: "保存机器人" }).click();
  if ((await page.locator("#targetDialog").getAttribute("open")) === null) {
    throw new Error("真实密钥样式输入未被配置中心拦截");
  }
  await page.locator("#targetSecretKey").fill("DAILY_INTEL_LARK_SECRET_TEST");
  await page.getByRole("button", { name: "保存机器人" }).click();
  const botRow = page.locator(".target-row", { hasText: "UI Test Bot" });
  if ((await botRow.count()) !== 1) throw new Error("新增推送机器人失败");
  await botRow.locator(".config-icon-btn.danger").click();
  await page.getByRole("button", { name: "保存", exact: true }).click();

  await page.locator(".nav-i", { hasText: "RSS 订阅源" }).click();
  await page.waitForSelector(".rss-list");
  if ((await page.locator(".rss-row").count()) !== 6) {
    throw new Error("默认 RSS 订阅源数量不正确");
  }
  await page.getByRole("button", { name: "新增订阅" }).click();
  await page.locator("#rssName").fill("UI Test Feed");
  await page.locator("#rssUrl").fill("https://example.com/feed.xml");
  await page.getByRole("button", { name: "保存订阅" }).click();
  if ((await page.locator(".rss-row").count()) !== 7) {
    throw new Error("新增 RSS 订阅源失败");
  }
  const testRow = page.locator(".rss-row", { hasText: "UI Test Feed" });
  await testRow.locator(".config-icon-btn.danger").click();
  if ((await page.locator(".rss-row").count()) !== 6) {
    throw new Error("删除 RSS 订阅源失败");
  }
  await page.getByRole("button", { name: "保存", exact: true }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1900);
  await page.screenshot({ path: "/tmp/ai-intel-rss-mobile.png", fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error(`移动端横向溢出 ${overflow}px`);
  if (errors.length) throw new Error(errors.join("\n"));

  console.log(JSON.stringify({
    configSaved: true,
    kolCrud: true,
    pushTargetCrud: true,
    rssDefaultCount: 6,
    rssCrud: true,
    mobileOverflow: overflow,
    screenshots: [
      "/tmp/ai-intel-config-desktop.png",
      "/tmp/ai-intel-kol-desktop.png",
      "/tmp/ai-intel-push-desktop.png",
      "/tmp/ai-intel-rss-mobile.png"
    ]
  }));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
