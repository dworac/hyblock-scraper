/**
 * @file src/scraping/liquidationsLevels.ts
 * @author dworac <mail@dworac.com>
 *
 *     This file is used to fetch the liquidation levels from the Hyblock Capital website.
 */
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import config from "../config";

puppeteer.use(StealthPlugin());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (credentials: any, ticker: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    headless: config.PUPPETEER_HEADLESS,
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

    if (
      url.includes("https://data.new.hyblockcapital.com/liquidation-heatmap")
    ) {
      // modifiedUrl = `https://hbc-liqleveltoolheatmap.s3.amazonaws.com/binance_${ticker.toLowerCase()}_7d_test`;
      modifiedUrl = `https://data.new.hyblockcapital.com/liquidation-heatmap?exchange=binance&coin=${ticker.toLowerCase()}&lookback=7d`;
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

  await Promise.race([
    page.waitForSelector(".my_plot"),
    page.waitForSelector(".js-plotly-plot"),
  ]);

  await page.waitForTimeout(1000);

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: __dirname,
  });

  // delete myplot.png if it exists
  const myPlotPath = path.join(__dirname, "newplot.png");
  if (fs.existsSync(myPlotPath)) {
    fs.rmSync(myPlotPath);
  }

  // Click on element with data-title="Download plot as a png"
  await page.click('[data-title="Download plot as a png"]');

  // wait for newplot.png to be downloaded max 30 seconds
  let counter = 0;
  while (!fs.existsSync(myPlotPath) && counter < 30) {
    // eslint-disable-next-line no-await-in-loop
    await page.waitForTimeout(1000);
    counter += 1;
  }

  // Open downloaded file
  const file = fs.readFileSync(myPlotPath);

  await browser.close();

  return file;
};
