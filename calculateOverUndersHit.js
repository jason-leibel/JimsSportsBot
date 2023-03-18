const ncaaUrl = "https://api.actionnetwork.com/web/v1/scoreboard/ncaab?period=game&bookIds=15,30,1071,1074,76,75,123,69,68,972,71&division=D1&date=DATE&tournament=0"
const dates = ['20230316', '20230317']

function getOverUnders(url, date) {
    const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}

    fetch(url, fetchConfig).then(r => r.json()).then(r => {
        let games = [], overHitCount = 0
        r.games.forEach(game => {
            // Get first odds book
            if (game['boxscore'] && game['status'] === 'complete') {
                games.push({
                    total: game['odds'][0]['total'],
                    gameTitle: `${game['teams'][0]['full_name']} vs. ${game['teams'][1]['full_name']}`,
                    totalPointsScored: game['boxscore']['total_away_points'] + game['boxscore']['total_home_points'],
                    didOverHit: (game['boxscore']['total_away_points'] + game['boxscore']['total_home_points']) > game['odds'][0]['total']
                })
            }
        })
        games.forEach(game => {
            if (game.didOverHit) overHitCount += 1
        })
        const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
        console.log(`${year}-${month}-${day} Overs: ${overHitCount} Unders: ${games.length - overHitCount}`)
    })
}

dates.forEach(date => {
    getOverUnders(ncaaUrl.replace('DATE', date), date)
})

