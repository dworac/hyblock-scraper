/**
 * @file src/config.ts
 * @author dworac <mail@dworac.com>
 *
 * This file is used to store the configuration of the app.
 */
import { ConfigVariable } from "@dworac/config";

class Config {
  @ConfigVariable(String)
  DISCORD_BOT_TOKEN!: string;

  @ConfigVariable(String)
  DISCORD_CLIENT_ID!: string;
}

const config = new Config();

export default config;
