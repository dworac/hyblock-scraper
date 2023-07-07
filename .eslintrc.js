/**
 * @file .eslintrc.js
 * @author dworac <mail@dworac.com>
 *
 * This eslint config is based on the Airbnb style guide. It includes support for typescript, prettier, jest and jsdoc.
 */
module.exports = {
  extends: ["@dworac/eslint-config-typescript"],
  ignorePatterns: [
    "node_modules/*",
    "dist/*",
    "coverage/*",
    ".husky/*",
    ".github/*",
  ],
};
