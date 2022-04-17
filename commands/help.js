const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a description about each command'),
    async execute(interaction) {
        await interaction.deferReply();
        const imgDir = './assests/';
        const img = 'botIcon.png';
        const attachment = new MessageAttachment(String(imgDir + img), img);
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Commands Information')
            .setThumbnail(`attachment://${img}`)
            .addField('Using the bot', 'Use the bot to get statistics or information about league of legends champions or a player\'s account.\nExecute a command using the following syntax `\'[command name] [optional arguments]`. Where the optional argument is explained when looking at a commands description.')
            .addField('/info server', 'Utility command which provides basic information about the server.')
            .addField('/info user', 'Similar to the `/info server` command but provides information about a member in the server.')
            .addField('/champion-info', 'Get a description about a champion.')
            .addField('/summoner-champion-mastery', 'Get information about the most played champions of a player.')
            .addField('/summoner-ranked-info', 'Get information about a player\'s current ranked season.')
            .addField('/summoner-recent-match', 'Get detailed information about a player\'s most recent match. This included information about all the 10 different players in the match.')
            .addField('\u200b', '*Reach out to `Xezc#6831` on Discord if you still need help or want to discuss the bot.*')
            .setTimestamp();
        interaction.editReply({ embeds: [embed], files: [attachment] });
    },
};