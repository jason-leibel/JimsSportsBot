const cheerio = require("cheerio");
const {EmbedBuilder, AttachmentBuilder} = require("discord.js");
const nodeHtmlToImage = require("node-html-to-image");
const filterName = require('./filterPlayerName')
module.exports = (name, channel, sportType) => {
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
                    const attachment = new AttachmentBuilder(image, {name: '/stats.jpeg'})
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
