/**
 * @file index.ts
 * @author dworac <mail@dworac.com>
 *
 * This is the entry point for the application.
 */

import Logger from "@dworac/logger";
import sum from "./sum";
import scraping from "./scraping";
import discord from "./discord";

/**
 * Main function.
 */
async function main() {
  // await scraping()
  await discord()
}

main().catch((e) => {
  Logger.logError(e);
  process.exit(1);
});
