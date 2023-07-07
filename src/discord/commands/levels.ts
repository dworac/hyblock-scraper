/**
 * @file discord/commands/ping.ts
 * @author dworac <mail@dworac.com>
 *
 * Ping command as an example. Call it with /ping and add an input. The input will be returned.
 */
import {AttachmentBuilder, SlashCommandBuilder} from 'discord.js';
import { Command } from './Command';
import liquidationsLevels from "../../scraping/liquidationsLevels";
import fs from "fs";
import Logger from "@dworac/logger";
import fetchCredentials from "../../scraping/fetchCredentials";
import symbols from "../../symbols";
import Discord from "../index";
const { EmbedBuilder } = require('discord.js');


let lastFeched = new Date(0)

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('levels')
		.setDescription('Replies with Ping!')
		.addStringOption((option) => {
			return option
				.setName('symbol')
				.setDescription('The symbol of the cryptocurrency such as BTC or ETH')
		}),
	execute: async (interaction) => {
		const input = interaction.options.data[0].value;

		if(!input){
			await interaction.reply("No input provided");
			return;
		}

		// Return if the input is not a string
		if (typeof input !== 'string') {
			await interaction.reply("Input is not a string");
			return;
		}

		// Valida if input is a valid symbol
		if(!symbols.includes(input.toLowerCase())){
			await interaction.reply("Invalid symbol");
			return;
		}

		// Check if the last fetch was less than 1 minute ago
		if(lastFeched.getTime() + 60000 > new Date().getTime()){
			await interaction.reply("Last fetch was less than 1 minute ago");
			return;
		}

		// await interaction.reply(`Fetching liquidation levels for: ${input.toLowerCase()}...`);
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('$ETH')
			.setURL('https://hyblockcapital.com/liquidationlevel')
			.setAuthor({ name: 'Hyblock Liquidations Levels (Beta)', iconURL: 'https://media.licdn.com/dms/image/C4D0BAQES6UacuySbaw/company-logo_200_200/0/1635373734562?e=2147483647&v=beta&t=gX6Ysbmav8n9yk_rKMQz2aJ4NnnVcQB_BuiYQD9pmj4' })
			.setDescription('Liquidation Levels are estimates of potential price levels where liquidation events may occur. If a trader knows the locations of other traders\' liquidation levels, it may provide an edge.')
			.setImage('https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921')
			.setTimestamp()
			.setFooter({ text: 'Made with ❤️ by dworac' });

		await interaction.reply({ embeds: [exampleEmbed] });


		lastFeched = new Date()

		let credentials = null;

		if(!fs.existsSync("credentials.json")){
			Logger.logInfo("[SCRAPE] No credentials.json found, fetching credentials")
			credentials = await fetchCredentials();
			fs.writeFileSync("credentials.json", JSON.stringify(credentials))
		}
		else{
			Logger.logInfo("[SCRAPE] credentials.json found, using credentials from file")
			credentials = JSON.parse(fs.readFileSync("credentials.json").toString())
		}

		const imageBuffer = await liquidationsLevels(credentials, input)

		// save image to file
		fs.writeFileSync("image.png", imageBuffer)

		const file = new AttachmentBuilder('image.png');

		const exampleEmbed2 = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('$ETH')
			.setURL('https://hyblockcapital.com/liquidationlevel')
			.setAuthor({ name: 'Hyblock Liquidations Levels (Beta)', iconURL: 'https://media.licdn.com/dms/image/C4D0BAQES6UacuySbaw/company-logo_200_200/0/1635373734562?e=2147483647&v=beta&t=gX6Ysbmav8n9yk_rKMQz2aJ4NnnVcQB_BuiYQD9pmj4' })
			.setDescription('Liquidation Levels are estimates of potential price levels where liquidation events may occur. If a trader knows the locations of other traders\' liquidation levels, it may provide an edge.')
			.setTimestamp()
			.setImage('attachment://image.png')
			.setFooter({ text: 'Made with ❤️ by dworac' });

		await interaction.editReply({ embeds: [exampleEmbed2], files: [file] });

	// 	Delete file
		fs.rmSync("image.png")
	},
};

export default command;
