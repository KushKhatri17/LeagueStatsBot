const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { riotToken } = require('../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('summoner-ranked-info')
        .setDescription('Gets details about a player for the current season.')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('The player to search for.')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const username = interaction.options.getString('name');
        const initalUserDataURL = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${riotToken}`;

		const response = await fetch(initalUserDataURL);
        const data = await response.json();
        if ('status' in data) {
            console.log('player not found');
            interaction.editReply('Player not found');
        }
        else {
            const imgDir = './assests/';
            const img = 'lolIcon.png';
            const attachment = new MessageAttachment(String(imgDir + img), img);
            const userID = data.id;
            const userInfoURL = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${userID}?api_key=${riotToken}`;
            const userInfoRes = await fetch(userInfoURL);
            const userInfoResJSON = await userInfoRes.json();
            if (userInfoResJSON.length === 0) {
                interaction.editReply(`User: ${data.name} has not played any games this season`);
            }
            else {
                const userInfo = userInfoResJSON[0];
                const winPercentage = Math.round((userInfo.wins / (userInfo.wins + userInfo.losses)) * 100 * 100) / 100;
                let winningStreak = '';
                if (userInfo.hotStreak) {
                    winningStreak = 'On a winning streak of 3 or more games';
                }
                else {
                    winningStreak = 'Not on a winning streak';
                }
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle(`${userInfo.summonerName}'s ranked stats`)
                    .setThumbnail(`attachment://${img}`)
                    .addFields(
                        { name: 'Rank', value: trim(`${userInfo.tier} ${userInfo.rank} ${userInfo.leaguePoints} lp`, 1024) },
                        { name: 'Season Summary', value: trim(`Total Games Played: ${userInfo.wins + userInfo.losses}\nWins: ${userInfo.wins}\nLosses: ${userInfo.losses}\nWin Percentage: ${winPercentage}%`, 1024) },
                        { name: 'Winning streak', value: trim(winningStreak, 1024) },
                    )
                    .setTimestamp();
                interaction.editReply({ embeds: [embed], files: [attachment] });
            }
        }
    },
};