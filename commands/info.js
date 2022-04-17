const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a user or the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info about the server')),
    async execute(interaction) {
        await interaction.deferReply();
        const embed = new MessageEmbed();
        if (interaction.options.getSubcommand() === 'user') {
            const user = interaction.options.getUser('target');
            if (user) {
                embed
                    .setColor('BLUE')
                    .setTitle(`Information about ${user.username}`)
                    .setThumbnail(user.avatarURL())
                    .addFields(
                        { name: 'Tag', value: `${user.tag}` },
                        { name: 'ID', value: `${user.id}` },
                        { name: 'Account creation date', value: `${user.createdAt}` },
                    )
                    .setTimestamp();
            }
            else {
                embed
                    .setColor('BLUE')
                    .setTitle('Your information')
                    .setThumbnail(interaction.user.avatarURL())
                    .addFields(
                        { name: 'Tag', value: `${interaction.user.tag}` },
                        { name: 'ID', value: `${interaction.user.id}` },
                        { name: 'Account creation date', value: `${interaction.user.createdAt}` },
                    )
                    .setTimestamp();
            }
        }
        else if (interaction.options.getSubcommand() === 'server') {
            embed
                .setColor('BLUE')
                .setTitle('Server Information')
                .setThumbnail(interaction.guild.iconURL())
                .addFields(
                    { name: 'Sever Name', value: `${interaction.guild.name}` },
                    { name: 'Total members', value: `${interaction.guild.memberCount}` },
                )
                .setTimestamp();
        }
        interaction.editReply({ embeds: [embed] });
    },
};