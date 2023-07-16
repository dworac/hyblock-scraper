/**
 * @file discord/commands/index.ts
 * @author dworac <mail@dworac.com>
 *
 * This file exports all commands.
 */
import { Collection } from "discord.js";
import levels from "./levels";
import { Command } from "./Command";

const commands = [levels];

const collection = new Collection<string, Command>();

commands.forEach((command) => {
  collection.set(command.data.name, command);
});

export default collection;
