require("dotenv").config()
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const getCommandSportIcon = require('./helpers/getCommandSportIcon')
const getPredictions = require('./helpers/getPredictions')
const getGamesForDate = require('./helpers/getGamesForDate')
const getBotPredictionSummary = require('./helpers/getBotPredictionSummary')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.once("ready", () => {
    console.log("Bot ready...")
    const sportsCommands = ['ncaab', 'nba', 'nhl', 'nfl', 'ncaaf', 'mma', 'nbapicks', 'ncaabpicks', 'nhlpicks', 'nflpicks', 'ncaafpicks', 'nbasummary', 'ncaabsummary', 'nhlsummary'],
        commandNames = [{ name: 'ncaablive', description: `${getCommandSportIcon('ncaab')}Live scores for NCAAB`}]
    sportsCommands.forEach(name => {
        let description = ''
        if (name.includes('summary')) {
            description = `Bot performance summary for ${name.toUpperCase()} on a given date`
        } else if (name.includes('picks')) {
            description = `Predict winner for ${name.toUpperCase()} games for a given date.`
        } else {
            description = `Fetch list of ${name.toUpperCase()} games with betting odds for a given date.`
        }
        client.application.commands.create(new SlashCommandBuilder()
            .setName(name)
            .setDescription(`${getCommandSportIcon(name)} ${description}`)
            .addStringOption(option =>
                option
                    .setName("date")
                    .setDescription("You must supply the date for the games you want to request (yyyymmdd)")
                    .setRequired(true)
            ), process.env.GUILD_ID)
    })

    commandNames.forEach(command => {
        client.application.commands.create(new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description), process.env.GUILD_ID)
    })

    console.log("Commands Added")
})

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;
    const sportType = interaction.commandName

    if (sportType.includes('picks')) {
        const date = interaction.options.getString("date")
        if (date.length !== 8) interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)");
        const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
        let strippedType = sportType.replace('picks', '')
        interaction.reply(`${getCommandSportIcon(strippedType)} **AI ${sportType.toUpperCase()} GAME PICKS SCHEDULED FOR: ** *${year}-${month}-${day}*`)
        let gamesUrl = process.env.API_GENERAL_URL.replace('SPORTTYPE', strippedType).replace('DATE', date),
            standingsUrl = process.env.API_GENERAL_STANDINGS_URL.replace('SPORTTYPE', strippedType),
            teamStatsUrl = process.env.API_GAME_URL
        if (strippedType.includes('ncaab')) {
            gamesUrl = process.env.API_NCAAB_URL.replace('DATE', date)
        }

        console.log({strippedType, gamesUrl, standingsUrl, teamStatsUrl})
        getPredictions(interaction.channel, gamesUrl, standingsUrl, teamStatsUrl, strippedType)
    } else if (sportType.includes('summary')) {
        const date = interaction.options.getString("date")
        if (date.length !== 8) interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)");
        const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
        const strippedType = sportType.replace('summary', ''),
            standingsUrl = process.env.API_GENERAL_STANDINGS_URL.replace('SPORTTYPE', strippedType)
        let gamesUrl = process.env.API_GENERAL_URL.replace('SPORTTYPE', strippedType).replace('DATE', date)
        interaction.reply(`${getCommandSportIcon(strippedType)} **${strippedType.toUpperCase()} SUMMARY OF: ** *${year}-${month}-${day}*`)
        if (strippedType.includes('ncaab')) {
            gamesUrl = `https://api.actionnetwork.com/web/v1/scoreboard/${strippedType}?period=game&bookIds=15&division=D1&date=${date}&tournament=0`
        }
        console.log({
            strippedType,
            gamesUrl
        })
        getBotPredictionSummary(interaction.channel, gamesUrl, standingsUrl, strippedType, {year, month, day})
    } else if (sportType === 'ncaablive') {
        interaction.reply(`${getCommandSportIcon(sportType)} NCAAB Live Scores:`)
        getLiveScore(interaction.channel)
    } else {
        const date = interaction.options.getString("date")
        if (date.length !== 8) interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)");
        const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
        let gamesUrl = process.env.API_GENERAL_URL.replace('SPORTTYPE', sportType).replace('DATE', date)
        if (sportType === 'ncaab') {
            gamesUrl = process.env.API_NCAAB_URL.replace('DATE', date)
        } else if (sportType === 'mma') {
            gamesUrl = process.env.API_UFC_URL.replace('DATE', date)
        }
        interaction.reply(`${getCommandSportIcon(sportType)} **${sportType.toUpperCase()} SCHEDULED FOR: ** *${year}-${month}-${day}*`)
        getGamesForDate(interaction.channel, gamesUrl, sportType)
    }
})

function getLiveScore(channel) {
    const ncaaScoreUrl = process.env.MARCH_MADNESS_LIVE_SCORE_URL

    const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}
    fetch(ncaaScoreUrl, fetchConfig).then(r => r.json()).then(r => {
        const test = new EmbedBuilder()
            .setTitle('Live NCAA Scores:')
            .setColor('#65dcd8')
        r.data.mmlContests.forEach(game => {
            const period = (game.currentPeriod === 'HALFTIME' || game.currentPeriod === 'FINAL') ?
                game.currentPeriod.toLowerCase().charAt(0).toUpperCase()  + game.currentPeriod.toLowerCase().slice(1) : game.currentPeriod,
                team1 = game.teams[0], team2 = game.teams[1]
            const hasExcitementAlert = game.hasExcitementAlert
            if (period !== '') {
                test.addFields([
                    {
                        name: `${hasExcitementAlert ? ':fire:' : `${(period !== 'Final') ? ':arrow_forward:' : ''}`}${team1.nameShort} vs ${team2.nameShort} (${period}${(game.contestClock !== '') ? ` ${game.contestClock}` : ''})`,
                        value: `*${team1.nameShort.toLowerCase()}:* ${team1.score} *${team2.nameShort.toLowerCase()}:* ${team2.score}`
                    }
                ])
            }
        })
        // Update message every 10 seconds.
        channel.send({ embeds: [test]})
            .then(msg => {
                setInterval(() => {
                    fetch(ncaaScoreUrl, fetchConfig).then(r => r.json()).then(r => {
                        const exampleEmbed = new EmbedBuilder()
                            .setTitle('Live NCAA Scores:')
                            .setColor('#65dcd8')
                        console.log("Updated!")
                        r.data.mmlContests.forEach(game => {
                            const period = (game.currentPeriod === 'HALFTIME' || game.currentPeriod === 'FINAL') ?
                                game.currentPeriod.toLowerCase().charAt(0).toUpperCase()  + game.currentPeriod.toLowerCase().slice(1) : game.currentPeriod,
                                team1 = game.teams[0], team2 = game.teams[1]
                            const hasExcitementAlert = game.hasExcitementAlert
                            if (period !== '') {
                                exampleEmbed.addFields([
                                    {
                                        name: `${hasExcitementAlert ? ':fire:' : `${(period !== 'Final') ? ':arrow_forward:' : ''}`}${team1.nameShort} vs ${team2.nameShort} (${period}${(game.contestClock !== '') ? ` ${game.contestClock}` : ''})`,
                                        value: `*${team1.nameShort.toLowerCase()}:* ${team1.score} *${team2.nameShort.toLowerCase()}:* ${team2.score}`
                                    }
                                ])
                            }
                        })
                        msg.edit({ embeds: [exampleEmbed] });
                    })
                }, 7500)
            })
    })
}

client.login(process.env.TOKEN)


