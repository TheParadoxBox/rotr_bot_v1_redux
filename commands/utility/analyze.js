const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { analyze } = require("../../functions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("analyze")
		.setDescription("Analyze the averages and chances of various aspects of a battle.")
        .addIntegerOption(option =>
            option.setName("num_attackers")
                .setDescription("The number of attacking troops")
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option.setName("stance_attack")
                .setDescription("The stance to be used by the attacking troops")
                .setRequired(true)
                .addChoices(
                    { name: "Assault", value: 0 },
                    { name: "Raid", value: 1 },
                    { name: "Shock", value: 2 }
                )
        )
        .addBooleanOption(option =>
            option.setName("naval")
                .setDescription("Whether or not this is a sea-to-land attack.")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option.setName("num_defenders")
                .setDescription("The number of defending troops")
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option.setName("stance_defend")
                .setDescription("The stance to be used by the defending troops")
                .setRequired(true)
                .addChoices(
                    { name: "Hold", value: 0 },
                    { name: "Retreat", value: 1 },
                    { name: "Entrench", value: 2 }
                )
        ),
    
	async execute(interaction) {
        // getters (what is this, java?)
        const num_attackers = interaction.options.getInteger("num_attackers");
        const stance_attack = interaction.options.getInteger("stance_attack");
        const naval = interaction.options.getBoolean("naval");
        const num_defenders = interaction.options.getInteger("num_defenders");
        const stance_defend = interaction.options.getInteger("stance_defend");

        // fancy stance names
        let fancyAtk;
        let fancyDef;
        switch(stance_attack) {
            case 0:
                fancyAtk = "Assault";
                break;
            case 1:
                fancyAtk = "Raid";
                break;
            case 2:
                fancyAtk = "Shock";
                break;
        }
        switch(stance_defend) {
            case 0:
                fancyDef = "Hold";
                break;
            case 1:
                fancyDef = "Retreat";
                break;
            case 2:
                fancyDef = "Entrench";
                break;
        }
        if (naval) fancyAtk += " via sea";

        // analyze logic
        const [avgAtkDeaths, avgDefDeaths, avgAtkRouts, avgDefRouts, avgRounds, atkWinPct] = analyze(num_attackers, num_defenders, stance_attack, stance_defend, naval);
        
        // set thumbnail
        let thumbnail;
        if ( atkWinPct > 51 ) { thumbnail = "https://TheParadoxBox.github.io/dump/atkWinAnalyze.png" }
        else if (atkWinPct < 49) { thumbnail = "https://TheParadoxBox.github.io/dump/defWinAnalyze.png" }
        else { thumbnail = "https://TheParadoxBox.github.io/dump/unsureWinAnalyze.png "}

        // build the embed with the embed builder (waow)
		const battleEmbed = new EmbedBuilder()
            .setColor(0x3c3b6e)
            .setTitle(`Analysis: ${num_attackers} ${fancyAtk} vs. ${num_defenders} ${fancyDef}`)
            .setThumbnail(thumbnail)
            .addFields(
                { name: "Average attacker deaths", value: `${avgAtkDeaths}`, inline: true },
                { name: "Average defender deaths", value: `${avgDefDeaths}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Average routed attackers", value: `${avgAtkRouts}`, inline: true },
                { name: "Average routed defenders", value: `${avgDefRouts}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Average rounds fought", value: `${avgRounds}`, inline: true },
                { name: "Attacker win probability", value: `${atkWinPct}%`, inline: true }
            )
            // .setImage(img) // will use later
            .setTimestamp()

        await interaction.reply({ embeds: [battleEmbed] });
	},
};
