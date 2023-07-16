/**
 * @file src/scraping/liquidationsLevels.ts
 * @author dworac <mail@dworac.com>
 *
 *     This file is used to fetch the liquidation levels from the Hyblock Capital website.
 */
import fs from "fs";
import path from "path";

const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

export default async (credentials: any, ticker: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  // Listen for all requests to the page
  page.on("request", (interceptedRequest: any) => {
    const url = interceptedRequest.url();
    let modifiedUrl = "";

    // Check if the request URL matches the one you're interested in
    if (
      url.includes("https://data.hyblockcapital.com/pythonPages/liq-level?")
    ) {
      // Modify the url, change 'sol' to 'btc'
      modifiedUrl = url.replace("ticker=sol", `ticker=${ticker}`);

      // Continue the request with the modified url
      interceptedRequest.continue({
        url: modifiedUrl,
      });
    } else {
      // If the request URL doesn't match, just continue as normal
      interceptedRequest.continue();
    }
  });

  // Set localstorage values of https://hyblockcapital.com/login to be localStorageValues
  await page.goto("https://hyblockcapital.com/login");

  await page.evaluate((c: { [x: string]: string }) => {
    for (const key in c) {
      localStorage.setItem(key, c[key]);
    }
  }, credentials);

  await page.goto("https://hyblockcapital.com/liquidationlevel");

  // wait until .my_plot is loaded
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
