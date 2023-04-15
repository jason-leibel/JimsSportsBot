const {EmbedBuilder} = require("discord.js");
const calculateOdds = require("./calculateOdds");
const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}

module.exports = (channel, url, standingsUrl, sportType, date) => {
    console.log(standingsUrl)
    Promise.all([
        fetch(url, fetchConfig).then(resp => resp.json()),
        fetch(standingsUrl, fetchConfig).then(resp => resp.json())
    ]).then(response => {
        const projectedWinners = []

        // First response is a list of all games, we want to loop through each game
        const summary = new EmbedBuilder()
        response[0].games.forEach(game => {
            const homeTeam = game.teams.filter(team => team.id === game['home_team_id'])[0],
                awayTeam = game.teams.filter(team => team.id === game['away_team_id'])[0], odds = game['odds'][0]

            // Save the team standings object, and each teams standings as well
            const standings = response[1]['standings'],
                homeTeamStanding = standings.filter(standing => standing['team_id'] === homeTeam['id'])[0],
                awayTeamStanding = standings.filter(standing => standing['team_id'] === awayTeam['id'])[0],
                calculatedOdds = calculateOdds(homeTeamStanding, awayTeamStanding, standingsUrl)

            let homeRank = calculatedOdds[0],
                awayRank = calculatedOdds[1],
                isProjectedHome = (homeRank > awayRank)

            projectedWinners.push({
                teamName: (isProjectedHome) ? homeTeam['display_name'] : awayTeam['display_name'],
                didWin: (game['winning_team_id'] !== null) ? (isProjectedHome) ? (homeTeam['id'] === game['winning_team_id']) : (awayTeam['id'] === game['winning_team_id']) : null,
                winnerMl: (isProjectedHome) ?
                    (odds['ml_home'] !== null) ? (odds['ml_home'] > 0) ? `+${odds['ml_home']}` : odds['ml_home'] : 'NA' :
                    (odds['ml_away'] !== null) ? (odds['ml_away'] > 0) ? `+${odds['ml_away']}` : odds['ml_away'] : 'NA'
            })

        })
        const winnerQty = projectedWinners.filter(pw => pw.didWin).length,
            winnerAverage = ((winnerQty / projectedWinners.filter(w => w.didWin !== null).length) * 100).toFixed(2)
        summary
            .setColor(`${(response[0].games.length !== projectedWinners.filter(w => w.didWin !== null).length) ? '#7d7dff' : (winnerAverage >= 50) ? '#00FF00' : '#FF0000'}`)
            .setTitle(`*** ${sportType.toUpperCase()} Bot Prediction summary for: ${date.year}-${date.month}-${date.day} ***`),
            values = []

        projectedWinners.forEach(projectedWinner => {
            values.push(`*** ${projectedWinner.teamName} *** ML: *${projectedWinner.winnerMl}* ${(projectedWinner.didWin !== null) ? projectedWinner.didWin ? ':white_check_mark:' : ':x:' : ':soon:'}`)
        })

        if (values.length !== 0) {
            summary.addFields([
                {
                    name: `${sportType.toUpperCase()} Games`,
                    value: values.join('\n')
                },
                {
                    name: 'Overall Summary:',
                    value: `Out of ${projectedWinners.filter(w => w.didWin !== null).length} games there were ${winnerQty} winners. The average: ${winnerAverage}%`
                }
            ])
            channel.send({embeds: [summary]})
        }
    })
}
