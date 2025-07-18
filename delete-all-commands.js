// generated by chatgpt

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Fetching global commands...');
    const commands = await rest.get(
      Routes.applicationCommands(clientId)
    );

    for (const command of commands) {
      console.log(`Deleting global command: ${command.name}`);
      await rest.delete(
        Routes.applicationCommand(clientId, command.id)
      );
    }

    console.log('All global commands deleted.');
  } catch (error) {
    console.error(error);
  }
})();

(async () => {
  try {
    console.log('Fetching guild commands...');
    const commands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId)
    );

    for (const command of commands) {
      console.log(`Deleting global command: ${command.name}`);
      await rest.delete(
        Routes.applicationGuildCommand(clientId, guildId, command.id)
      );
    }

    console.log('All guild commands deleted.');
  } catch (error) {
    console.error(error);
  }
})();