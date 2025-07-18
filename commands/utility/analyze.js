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
                    { name: "Guerrilla", value: 1 },
                    { name: "Entrench", value: 2 }
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
                fancyDef = "Guerrilla";
                break;
            case 2:
                fancyDef = "Entrench";
                break;
        }
        if (naval) fancyAtk += " via sea";

        // analyze logic
        const [avgAtkDeaths, avgDefDeaths, avgAtkRetreats, avgDefRetreats, avgRounds, atkWinPct] = analyze(num_attackers, num_defenders, stance_attack, stance_defend, naval);
        
        // buncha logging shite
        const date = new Date();
        const time = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const time_spacer = " ".repeat(time.length + 3);
        console.log(`[${time}] ${interaction.user.tag} ran /analyze in ${interaction.guild?.name || 'DM'} #${interaction.channel?.name || 'DM'}`);
        console.log(time_spacer + "Input: " + [num_attackers, num_defenders, stance_attack, stance_defend, naval]);
        console.log(time_spacer + "Output: " + [avgAtkDeaths, avgDefDeaths, avgAtkRetreats, avgDefRetreats, avgRounds, atkWinPct]);

        // set thumbnail
        let thumbnail;
        if ( atkWinPct > 52 ) { thumbnail = "https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/assets/atkWinAnalyze.png" }
        else if (atkWinPct < 48) { thumbnail = "https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/assets/defWinAnalyze.png" }
        else { thumbnail = "https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/assets/unsureWinAnalyze.png "}

        // build the embed with the embed builder (waow)
		const battleEmbed = new EmbedBuilder()
            .setColor(0x3c3b6e)
            .setTitle(`Analysis: ${num_attackers} ${fancyAtk} vs. ${num_defenders} ${fancyDef}`)
            .setDescription("Note: Analysis may not be 100% accurate to real-world results")
            .setThumbnail(thumbnail)
            .addFields(
                { name: "Average attacker deaths", value: `${avgAtkDeaths}`, inline: true },
                { name: "Average defender deaths", value: `${avgDefDeaths}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Average attacker retreats", value: `${avgAtkRetreats}`, inline: true },
                { name: "Average defender retreats", value: `${avgDefRetreats}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Average rounds fought", value: `${avgRounds}`, inline: true },
                { name: "Attacker win probability", value: `${atkWinPct}%`, inline: true }
            )
            // .setImage(img) // will use later
            .setTimestamp()

        // update reply now that computation is done
        await interaction.editReply({ content: null, embeds: [battleEmbed] });
	},
};
