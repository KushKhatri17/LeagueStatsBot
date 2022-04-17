const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageAttachment } = require('discord.js');
const championData = require('../assests/champion.json');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('champion-info')
        .setDescription('Gets details about a champion.')
        .addStringOption(option =>
            option.setName('champion')
            .setDescription('The champion to search for.')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const championName = interaction.options.getString('champion').replace(/\b\w/g, c => c.toUpperCase());
        const thisChampData = championData.data[championName];
        if (thisChampData === undefined) {
            interaction.editReply('Champion not found.');
        }
        else {
            const imgDir = './assests/championImages/';
            const img = `${championName}.png`;
            const difficultyLevel = thisChampData.difficulty;
            let difficulty = '';
            if (difficultyLevel >= 8) {
                difficulty = 'High';
            }
            else if (difficulty <= 3) {
                difficulty = 'Moderate';
            }
            else {
                difficulty = 'Low';
            }
            const attachment = new MessageAttachment(String(imgDir + img), img);
            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle(`About ${thisChampData.id}`)
                .setURL(`https://www.leagueoflegends.com/en-gb/champions/${(thisChampData.id).toLowerCase()}/`)
                .setThumbnail(`attachment://${img}`)
                .addFields(
                    { name: 'Title', value: trim(`${thisChampData.name}, ${thisChampData.title}`, 1024) },
                    { name: 'Mini Lore', value: trim(`${thisChampData.blurb}`, 1024) },
                    { name: 'Class', value: trim(`${(thisChampData.tags).toString()}`, 1024) },
                    { name: 'Base Stats', value: trim(`HP: ${thisChampData.stats.hp}\nMovement speed: ${thisChampData.stats.movespeed}\nArmour: ${thisChampData.stats.armor}, Magic Resist: ${thisChampData.stats.spellblock}\nAttack Range: ${thisChampData.stats.attackrange}`, 1024) },
                )
                .setTimestamp();
            interaction.editReply({ embeds: [embed], files: [attachment] });
        }
    },
};