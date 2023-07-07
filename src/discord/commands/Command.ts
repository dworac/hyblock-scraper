/**
 * @file discord/commands/Command.ts
 * @author dworac <mail@dworac.com>
 *
 * All commands must extend this class.
 */
import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface Command {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
	execute: (interaction: CommandInteraction) => Promise<void>;
}
