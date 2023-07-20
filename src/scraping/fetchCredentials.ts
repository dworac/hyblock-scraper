/**
 * @file src/scraping/fetchCredentials.ts
 * @author dworac <mail@dworac.com>
 *
 *     This file is used to fetch the credentials from the website.
 */
import Logger from "@dworac/logger";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import config from "../config";

puppeteer.use(StealthPlugin());

class CredentialsFetcher {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private credentials: any;

  private credentialsDate: Date = new Date(0);

  async fetch() {
    Logger.logInfo("[FETCH_CREDENTIALS] Starting to fetch credentials...");
    if (this.credentials) {
      // Check if credentials are still valid (valid for 1 hour)
      if (new Date().getTime() - this.credentialsDate.getTime() < 3600000) {
        return;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      headless: config.PUPPETEER_HEADLESS,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    const browser = await puppeteer.launch(options);

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        document.querySelector("form button").click();
      }),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    Logger.logInfo("[FETCH_CREDENTIALS] Logged in");

    // get all localstorage values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const localStorageValues: any = await page.evaluate(() => {
      const json = {};
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          json[key] = localStorage.getItem(key);
        }
      }
      return json;
    });

    Logger.logInfo("[FETCH_CREDENTIALS] Finished fetching credentials");

    await browser.close();

    localStorageValues.registered = true;

    this.credentials = localStorageValues;
    this.credentialsDate = new Date();
  }

  async getCredentials() {
    await this.fetch();
    return this.credentials;
  }
}

const credentialsFetcher = new CredentialsFetcher();

export default credentialsFetcher;
