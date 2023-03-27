const {SlashCommandBuilder} = require("discord.js");
module.exports = () => {
    return [
        new SlashCommandBuilder()
            .setName('games')
            .setDescription('🏀🏈⚽️🏒🥊⚾️ List all games happening today')
            .addStringOption(option =>
                option
                    .setName("league")
                    .setDescription("You must enter a league for which you want to list the games.")
                    .addChoices(
                        {name: 'NBA', value: 'nba'},
                        {name: 'NCAAB', value: 'ncaab'},
                        {name: 'NHL', value: 'nhl'},
                        {name: 'NFL', value: 'nfl'},
                        {name: 'NCAAF', value: 'ncaaf'},
                        {name: 'Soccer', value: 'soccer'},
                        {name: 'UFC', value: 'mma'},
                    )
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("date")
                    .setDescription("You must supply the date for the games you want to request (yyyymmdd)")
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('summary')
            .setDescription('🏀🏈⚽️🏒🥊⚾️ List the bots predictions in a summary')
            .addStringOption(option =>
                option
                    .setName("league")
                    .setDescription("You must enter a league for which you want to list the games.")
                    .addChoices(
                        {name: 'NBA', value: 'nba'},
                        {name: 'NCAAB', value: 'ncaab'},
                        {name: 'NHL', value: 'nhl'},
                        {name: 'NFL', value: 'nfl'},
                        {name: 'NCAAF', value: 'ncaaf'},
                    )
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("date")
                    .setDescription("You must supply the date for the games you want to request (yyyymmdd)")
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('picks')
            .setDescription('🏀🏈⚽️🏒🥊⚾️ List the bots picks in a summary')
            .addStringOption(option =>
                option
                    .setName("league")
                    .setDescription("You must enter a league for which you want to list the games.")
                    .addChoices(
                        {name: 'NBA', value: 'nba'},
                        {name: 'NCAAB', value: 'ncaab'},
                        {name: 'NHL', value: 'nhl'},
                        {name: 'NFL', value: 'nfl'},
                        {name: 'NCAAF', value: 'ncaaf'},
                    )
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("date")
                    .setDescription("You must supply the date for the games you want to request (yyyymmdd)")
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('stats')
            .setDescription('🏀🏈⚽️🏒🥊⚾️ Find player stats')
            .addStringOption(option =>
                option
                    .setName("league")
                    .setDescription("You must enter a league for which you want to list the games.")
                    .addChoices(
                        {name: '🏀NBA', value: 'nba'},
                        {name: '🏒NHL', value: 'nhl'},
                        {name: '🏈NFL', value: 'nfl'},
                        {name: '⚾️MLB', value: 'mlb'},
                    )
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('Please enter the player name.')
                    .setRequired(true)
                    .setAutocomplete(true)),
        new SlashCommandBuilder()
            .setName('props')
            .setDescription('🏀🏈⚽️🏒🥊⚾️ Find player prop picks')
            .addStringOption(option =>
                option
                    .setName("league")
                    .setDescription("You must enter a league for which you want to list the games.")
                    .addChoices(
                        {name: '🏀NBA', value: 'nba'},
                        {name: '🏀NCAAB', value: 'ncaab'},
                        {name: '🏒NHL', value: 'nhl'},
                    )
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("date")
                    .setDescription("You must supply the date for the games you want to request (yyyymmdd)")
                    .setRequired(true)
            ),
    ]
}
