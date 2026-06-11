import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning")
    console.log(`[console.${msg.type()}]`, msg.text().slice(0, 500));
});
page.on("pageerror", (err) => console.log("[pageerror]", String(err).slice(0, 500)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3500); // let preloader finish
await page.screenshot({ path: "scripts/hero.png" });
await page.mouse.move(900, 300);
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/hero-mouse.png" });
await browser.close();
console.log("done");
