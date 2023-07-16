/**
 * @file src/scraping/fetchCredentials.ts
 * @author dworac <mail@dworac.com>
 *
 *     This file is used to fetch the credentials from the website.
 */
import Logger from "@dworac/logger";

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

let credentials: any;
let credentialsDate = new Date(0);

export default async () => {
  if (credentials) {
    Logger.logInfo(
      "[FETCH CREDENTIALS] Credentials already fetched, returning them."
    );

    // Check if credentials are still valid (valid for 1 hour)
    if (new Date().getTime() - credentialsDate.getTime() < 3600000) {
      return credentials;
    }
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  Logger.logInfo("[FETCH_CREDENTIALS] Browser launched");
  const page = await browser.newPage();

  await page.goto("https://hyblockcapital.com/login");

  // wait for input #Email and #Password to appear and write in credentials
  await page.waitForSelector("#Email");
  await page.type("#Email", "dworac");
  await page.waitForSelector("#Password");
  await page.type("#Password", "Aasdf;lkj4325@");

  // // submit #my_login_form and wait for navigation to finish
  await Promise.all([
    page.evaluate(() => {
      document.querySelector("form button").click();
    }),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  Logger.logInfo("[FETCH_CREDENTIALS] Logged in");

  // get all localstorage values
  const localStorageValues = await page.evaluate(() => {
    const json = {};
    for (let i = 0; i < localStorage.length; i+=1) {
      const key = localStorage.key(i);
      if (key) {
        // @ts-ignore
        json[key] = localStorage.getItem(key);
      }
    }
    return json;
  });

  Logger.logInfo("[FETCH_CREDENTIALS] Finished fetching credentials");

  await browser.close();

  localStorageValues.registered = true;

  credentials = localStorageValues;

  credentialsDate = new Date();

  return credentials;
};
