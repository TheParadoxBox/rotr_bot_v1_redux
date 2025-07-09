const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { battle } = require("../../functions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("battle")
		.setDescription("Simulate a battle between an attacking and defending state."),
	async execute(interaction) {
        const [atkTroops, defTroops, atkRouts, defRouts, roundCount, atkCritCount, defCritCount] = battle(100, 100, 0, 1, false);
        let outcome = "Stalemate!";
        if ( atkTroops > 1 ) { outcome = "Attackers take the state!" }
        else if ( defTroops > 1 ) { outcome = "Defenders keep the state!" }
		const battleEmbed = new EmbedBuilder()
            .setColor(0x3c3b6e)
            .setTitle("Texas (100, Assault) vs. Louisiana (100, Hold)")
            .setThumbnail("https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/commands/utility/img.png?token=GHSAT0AAAAAADBACVXYS3L7XS2S56IUD6TG2DN4CRA")
            .addFields(
                { name: "Remaining attackers", value: `${atkTroops}`, inline: true },
                { name: "Remaining defenders", value: `${defTroops}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Routed attackers", value: `${atkRouts}`, inline: true },
                { name: "Routed defenders", value: `${defRouts}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Total attacker crits", value: `${atkCritCount}`, inline: true },
                { name: "Total defender crits", value: `${defCritCount}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Rounds fought", value: `${roundCount}`, inline: true },
                { name: "Result", value: outcome, inline: true }
            )
            // .setImage(img) // will use later
            .setTimestamp()

        await interaction.reply({ embeds: [battleEmbed] });
	},
};
