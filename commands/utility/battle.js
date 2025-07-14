const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { battle } = require("../../functions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("battle")
		.setDescription("Simulate a battle between an attacking and defending state.")
        .addIntegerOption(option =>
            option.setName("num_attackers")
                .setDescription("The number of attacking troops")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10000)
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
                .setMaxValue(10000)
        )
        .addIntegerOption(option =>
            option.setName("stance_defend")
                .setDescription("The stance to be used by the defending troops")
                .setRequired(true)
                .addChoices(
                    { name: "Hold", value: 0 },
                    { name: "Guerilla", value: 1 },
                    { name: "Entrench", value: 2 }
                )
        )
        .addIntegerOption(option =>
            option.setName("crits")
                .setDescription("Whether or not to allow, disallow, or guarantee crits")
                .setRequired(true)
                .addChoices(
                    { name: "Standard crits", value: 0 },
                    { name: "No crits", value: 1 },
                    { name: "Guarantee round 1 crit for attackers", value: 2 },
                    { name: "Guarantee round 1 crit for defenders", value: 3 }
                )
        ),
    
	async execute(interaction) {
        // defer the reply until computation is done
        await interaction.deferReply();

        // getters (what is this, java?)
        const num_attackers = interaction.options.getInteger("num_attackers");
        const stance_attack = interaction.options.getInteger("stance_attack");
        const naval = interaction.options.getBoolean("naval");
        const num_defenders = interaction.options.getInteger("num_defenders");
        const stance_defend = interaction.options.getInteger("stance_defend");
        const crits = interaction.options.getInteger("crits");

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

        // fancy crit text
        let fancyCrit = "";
        switch(crits) {
            // case 0;
                // break;
            case 1:
                fancyCrit = "No crits";
                break;
            case 2:
                fancyCrit = "Crit guaranteed for attackers";
                break;
            case 3:
                fancyCrit = "Crit guaranteed for defenders";
                break;
        }

        // battle logic
        const [atkTroops, defTroops, atkRetreats, defRetreats, roundCount, atkCritCount, defCritCount] = battle(num_attackers, num_defenders, stance_attack, stance_defend, naval, crits);
        
        // buncha logging shite
        const date = new Date();
        const time = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const time_spacer = " ".repeat(time.length + 3);
        console.log(`[${time}] ${interaction.user.tag} ran /battle in ${interaction.guild?.name || 'DM'} #${interaction.channel?.name || 'DM'}`);
        console.log(time_spacer + "Input: " + [num_attackers, num_defenders, stance_attack, stance_defend, naval, crits]);
        console.log(time_spacer + "Output: " + [atkTroops, defTroops, atkRetreats, defRetreats, roundCount, atkCritCount, defCritCount]);
        
        let outcome = "Stalemate!";
        if ( atkTroops > 0 ) { outcome = "Attackers take the state!" }
        else if ( defTroops > 0 ) { outcome = "Defenders keep the state!" }
        
        // set thumbnail
        let thumbnail;
        if ( atkTroops > 0 ) { thumbnail = "https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/assets/atkWin.png" }
        else { thumbnail = "https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/assets/defWin.png" }

        // build the embed with the embed builder (waow)
		const battleEmbed = new EmbedBuilder()
            .setColor(0x3c3b6e)
            .setTitle(`Battle: ${num_attackers} ${fancyAtk} vs. ${num_defenders} ${fancyDef}`)
            .setThumbnail(thumbnail)
            .addFields(
                { name: "Remaining attackers", value: `${atkTroops}`, inline: true },
                { name: "Remaining defenders", value: `${defTroops}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Retreated attackers", value: `${atkRetreats}`, inline: true },
                { name: "Retreated defenders", value: `${defRetreats}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Total attacker crits", value: `${atkCritCount}`, inline: true },
                { name: "Total defender crits", value: `${defCritCount}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Rounds fought", value: `${roundCount}`, inline: true },
                { name: "Result", value: outcome, inline: true }
            )
            // .setImage(img) // will use later
            .setTimestamp()

        if (fancyCrit != "") { battleEmbed.setDescription(fancyCrit); }
        // update reply now that computation is done
        await interaction.editReply({ content: null, embeds: [battleEmbed] });
	},
};
