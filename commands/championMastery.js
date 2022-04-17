const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const championData = require('../assests/champion.json');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { riotToken } = require('../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('summoner-champion-mastery')
        .setDescription('Gets details about a player\'s most played champions.')
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
            console.log(data);
            const userID = data.id;
            const userMasteryURL = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${userID}?api_key=${riotToken}`;
            const userMasteryRes = await fetch(userMasteryURL);
            const userMasteryJSON = await userMasteryRes.json();
            if (userMasteryJSON.length === 0) {
                interaction.editReply('An error occurred while retrieving info.');
            }
            else {
                const userMasteryInfo = userMasteryJSON.slice(0, 5);
                const allChamps = championData.data;
                const top5Champs = [];
                const allChampsNames = Object.keys(allChamps);
                allChampsNames.forEach((key, index) => {
                    const thisChampID = allChamps[key].key;
                    for (let i = 0; i < 5; i++) {
                        const championID = userMasteryInfo[i].championId;
                        if (thisChampID == championID) {
                            top5Champs.push([key, userMasteryInfo[i].championPoints]);
                        }
                    }
                });
                top5Champs.sort((a, b) => b[1] - a[1]);
                const imgDir = './assests/championImages/';
                const img = `${top5Champs[0][0]}.png`;
                const attachment = new MessageAttachment(String(imgDir + img), img);
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle(`${data.name}'s mastery stats`)
                    .setDescription(`The top 5 champions of ${data.name}`)
                    .setThumbnail(`attachment://${img}`)
                    .addFields(
                        { name: `1. ${top5Champs[0][0]}`, value: trim(`Champion Points: ${userMasteryInfo[0].championPoints}, Champion Mastery Level: ${userMasteryInfo[0].championLevel}\n`, 1024) },
                        { name: `2. ${top5Champs[1][0]}`, value: trim(`Champion Points: ${userMasteryInfo[1].championPoints}, Champion Mastery Level: ${userMasteryInfo[1].championLevel}\n`, 1024) },
                        { name: `3. ${top5Champs[2][0]}`, value: trim(`Champion Points: ${userMasteryInfo[2].championPoints}, Champion Mastery Level: ${userMasteryInfo[2].championLevel}\n`, 1024) },
                        { name: `4. ${top5Champs[3][0]}`, value: trim(`Champion Points: ${userMasteryInfo[3].championPoints}, Champion Mastery Level: ${userMasteryInfo[3].championLevel}\n`, 1024) },
                        { name: `5. ${top5Champs[4][0]}`, value: trim(`Champion Points: ${userMasteryInfo[4].championPoints}, Champion Mastery Level: ${userMasteryInfo[4].championLevel}`, 1024) },
                    )
                    .setTimestamp();
                interaction.editReply({ embeds: [embed], files: [attachment] });
            }
        }
    },
};
