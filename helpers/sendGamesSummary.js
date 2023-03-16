const nodeHtmlToImage = require('node-html-to-image')

module.exports = async (channel, games, sport) => {
    let color = 'orange'
    switch (sport) {
        case 'nba':
            color = 'orange'
            break
        case 'nfl':
            color = 'red'
            break
        case 'nhl':
            color = 'green'
            break
        case 'ncaab':
            color = 'blue'
            break
        case 'ncaaf':
            color = 'yellow'
            break
        case 'mlb':
            color = 'purple'
            break
    }

    let _htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto"
      rel="stylesheet"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      .app {
        font-family: "Roboto";
        font-size: 22px;
        background-color: rgb(31, 31, 31);
        border-left: ${color} solid 5px;
        width: 100%;
      }
      .titleContainer {
        text-align: left;
        padding: 5px;
        width: 100%;
      }
      td {
        padding: 5px;
        text-align: center;
      }
      .teams > td > img {
        height: 50px;
        vertical-align: middle;
      }
      .teams > td {
        color: white;
        vertical-align: middle;
        font-size: 22px;
      }
      .odds {
        color: #bababa !important;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="app">
      <table class="titleContainer">
        <tr style="color: green">
          <td>Logo</td>
          <td>Team</td>
          <td>ML</td>
          <td>Spread</td>
          <td>Total</td>
        </tr>
        `;
    const gamesLength = games.length
    games.forEach((game, index) => {
        _htmlTemplate += `
        <tr class="teamOne teams">
          <td>
            <img src="${game.homeTeamLogo}" />
          </td>
          <td>${game.homeTeamName}</td>
          <td class="odds">${game.homeTeamMl}</td>
          <td class="odds">${game.homeTeamSpread}</td>
          <td class="odds">${(game.over !== null) ? `O ${game.over}` : 'NA'}</td>
        </tr>
        <tr class="teamTwo teams">
          <td>
            <img
              src="${game.awayTeamLogo}"
            />
          </td>
          <td>${game.awayTeamName}</td>
          <td class="odds">${game.awayTeamMl}</td>
          <td class="odds">${game.awayTeamSpread}</td>
          <td class="odds">${(game.under !== null) ? `U ${game.under}` : 'NA'}</td>
        </tr>
        `
        if (gamesLength !== index + 1) _htmlTemplate += '<tr><td colspan="5" style="border-bottom: white solid 1px"></td></tr>'
    })

    _htmlTemplate += `
      </table>
    </div>
  </body>
</html>
`

    const images = await nodeHtmlToImage({
        html: _htmlTemplate,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
            args: ['--no-sandbox'],
        },
        encoding: 'buffer',
    })
    channel.send({files: [images]})
}
