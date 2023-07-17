/**
 * @file src/scraping/liquidationsLevels.ts
 * @author dworac <mail@dworac.com>
 *
 *     This file is used to fetch the liquidation levels from the Hyblock Capital website.
 */
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
puppeteer.use(StealthPlugin());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (credentials: any, ticker: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page.on("request", (interceptedRequest: any) => {
    const url = interceptedRequest.url();
    let modifiedUrl = "";

    if (url.includes("https://hbc-liqleveltoolheatmap.s3.amazonaws.com")) {
      modifiedUrl = `https://hbc-liqleveltoolheatmap.s3.amazonaws.com/binance_${ticker.toLowerCase()}_7d_test`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = { url: modifiedUrl };
      interceptedRequest.continue(params);
    } else {
      interceptedRequest.continue();
    }
  });

  await page.goto("https://hyblockcapital.com/login");

  await page.evaluate((c: { [x: string]: string }) => {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in c) {
      localStorage.setItem(key, c[key]);
    }
  }, credentials);

  await page.goto("https://hyblockcapital.com/liquidationlevel-heatmap");

  await page.waitForSelector(".my_plot");

  await page.waitForTimeout(1000);

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: __dirname,
  });

  // Click on element with data-title="Download plot as a png"
  await page.click('[data-title="Download plot as a png"]');

  // Wait for download to finish
  await page.waitForTimeout(1000);

  // Open downloaded file
  const file = fs.readFileSync(path.join(__dirname, "newplot.png"));

  await browser.close();

  return file;
};
