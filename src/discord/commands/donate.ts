/**
 * @file discord/commands/ping.ts
 * @author dworac <mail@dworac.com>
 *
 * Ping command as an example. Call it with /ping and add an input. The input will be returned.
 */
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "./Command";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("donate")
    .setDescription("Get donation information"),
  execute: async (interaction) => {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Donations`)
      .setAuthor({
        name: "Hyblock Unnoficial Bot (beta)",
        iconURL:
          "https://media.licdn.com/dms/image/C4D0BAQES6UacuySbaw/company-logo_200_200/0/1635373734562?e=2147483647&v=beta&t=gX6Ysbmav8n9yk_rKMQz2aJ4NnnVcQB_BuiYQD9pmj4",
      })
      .setDescription(
        "This bot is free and always will be. If you want to support the development of this bot and help cover the costs of running it, you can donate to the following addresses:"
      )
      .addFields(
        {
          name: "ETH/BSC or similar",
          value: "0x76FDE5eE2DB47B1a3FA4F68e8997E03f12a6156d",
          inline: false,
        },
        {
          name: "BTC",
          value: "bc1q2sau990cyfzhlepztx3549ujgq3kq6smwj39ea",
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Made with ❤️ by dworac" });

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};

export default command;
