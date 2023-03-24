require("dotenv").config()
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const getCommandSportIcon = require('./helpers/getCommandSportIcon')
const getPredictions = require('./helpers/getPredictions')
const getGamesForDate = require('./helpers/getGamesForDate')
const getBotPredictionSummary = require('./helpers/getBotPredictionSummary')
const commandsList = require('./commands')
const fs = require("fs");
const cheerio = require('cheerio');

let nbaPlayers = []
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

    fs.readFile('./dataSource/nbaPlayers.json', 'utf8', function (error, data) {
        if (error) console.error(error)
        else nbaPlayers = JSON.parse(data)
    })

    commandsList().forEach(command => {
        client.application.commands.create(command, process.env.GUILD_ID)
    })

    console.log("Commands Added")
})

client.on(Events.InteractionCreate, interaction => {
    if (interaction.isChatInputCommand()) {
        const sportType = interaction.options.getString('league')

        if (interaction.commandName === 'picks') {
            const date = interaction.options.getString("date")
            if (date.length !== 8) interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)");
            const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
            interaction.reply(`${getCommandSportIcon(sportType)} **AI ${sportType.toUpperCase()} GAME PICKS SCHEDULED FOR: ** *${year}-${month}-${day}*`)
            let gamesUrl = process.env.API_GENERAL_URL.replace('SPORTTYPE', sportType).replace('DATE', date),
                standingsUrl = process.env.API_GENERAL_STANDINGS_URL.replace('SPORTTYPE', sportType),
                teamStatsUrl = process.env.API_GAME_URL
            if (sportType.includes('ncaab')) {
                gamesUrl = process.env.API_NCAAB_URL.replace('DATE', date)
            }

            console.log({sportType, gamesUrl, standingsUrl, teamStatsUrl})
            getPredictions(interaction.channel, gamesUrl, standingsUrl, teamStatsUrl, sportType)
        } else if (interaction.commandName === 'summary') {
            const date = interaction.options.getString("date")
            if (date.length !== 8) interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)");
            const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
            const standingsUrl = process.env.API_GENERAL_STANDINGS_URL.replace('SPORTTYPE', sportType)
            let gamesUrl = process.env.API_GENERAL_URL.replace('SPORTTYPE', sportType).replace('DATE', date)
            interaction.reply(`${getCommandSportIcon(sportType)} **${sportType.toUpperCase()} SUMMARY OF: ** *${year}-${month}-${day}*`)
            if (sportType.includes('ncaab')) {
                gamesUrl = `https://api.actionnetwork.com/web/v1/scoreboard/${sportType}?period=game&bookIds=15&division=D1&date=${date}&tournament=0`
            }
            console.log({
                sportType,
                gamesUrl
            })
            getBotPredictionSummary(interaction.channel, gamesUrl, standingsUrl, sportType, {year, month, day})
        } else if (interaction.commandName === 'games') {
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
        } else if (interaction.commandName === 'stats') {
            interaction.reply(`Here are stats for: ${filterName(interaction.options.getString('name')).name}`)
            getPlayerStats(interaction.options.getString('name'), interaction.channel)
        }
    } else if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'stats') {
            let suggested = nbaPlayers.filter(v => v.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
            interaction.respond(suggested.splice(0, 25));
        }
    }
})

function filterName(name) {
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1),
        split = name.split('-')
    let player = {
        name: '',
        id: ''
    }
    for (let i = 0; i < split.length - 1; i++) {
        player.name += capitalizeFirstLetter(`${split[i]} `)
    }
    player.id = split[split.length - 1]
    player.name = player.name.trim()
    return player
}

function getPlayerStats(name, channel) {
    const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"},
        url = `${process.env.PLAYER_STATS_URL}/${name}`
    console.log(url)
    fetch(url, fetchConfig).then(c => c.text())
        .then((html) => {
            const $ = cheerio.load(html)
            const playerImg = $('img').attr('src')
            const colors = extractColors($('style').html())

            fetch(process.env.PLAYER_STATS_TABLE_URL.replace('PLAYERID', filterName(name).id), fetchConfig).then(t => t.json())
                .then(statsJson => {
                    console.log(statsJson)
                    let embed = new EmbedBuilder()
                        .setTitle(`${filterName(name).name}`)
                        .setDescription(`Stats`)
                        .setThumbnail(playerImg)
                        .setColor(`${colors.primaryColor}`)
                        .setURL(url)

                    embed.addFields({
                        name: 'Statistics',
                        value: 'Here are the main statistics for various time frames:dhsajkhfjkdsfhjshfkjdsfhjksfhKJDHSAKJDHLJKDHJSAKLDJKSAHDSJAKDHJSAJDLHSAKJDSA'
                    })
                    // Add grid stats to embed
                    if (statsJson['stats'] && statsJson['stats']['grid']) {
                        let titles = { names: [], rowKeys: [] },
                            fields = []
                        const grid = statsJson['stats']['grid']
                        for (let i = 0; i < grid.columns.length; i++) {
                            titles.names.push(`${i === 0 ? 'Timeframe' : grid.columns[i].title}`)
                            titles.rowKeys.push(grid.columns[i].rowItemKey)
                        }
                        titles.rowKeys.forEach((rowKey, index) => {
                            let values = []
                            grid.rows.forEach(row => {
                                values.push(row[rowKey].display)
                            })
                            if (index === 1) fields.push({ name: '\u200B', value: '\u200B' })

                            fields.push({
                                name: titles.names[index],
                                value: values.join('\n'),
                                inline: true
                            })
                        })

                        embed.addFields(...fields)
                    }

                    embed.setTimestamp()
                    embed.setFooter({
                        text: `Statistics for ${filterName(name).name}`,
                        icon_url: `${playerImg}`,
                    })
                    channel.send({embeds: [embed]})
                })
        })
}

function extractColors(html) {
    return {
        primaryColor: html.substring(html.indexOf('--team-primary-color: #') + 29, html.indexOf('--team-primary-color: #') + 22),
        secondaryColor: html.substring(html.indexOf('--team-secondary-color: #') + 31, html.indexOf('--team-secondary-color: #') + 24)
    }
}

client.login(process.env.TOKEN)


