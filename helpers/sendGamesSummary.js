const nodeHtmlToImage = require('node-html-to-image')
const {EmbedBuilder, AttachmentBuilder} = require("discord.js");

module.exports = async (channel, games, sport) => {
    let html = `<!DOCTYPE html>
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
        html += `
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
        if (gamesLength !== index + 1) html += '<tr><td colspan="5" style="border-bottom: white solid 1px"></td></tr>'
    })

    html += `
      </table>
    </div>
  </body>
</html>
`
    let embed = new EmbedBuilder()
        .setTitle(`${sport.toUpperCase()} Games`)
        .setColor('#42ecf5')

    embed.setTimestamp()
    const image = await nodeHtmlToImage({
        html,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
            args: ['--no-sandbox'],
        },
        encoding: 'buffer',
    })
    const attachment = new AttachmentBuilder(image, {name: '/games.jpeg'})
    embed.setImage('attachment://games.jpeg')
    if (gamesLength !== 0) {
        channel.send({embeds: [embed], files: [attachment]});
    }
}
