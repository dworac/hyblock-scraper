/**
 * @file discord/commands/ping.ts
 * @author dworac <mail@dworac.com>
 *
 * Ping command as an example. Call it with /ping and add an input. The input will be returned.
 */
import {
  AttachmentBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import fs from "fs";
import Logger from "@dworac/logger";
import { Command } from "./Command";
import liquidationsLevels from "../../scraping/liquidationsLevels";
import fetchCredentials from "../../scraping/fetchCredentials";
import symbols from "../../symbols";

let lastFetched = new Date(0);

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("levels")
    .setDescription("Get liquidation levels for a symbol")
    .addStringOption((option) => {
      return option
        .setName("symbol")
        .setDescription("The symbol of the cryptocurrency such as BTC or ETH");
    }),
  execute: async (interaction) => {
    const input = interaction.options.data[0].value;

    if (!input) {
      await interaction.reply("No input provided");
      return;
    }

    // Return if the input is not a string
    if (typeof input !== "string") {
      await interaction.reply("Input is not a string");
      return;
    }

    // Valida if input is a valid symbol
    if (!symbols.includes(input.toUpperCase())) {
      await interaction.reply("Invalid symbol");
      return;
    }

    // Check if the last fetch was less than 1 minute ago
    if (lastFetched.getTime() + 60000 > new Date().getTime()) {
      await interaction.reply(
        "⌛ Please wait a minute before fetching again ⌛"
      );
      return;
    }

    // await interaction.reply(`Fetching liquidation levels for: ${input.toLowerCase()}...`);
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`$${input.toUpperCase()} Liquidation Levels`)
      .setURL("https://hyblockcapital.com/liquidationlevel")
      .setAuthor({
        name: "Hyblock Unnoficial Bot (beta)",
        iconURL:
          "https://media.licdn.com/dms/image/C4D0BAQES6UacuySbaw/company-logo_200_200/0/1635373734562?e=2147483647&v=beta&t=gX6Ysbmav8n9yk_rKMQz2aJ4NnnVcQB_BuiYQD9pmj4",
      })
      .setDescription(
        "Liquidation Levels are estimates of potential price levels where liquidation events may occur. If a trader knows the locations of other traders' liquidation levels, it may provide an edge."
      )
      .setImage(
        "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921"
      )
      .setTimestamp()
      .setFooter({ text: "Made with ❤️ by dworac" });

    await interaction.reply({ embeds: [exampleEmbed] });

    lastFetched = new Date();

    try {
      const credentials = await fetchCredentials.getCredentials();

      const imageBuffer = await liquidationsLevels(credentials, input);

      fs.writeFileSync("image.png", imageBuffer);
      const file = new AttachmentBuilder("image.png");
      exampleEmbed.setImage("attachment://image.png");

      await interaction.editReply({ embeds: [exampleEmbed], files: [file] });

      fs.rmSync("image.png");
      //   eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      Logger.logError(e);
      //   eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = {
        embeds: [],
        files: [],
        content:
          "An error occurred while fetching the liquidation levels, please try again later or contact dworac",
      };
      await interaction.editReply(options);
    }
  },
};

export default command;
