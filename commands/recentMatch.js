/* eslint-disable no-inner-declarations */
/* eslint-disable no-inline-comments */
/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { riotToken } = require('../config.json');
const summonerSpells = require('../assests/summonerSpells.json');

// https://stackoverflow.com/a/29341178
function secondsToMins(time) {
    return Math.floor(time / 60) + ':' + (time % 60 ? time % 60 : '00');
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('summoner-recent-match')
        .setDescription('Gets details about a player most recent match.')
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
            const userPuuid = data.puuid;
            const recentMatchURL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${userPuuid}/ids?start=0&count=1&api_key=${riotToken}`;
            const recentMatchRes = await fetch(recentMatchURL);
            const recentMatchResJSON = await recentMatchRes.json();
            if (recentMatchResJSON.length === 0) {
                interaction.editReply(`No recent games found for ${data.name}`);
            }
            else {
                const recentMatchID = recentMatchResJSON[0];
                const matchInfoURL = `https://europe.api.riotgames.com/lol/match/v5/matches/${recentMatchID}?api_key=${riotToken}`;
                const matchInfoRes = await fetch(matchInfoURL);
                const matchInfoResJSON = await matchInfoRes.json();
                if (matchInfoResJSON.info.participants.length !== 10) {
                    interaction.editReply('An error occured getting the match information, use the command again after playing a new match');
                }
                else {
                    const imgDir = './assests/';
                    const img = 'lolIcon.png';
                    const attachment = new MessageAttachment(String(imgDir + img), img);
                    const matchDate = new Date(matchInfoResJSON.info.gameCreation);
                    const wonGame = matchInfoResJSON.info.participants[0].win;
                    let gameResult = '';
                    if (wonGame) {
                        gameResult = 'Win';
                    }
                    else {
                        gameResult = 'Loss';
                    }
                    const matchDuration = (secondsToMins(parseInt(matchInfoResJSON.info.gameDuration)));
                    const gameMode = matchInfoResJSON.info.gameMode;
                    const allSummonerSpells = summonerSpells.data;
                    const allSummonerSpellsNames = Object.keys(allSummonerSpells);
                    const playersInfo = [];
                    function createInfoField(index) {
                        const info =
                        `•*Summoner spells*:  ${playersInfo[index].summonerSpells[0]}, ${playersInfo[index].summonerSpells[1]}  
                        •*KDA*:  ${playersInfo[index].kills}/${playersInfo[index].assists}/${playersInfo[index].death}
                        •*Champion*:  ${playersInfo[index].playerChampion}, Level ${playersInfo[index].champLevel}
                        •*Physical Damage Dealt*:  Damage to Champions:  ${playersInfo[index].physicalDamageDealtToChampions}, Total Physical Damage: ${playersInfo[index].physicalDamageDealt}
                        •*Magic Damage Dealt*:  Damage to Champions:  ${playersInfo[index].magicDamageDealtToChampions}, Total Magic Damage: ${playersInfo[index].magicDamageDealt}
                        •*True Damage Dealt*:  Damage to Champions:  ${playersInfo[index].trueDamageDealtToChampions}, Total True Damage: ${playersInfo[index].trueDamageDealt}
                        •*Other Damage Dealt*: Turret Damage:  ${playersInfo[index].damageDealtToTurrets}, Objective Damage: ${playersInfo[index].damageDealtToObjectives}
                        •*Damage Taken*: Physical Damage:  ${playersInfo[index].physicalDamageTaken}, Magic Damage: ${playersInfo[index].magicDamageTaken},\n     True Damage: ${playersInfo[index].trueDamageTaken}
                        •*Gold Earned*:  ${playersInfo[index].goldEarned}
                        •*Vision Scored*:  ${playersInfo[index].visionScore}`;
                        return info;
                    }
                    for (let i = 0; i < 10; i++) {
                        const player = matchInfoResJSON.info.participants[i];
                        const playerSummoners = [];
                        allSummonerSpellsNames.forEach((key, index) => {
                            const thisSummonerSpellID = allSummonerSpells[key].key;
                            const playerSummoner1 = player.summoner1Id;
                            const playerSummoner2 = player.summoner2Id;
                            if (thisSummonerSpellID == playerSummoner1 || thisSummonerSpellID == playerSummoner2) {
                                playerSummoners.push(allSummonerSpells[key].name);
                            }
                        });
                        const playerInfo = {
                            'playerName': player.summonerName,
                            'playerChampion': player.championName,
                            'kills': player.kills,
                            'assists': player.assists,
                            'death': player.deaths,
                            'lane': player.lane,
                            'champLevel': player.champLevel,
                            'damageDealtToBuildings': player.damageDealtToBuildings,
                            'damageDealtToObjectives': player.damageDealtToObjectives,
                            'damageDealtToTurrets': player.damageDealtToTurrets,
                            'damageSelfMitigated': player.damageSelfMitigated,
                            'controlWards': player.detectorWardsPlaced,
                            'magicDamageDealt': player.magicDamageDealt,
                            'magicDamageDealtToChampions': player.magicDamageDealtToChampions,
                            'magicDamageTaken': player.magicDamageTaken,
                            'cs': player.totalMinionsKilled,
                            'physicalDamageDealt': player.physicalDamageDealt,
                            'physicalDamageDealtToChampions': player.physicalDamageDealtToChampions,
                            'physicalDamageTaken': player.physicalDamageTaken,
                            'healingDone': player.totalHeal,
                            'trueDamageDealt': player.trueDamageDealt,
                            'trueDamageDealtToChampions': player.trueDamageDealtToChampions,
                            'trueDamageTaken': player.trueDamageTaken,
                            'role': player.role,
                            'goldEarned': player.goldEarned,
                            'visionScore': player.visionScore,
                            'summonerSpells': playerSummoners,
                        };
                        playersInfo.push(playerInfo);
                    }
                    const playerTeamEmbed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${username}'s Recent Game`)
                        .setThumbnail(`attachment://${img}`)
                        .setDescription(`**Game mode**: ${gameMode}, **Game Result**: ${gameResult}, [1/2]`)
                        .addFields(
                            { name: '\u200b', value: '\u200b', inline: true },
                            { name: '**Team 1**', value: '\u200b', inline: true },
                            { name: '\u200b', value: '\u200b', inline: true },
                        )
                        .addField(`${playersInfo[0].playerName}`, `${createInfoField(0)}`)
                        .addField(`${playersInfo[1].playerName}`, `${createInfoField(1)}`)
                        .addField(`${playersInfo[2].playerName}`, `${createInfoField(2)}`)
                        .addField(`${playersInfo[3].playerName}`, `${createInfoField(3)}`)
                        .addField(`${playersInfo[4].playerName}`, `${createInfoField(4)}`)
                        .setTimestamp();

                    const enemyTeamEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`${username}'s Recent Game: Enemy Team`)
                        .setThumbnail(`attachment://${img}`)
                        .setDescription('[2/2]')
                        .addFields(
                            { name: '\u200b', value: '\u200b', inline: true },
                            { name: '**Team 2**', value: '\u200b', inline: true },
                            { name: '\u200b', value: '\u200b', inline: true },
                        )
                        .addField(`${playersInfo[5].playerName}`, `${createInfoField(5)}`)
                        .addField(`${playersInfo[6].playerName}`, `${createInfoField(6)}`)
                        .addField(`${playersInfo[7].playerName}`, `${createInfoField(7)}`)
                        .addField(`${playersInfo[8].playerName}`, `${createInfoField(8)}`)
                        .addField(`${playersInfo[9].playerName}`, `${createInfoField(9)}`)
                        .setTimestamp();
                    await interaction.editReply({ embeds: [playerTeamEmbed], files: [attachment] });
                    await interaction.followUp({ embeds: [enemyTeamEmbed], files: [attachment] });
                }
            }
        }
    },
};
