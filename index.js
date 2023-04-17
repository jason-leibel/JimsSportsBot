require("dotenv").config()
const {Client, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder} = require("discord.js")
const getPredictions = require('./helpers/getPredictions')
const getGamesForDate = require('./helpers/getGamesForDate')
const getBotPredictionSummary = require('./helpers/getBotPredictionSummary')
const getPlayerPropPicks = require('./helpers/getPlayerPropPicks')
const getGamesList = require('./helpers/getGamesList')
const getApiUrls = require('./helpers/getApiUrls')
const getPlayerStats = require('./helpers/getPlayerStats')
const filterName = require('./helpers/filterPlayerName')
const commandsList = require('./commands')
const fs = require("fs");
const moment = require("moment");

let playerList = {}, currentDate = '', sportType = ''
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.once("ready", () => {
    console.log("Bot ready...")
    const guild = client.guilds.cache.get(process.env.GUILD_ID)
    //guild.commands.set([])
    scheduleCommands()
    console.log("Commands Scheduled...")

    fs.readFile('./dataSource/players.json', 'utf8', function (error, players) {
        if (error) console.log(error)
        else playerList = JSON.parse(players)
    })
    commandsList().forEach(command => {
        client.application.commands.create(command, process.env.GUILD_ID)
    })

    console.log("Commands Added")
})

client.on(Events.InteractionCreate, interaction => {
    if (interaction.isChatInputCommand()) {
        sportType = interaction.options.getString('league')
        if (interaction.commandName === 'picks') {
            const urls = getApiUrls(interaction, interaction.options.getString("date"), sportType)
            console.log(urls)
            if (!urls) return
            getPredictions(interaction.channel, urls.gamesUrl, urls.standingsUrl, urls.teamStatsUrl, urls.sportType)
        } else if (interaction.commandName === 'summary') {
            const urls = getApiUrls(interaction, interaction.options.getString("date"), sportType)
            console.log(urls)
            if (!urls) return
            getBotPredictionSummary(interaction.channel, urls.gamesUrl, urls.standingsUrl, urls.sportType, urls.date)
        } else if (interaction.commandName === 'games') {
            const urls = getApiUrls(interaction, interaction.options.getString("date"), sportType)
            if (!urls) return
            getGamesForDate(interaction.channel, urls.gamesUrl, urls.sportType)
        } else if (interaction.commandName === 'stats') {
            interaction.reply(`***Here Are Stats For: *** ${filterName(interaction.options.getString('name')).name}`)
            getPlayerStats(interaction.options.getString('name'), interaction.channel, sportType)
        } else if (interaction.commandName === 'props') {
            currentDate = interaction.options.getString("date")
            getGamesList(interaction, interaction.options.getString("date"), sportType)
        }
    } else if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'stats') {
            sportType = interaction.options.getString('league')
            let suggested = playerList[`${sportType}Players`].filter(v => v.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
            interaction.respond(suggested.splice(0, 25));
        }
    } else if (interaction.isStringSelectMenu()) {
        if (currentDate.length !== 8) interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)");
        const year = currentDate.substring(0, 4), month = currentDate.substring(4, 6), day = currentDate.substring(6, 8)
        interaction.reply(`***Here Are Player Prop Bets For: *** *${year}-${month}-${day}*`)
        getPlayerPropPicks(interaction.channel, currentDate, interaction.values, sportType)
    }
})

client.login(process.env.TOKEN)

function scheduleCommands() {
    const channels = [{name: "🏈—college-picks—🏀", values: ['ncaab', 'ncaaf'], id: '1085271102126837851'},
            {name: "🏈——nfl-picks——🏈", values: ['nfl'], id: '1085270362792677407'}, {name: "🏒——nhl-picks——🏒", values: ['nhl'], id: '1085270430484533328'},
            {name: "🏀——nba-picks——🏀", values: ['nba'], id: '1085270577746550895'}, {name: "⚽—soccer—picks—⚽", values: ['soccer'], id: '1087777168483954809'},
            {name: "🥊—-mma-picks—-🥊", values: ['mma'], id: '1085272087431753819'}],
        today = moment().format("YYYYMMDD")
    channels.forEach(channelList => {
        channelList.values.forEach(type => {
            const urls = getApiUrls({commandName: 'games'}, today, type, false)
            const channel = client.channels.cache.find(channel => channel.id === channelList.id)
            if (channel) {
                getGamesForDate(channel, urls.gamesUrl, urls.sportType)
            }
        })
    })
}
