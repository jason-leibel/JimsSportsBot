const getCommandSportIcon = require("./getCommandSportIcon");
module.exports = (interaction, date, sportType) => {
    if (date.length !== 8) {
        interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)")
        return null
    }
    if (interaction.commandName === 'picks') {
        const gamesUrl = (!sportType.includes('ncaab')) ? process.env.API_GENERAL_URL.replace('SPORTTYPE', sportType).replace('DATE', date)
            : process.env.API_NCAAB_URL.replace('DATE', date),
            standingsUrl = process.env.API_GENERAL_STANDINGS_URL.replace('SPORTTYPE', sportType),
            teamStatsUrl = process.env.API_GAME_URL
        parseDateAndSend(interaction, date, `${getCommandSportIcon(sportType)} **AI ${sportType.toUpperCase()} GAME PICKS SCHEDULED FOR: ** *DATE*`)
        return { sportType, gamesUrl, standingsUrl, teamStatsUrl }
    } else if (interaction.commandName === 'summary') {
        const gamesUrl = (!sportType.includes('ncaab')) ? process.env.API_GENERAL_URL.replace('SPORTTYPE', sportType).replace('DATE', date)
            : process.env.API_NCAAB_URL.replace('DATE', date),
            standingsUrl = process.env.API_GENERAL_STANDINGS_URL.replace('SPORTTYPE', sportType)
        const ymd = parseDateAndSend(interaction, date, `${getCommandSportIcon(sportType)} **${sportType.toUpperCase()} SUMMARY OF: ** *DATE*`)
        return { sportType, gamesUrl, standingsUrl, date: ymd }
    } else if (interaction.commandName === 'games') {
        let gamesUrl = process.env.API_GENERAL_URL.replace('SPORTTYPE', sportType).replace('DATE', date)
        if (sportType === 'ncaab') gamesUrl = process.env.API_NCAAB_URL.replace('DATE', date)
        else if (sportType === 'mma') gamesUrl = process.env.API_UFC_URL.replace('DATE', date)
        parseDateAndSend(interaction, date, `${getCommandSportIcon(sportType)} **${sportType.toUpperCase()} SCHEDULED FOR: ** *DATE*`)
        return { sportType, gamesUrl }
    }
}

function parseDateAndSend(interaction, date, message) {
    const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
    interaction.reply(message.replace('DATE', `${year}-${month}-${day}`))
    return { year, month, day }
}
