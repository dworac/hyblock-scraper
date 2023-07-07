/**
 * @file discord/commands/ping.ts
 * @author dworac <mail@dworac.com>
 *
 * Ping command as an example. Call it with /ping and add an input. The input will be returned.
 */
import { SlashCommandBuilder } from 'discord.js';
import { Command } from './Command';
import liquidationsLevels from "../../scraping/liquidationsLevels";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('pong')
		.setDescription('Replies with Ping!')
		.addStringOption((option) => {
			return option
				.setName('input')
				.setDescription('The input to echo back');
		}),
	execute: async (interaction) => {
		const input = interaction.options.data[0].value;

		// console.log(input);


		await interaction.reply(`Pong! ${input}`);
	},
};

export default command;
