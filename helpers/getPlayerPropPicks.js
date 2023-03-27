require('dotenv').config()
const stylesheet = require('./pickStylesheet.css')
const nodeHtmlToImage = require("node-html-to-image");
const fetchConfig = {
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
}

module.exports = (channel, date, values, sportType) => {
    let leagueId = 6
    switch (sportType) {
        case 'nba':
            leagueId = 4
            break
        case 'ncaab':
            leagueId = 6
            break
        case 'nhl':
            leagueId = 3
            break
    }
    const url = process.env.API_POPULAR_STATS
        .replace('DATE', date)
        .replace('LEAGUEID', leagueId)
    console.log(url)
    fetch(url, fetchConfig).then(resp => resp.json())
        .then(async data => {
            const props = []
            if (!data['playerProps']) {
                channel.send("It appears there are no prop picks available yet, check again later.")
                return;
            }
            data['playerProps'].forEach(playerProp => {
                const lines = playerProp['lines'][0]['lines'],
                    rules = playerProp['rules'],
                    game = data['games'].filter(game => game['id'] === playerProp['lines'][0]['game_id'])[0],
                    fullPlayerName = data['players'].filter((player) => player['id'] === playerProp['player_id'])[0]['full_name']
                if (values.includes(`${game['id']}`)) {
                    props.push({
                        fullName: fullPlayerName,
                        homeTeamName: game['teams'][0]['display_name'],
                        awayTeamName: game['teams'][1]['display_name'],
                        homeTeamLogo: game['teams'][0]['logo'],
                        awayTeamLogo: game['teams'][1]['logo'],
                        typeOverUnder: rules['options'][lines['option_type_id']]['option_type'],
                        type: playerProp['custom_pick_type_display_name'],
                        value: (lines['value']) ? `${rules['options'][lines['option_type_id']]['abbreviation']}${lines['value']}` : null,
                        moneyLine: lines['money'],
                        projection: playerProp['lines'][0]['projected_value'],
                        edge: `${parseFloat((lines['edge']) * 100).toFixed(2)}%`,
                        grade: lines['grade']
                    })
                }
            })
            let html = `<html><head><style>${stylesheet}</style></head><body><table><thead><tr><th class="projections-table__column-header projections-table__column-header--left">Player</th><th class="projections-table__column-header">Pick</th><th class="projections-table__column-header">Current Line</th><th class="projections-table__column-header">Projection</th><th class="projections-table__column-header">Edge</th><th class="projections-table__column-header">Grade</th></tr></thead><tbody>`
            for (const p of props) {
                html += `
                  <tr><td><div class="projection-row__player-container"><div>
              <div class="projection-row__player-name">${p.fullName}</div>
              <div class="projection-row__game-info">
              <img src="${p.homeTeamLogo}" class="logo"/>
              &nbsp;${p.homeTeamName} @ ${p.awayTeamName}&nbsp;
              <img src="${p.awayTeamLogo}" class="logo"/>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div class="projection-row__option-type">${p.typeOverUnder}</div>
          <div class="projection-row__prop-name">${p.type}</div>
        </td>
        <td class="projection-row__pick">
          <div class="projection-row__cells">
            <div class="book-cell__odds-container">
              <div data-testid="book-cell__odds" class="book-cell__odds">
              ${p.value ? `<span class="ml">${p.value}</span><span class="book-cell__secondary">${p.moneyLine}</span>` : `<span class="ml">${p.moneyLine}</span>`}
              </div>
            </div>
          </div>
        </td>
        <td class="projection-row__projection">${p.projection}</td>
        <td>
          <div class="projection-row__edge">${p.edge}</div>
        </td>
        <td><div class="projection-row__projection-cell grade"><div class="projection-cell__inner">${p.grade}</div></div></td>
      </tr>
                `
            }

            html += `</tbody></table></body></html>`

            const images = await nodeHtmlToImage({
                html: html,
                quality: 100,
                type: 'jpeg',
                puppeteerArgs: {
                    args: ['--no-sandbox'],
                },
                encoding: 'buffer',
            })
            channel.send({files: [images]})

        })
}
