/**
 * @file discord/events/onReady.ts
 * @author dworac <mail@dworac.com>
 *
 * Add slash commands to the Discord client on ready.
 */
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import Logger from "@dworac/logger";
import commands from "../commands";
import config from "../../config";

export default async (): Promise<void> => {
  try {
    const rest = new REST({ version: "10" }).setToken(config.DISCORD_BOT_TOKEN);

    const commandData: {
      name: string;
      description?: string;
      type?: number;
      options?: APIApplicationCommandOption[];
    }[] = [];

    commands.forEach((command) =>
      commandData.push(
        command.data.toJSON() as {
          name: string;
          description?: string;
          type?: number;
          options?: APIApplicationCommandOption[];
        }
      )
    );
    Logger.logInfo("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
      body: commandData,
    });
    Logger.logSuccess("Successfully reloaded application (/) commands.");
  } catch (err) {
    if (err instanceof Error) Logger.logError(err);
  }
};
