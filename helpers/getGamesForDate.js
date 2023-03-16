const sendGamesSummary = require("./sendGamesSummary");
const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}

module.exports = (channel, url, sport) => {
    fetch(url, fetchConfig).then(response => {
        response.text().then(data => {
            const games = []
            JSON.parse(data).games.forEach(game => {
                const homeTeam = game.teams.filter(team => team.id === game['home_team_id'])[0]
                const awayTeam = game.teams.filter(team => team.id === game['away_team_id'])[0]
                const odds = game['odds'][0]
                games.push({
                    homeTeamName: homeTeam['display_name'],
                    awayTeamName: awayTeam['display_name'],
                    homeTeamLogo: homeTeam['logo'],
                    awayTeamLogo: awayTeam['logo'],
                    homeTeamSpread: (odds['spread_home'] !== null) ? odds['spread_home'] : 'NA',
                    awayTeamSpread: (odds['spread_away'] !== null) ? odds['spread_away'] : 'NA',
                    homeTeamMl: (odds['ml_home'] !== null) ? (odds['ml_home'] > 0) ? `+${odds['ml_home']}` : odds['ml_home'] : 'NA',
                    awayTeamMl: (odds['ml_away'] !== null) ? (odds['ml_away'] > 0) ? `+${odds['ml_away']}` : odds['ml_away'] : 'NA',
                    over: odds['total'],
                    under: odds['total']
                })
            })
            sendGamesSummary(channel, games, sport).catch(console.error)
        })
    });
}
