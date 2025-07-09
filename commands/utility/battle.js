const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('battle')
		.setDescription('Simulate a battle between an attacking and defending state.'),
	async execute(interaction) {
		await interaction.reply('People died. :(');
	},
};
