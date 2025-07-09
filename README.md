# rotr_bot_v1_redux
*Affectionately known as "Region Reigner 5000"*

A discord.js bot to run the latest edition of Reign of the Regions, a Discord-based wargame.

## Credits

Original concept ("Virginia Memorial Battle Simulator"): Jean

Design: Jean, SyFi, AOE, paradox

Bot: paradox

Creator of RotR and the reason we needed a bot in the first place: Mars

## Installation

1. Run ``npm install`` in this directory.
2. Create an app at https://discord.com/developers/applications. Optionally, give your app and bot (left panel) a cool name, profile picture, description, etc.
3. In the Bot page, click "reset token" to get your bot token. **Do not share this with anybody.**
4. In the OAuth2 page, copy your client ID.
5. Also in the OAuth2 page, select ``applications.commands`` and ``bot`` under OAuth2 URL Generator and use the generated URL to add your bot to a server.
6. Create a file called ``config.json`` in this directory and add the following info:
    ```json
    {
	"token": "[your bot token]",
	"clientId": "[your client ID]"
    }
    ```
7. Run the file ``global-deploy-commands.js`` in this directory.
8. Run the file ``bot.js`` in this directory to start the bot. It may take up to an hour for your commands to be deployed (that's on Discord's side, not ours).

### Faster deployment (per-server)

Testing edits to the bot or just impatient? You can also deploy commands per-server.

1. Enable Discord developer mode if you haven't already, then right click your desired server's name or icon and click "Copy Server ID".
2. Put this ID in ``config.json`` as follows:
    ```json
    {
	"token": "[your bot token]",
	"clientId": "[your client ID]",
    "guildId": "[your server ID]"
    }
    ```
3. If you previously ran ``global-deploy-commands.js``, run ``delete-all-commands.js`` to remove duplicate versions of the bot's commands.
4. Run ``guild-deploy-commands.js`` and start the bot.