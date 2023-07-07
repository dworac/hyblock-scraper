/**
 * @file index.ts
 * @author dworac <mail@dworac.com>
 *
 * This is the entry point for the application.
 */

import Logger from "@dworac/logger";
import sum from "./sum";

/**
 * Main function.
 */
async function main() {
  const res = sum(1, 2);
  Logger.logInfo(`1 + 2 = ${res}`);
}

main().catch((e) => {
  Logger.logError(e);
  process.exit(1);
});
