# LeagueStatsBot

## Description
A simple discord bot which provides a player's league of legends information and other basic user's discord information. Created using :
1. Node.js, https://nodejs.org/en/
2. discord.js, https://discord.js.org/#/
3. Riot Games API, https://developer.riotgames.com/apis

### Commands currently implemented
1. info user: Gets the information about a user's discord account
2. info server: Gets information about the current server which the bot is in
3. champion-info: Gets information about a League of Legends champion
4. summoner-champion-mastery: Gets information about a player's most played champions in League of Legends
5. summoner-recent-match: Gives a detailed breakdown about a player's last match, this cannot be a custom game otherwise an error message is displayed
6. summoner-ranked-info: Gets information about a player's performance for the current ranked season

### Getting started with the bot 
Firstly, to use the bot clone this repo and edit the values in the `config.json` file to change the values to your API keys. The `.gitignore` file includes `config.json`
and it should be kept in there if you decide to upload your repo to github or other public site. I recommned following the guide provided by discord.js at, 
https://discordjs.guide/preparations/setting-up-a-bot-application.html to get started with the bot. 

Once the bot is in your discord server, use `node deploy-command.js` and then `node bot.js` to bring the bot online. Once the `bot.js` stops executing, the bot will go offline. If you add a new command or edit a command, you will need to call `node deploy-command.js` before `bot.js` to get the commands to show up discord.

The bot currently uses data from patch 12.7.1 to get all the champion information. In the future you might need to update the `champion` folder and the `champion.json` file 
depending on the latest version released by Riot. You can check the lastet version at, https://developer.riotgames.com/docs/lol#data-dragon_champions and download the 
required data.

#### Riot API Key
If you decide to add to the bot and use a development API Key, then you will need to change the value of `riotToken` to a new key every 24 hours in the `config.json`
file.

#### Discord
If you would like to ask any questions about the bot you can reach out to me on discord: `Xezc#6831`
(Currently not working on this project anymore)
