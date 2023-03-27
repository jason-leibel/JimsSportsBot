require("dotenv").config()
const {Client, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder} = require("discord.js")
const getCommandSportIcon = require('./helpers/getCommandSportIcon')
const getPredictions = require('./helpers/getPredictions')
const getGamesForDate = require('./helpers/getGamesForDate')
const getBotPredictionSummary = require('./helpers/getBotPredictionSummary')
const getPlayerPropPicks = require('./helpers/getPlayerPropPicks')
const getGamesList = require('./helpers/getGamesList')
const commandsList = require('./commands')
const fs = require("fs");
const cheerio = require('cheerio');
const nodeHtmlToImage = require("node-html-to-image");

let nbaPlayers = [], nhlPlayers = [], nflPlayers = [], mlbPlayers = [], currentDate = '', sportType = ''
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
    fs.readFile('./dataSource/nhlPlayers.json', 'utf8', function (error, data) {
        if (error) console.error(error)
        else nhlPlayers = JSON.parse(data)
    })
    fs.readFile('./dataSource/nflPlayers.json', 'utf8', function (error, data) {
        if (error) console.error(error)
        else nflPlayers = JSON.parse(data)
    })
    fs.readFile('./dataSource/mlbPlayers.json', 'utf8', function (error, data) {
        if (error) console.error(error)
        else mlbPlayers = JSON.parse(data)
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
            interaction.reply(`***Here Are Stats For: *** ${filterName(interaction.options.getString('name')).name}`)
            getPlayerStats(interaction.options.getString('name'), interaction.channel, sportType)
        } else if (interaction.commandName === 'props') {
            currentDate = interaction.options.getString("date")
            getGamesList(interaction, interaction.options.getString("date"), sportType)
        }
    } else if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'stats') {
            let suggested = [], sportType = interaction.options.getString('league')
            if (sportType === 'nba') {
                suggested = nbaPlayers.filter(v => v.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
            } else if (sportType === 'nhl') {
                suggested = nhlPlayers.filter(v => v.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
            } else if (sportType === 'nfl') {
                suggested = nflPlayers.filter(v => v.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
            } else if (sportType === 'mlb') {
                suggested = mlbPlayers.filter(v => v.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
            }
            interaction.respond(suggested.splice(0, 25));
        }
    } else if (interaction.isStringSelectMenu()) {
        if (currentDate.length !== 8) interaction.reply("The date you supplied was not in the following format: yyyymmdd (ex. 20230101)");
        const year = currentDate.substring(0, 4), month = currentDate.substring(4, 6), day = currentDate.substring(6, 8)
        interaction.reply(`***Here Are Player Prop Bets For: *** *${year}-${month}-${day}*`)
        getPlayerPropPicks(interaction.channel, currentDate, interaction.values, sportType)
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

function getPlayerStats(name, channel, sportType) {
    const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}
    const url = `${process.env.PLAYER_STATS_URL}/${name}`
            .replace('SPORTTYPE', sportType)
    console.log(url)
    fetch(url, fetchConfig).then(c => c.text())
        .then((html) => {
            const $ = cheerio.load(html)
            const playerImg = $('img').attr('src')

            fetch(process.env.PLAYER_STATS_TABLE_URL.replace('PLAYERID', filterName(name).id).replace('SPORTTYPE', sportType), fetchConfig).then(t => t.json())
                .then(async statsJson => {
                    const color = statsJson['bio']['team']['colors']['backgroundColor']
                    let description = `The following is information found on: ${filterName(name).name}`
                    if (statsJson['bio'] && statsJson['bio']['summaryNlg']) {
                        description = ''
                        statsJson['bio']['summaryNlg'].forEach(line => {
                            description += `${line.omitLeadingSpace ? '' : ' '}${line.text}`
                        })
                    }

                    let embed = new EmbedBuilder()
                        .setTitle(`${filterName(name).name}`)
                        .setDescription(description)
                        .setThumbnail(playerImg)
                        .setColor(color)
                        .setURL(url)

                    embed.setTimestamp()
                    embed.setFooter({
                        text: `Statistics for ${filterName(name).name}`,
                        icon_url: `${playerImg}`,
                    })
                    const statObjects = [{key: 'stats', title: 'Overall Statistics'},
                        {key: 'recentGames', title: 'Last 5 Games'}, {key: 'nextGame', title: 'Next Game'}]
                    let html = `<html>
                                    <head>
                                        <link
                                        href="https://fonts.googleapis.com/css?family=Roboto"
                                        rel="stylesheet"
                                        />
                                    </head>
                                    <style>
                                    table.boostrap4,table.boostrap4 td{font-weight:400;text-align:left;color:#fff}table.boostrap4 td,table.boostrap4 thead th{font-size:1rem;line-height:1.5;border-collapse:collapse;box-sizing:border-box;padding:.75rem;border-top:1px solid #dee2e6}table.boostrap4{font-size:1rem;line-height:1.5;box-sizing:border-box;border-collapse:collapse;width:100%;margin-bottom:1rem;background-color:transparent}table.boostrap4 thead th{color:gray;text-align:inherit;vertical-align:bottom;border-bottom:2px solid #dee2e6}table.boostrap4 td{vertical-align:top}.table_container{max-width:80vw;margin-left:auto;margin-right:auto}body{font-family:Roboto;background-color:#36393f;text-align:center;color:#fff;padding:10px 20px}table{border:5px solid #545454}
                                    </style>
                                <body>`
                    statObjects.forEach(stat => {
                        if (statsJson[stat.key] && statsJson[stat.key]['grid']) {
                            const grid = statsJson[stat.key]['grid'],
                                tables = buildAndSendTables(grid, channel, stat.title)
                            html += tables[0]
                            html += tables[1]
                        }
                    })
                    html += `</body></html>`

                    const image = await nodeHtmlToImage({
                        html,
                        name: 'test',
                        quality: 100,
                        type: 'jpeg',
                        puppeteerArgs: {
                            args: ['--no-sandbox'],
                        },
                        encoding: 'buffer',
                        output: 'stats.jpeg'
                    })
                    const attachment = new AttachmentBuilder(image, { name: '/stats.jpeg' })
                    embed.setImage('attachment://stats.jpeg')
                    channel.send({embeds: [embed], files: [attachment]});
                })
        })
}

function buildAndSendTables(grid, channel, title) {
    let titles = { names: [], rowKeys: [] }
    for (let i = 0; i < grid.columns.length; i++) {
        titles.names.push(`${i === 0 ? 'Timeframe' : grid.columns[i].title}`)
        titles.rowKeys.push(grid.columns[i].rowItemKey)
    }
    const nmi = Math.ceil(titles.names.length / 2),
        namesf = titles.names.splice(0, nmi),
        namesl = titles.names.splice(-nmi),
        rmi = Math.ceil(titles.rowKeys.length / 2),
        rowkf = titles.rowKeys.splice(0, rmi),
        rowkl = titles.rowKeys.splice(-rmi);

    const buildTable = (headers, rowKeys, tableTitle) => {
        let table = `<h1>${tableTitle}</h1><table class="boostrap4"><thead><tr>`
        headers.forEach(header => {
            table += `<td>${header}</td>`
        })
        table += `</tr><tbody>`


        grid.rows.forEach(row => {
            table += '<tr>'
            rowKeys.forEach((rowKey) => {
                table += `<td>${row[rowKey].display}</td>`
            })
            table += '</tr>'
        })
        return `${table}</tbody></table>`
    }
    return [
        buildTable(namesf, rowkf, title),
        buildTable(namesl, rowkl, `${title} Part 2`)
    ]
}

client.login(process.env.TOKEN)


