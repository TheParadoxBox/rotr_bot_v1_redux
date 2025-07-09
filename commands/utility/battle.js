const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { battle } = require("../../functions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("battle")
		.setDescription("Simulate a battle between an attacking and defending state.")
        .addStringOption(option =>
            option.setName("attacker")
                .setDescription("The name of the attacking state")
                .setRequired(true)
        )
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

        .addStringOption(option =>
            option.setName("defender")
                .setDescription("The name of the defending state")
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
        const attacker = interaction.options.getString("attacker");
        const num_attackers = interaction.options.getInteger("num_attackers");
        const stance_attack = interaction.options.getInteger("stance_attack");
        const naval = interaction.options.getBoolean("naval");
        const defender = interaction.options.getString("defender");
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

        // battle logic
        const [atkTroops, defTroops, atkRouts, defRouts, roundCount, atkCritCount, defCritCount] = battle(num_attackers, num_defenders, stance_attack, stance_defend, naval);
        let outcome = "Stalemate!";
        if ( atkTroops > 0 ) { outcome = "Attackers take the state!" }
        else if ( defTroops > 0 ) { outcome = "Defenders keep the state!" }
        
        // set thumbnail
        let thumbnail;
        if ( atkTroops > 0 ) { thumbnail = "https://TheParadoxBox.github.io/dump/atkWin.png" }
        else { thumbnail = "https://TheParadoxBox.github.io/dump/defWin.png" }

        // build the embed with the embed builder (waow)
		const battleEmbed = new EmbedBuilder()
            .setColor(0x3c3b6e)
            .setTitle(`${attacker} (${num_attackers}, ${fancyAtk}) vs. ${defender} (${num_defenders}, ${fancyDef})`)
            .setThumbnail(thumbnail)
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
