require("dotenv").config()
const dates = ['20230316', '20230317', '20230318']

function getOverUnders(url, date) {
    const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}

    fetch(url, fetchConfig).then(r => r.json()).then(r => {
        let games = [], overHitCount = 0
        r.games.forEach(game => {
            // Get first odds book
            const title = `${game['teams'][0]['full_name']} vs. ${game['teams'][1]['full_name']}`
            if (game['boxscore'] && game['status'] === 'complete' && games.filter(g => g.gameTitle === title) < 1) {
                games.push({
                    total: game['odds'][0]['total'],
                    gameTitle: title,
                    totalPointsScored: game['boxscore']['total_away_points'] + game['boxscore']['total_home_points'],
                    didOverHit: (game['boxscore']['total_away_points'] + game['boxscore']['total_home_points']) > game['odds'][0]['total']
                })
            }
        })
        games.filter(game => game.gameTitle).forEach(game => {
            if (game.didOverHit) overHitCount += 1
        })
        const year = date.substring(0, 4), month = date.substring(4, 6), day = date.substring(6, 8)
        console.log(`${year}-${month}-${day} Overs: ${overHitCount} Unders: ${games.length - overHitCount}`)
    })
}

dates.forEach(date => {
    getOverUnders(process.env.API_NCAAB_URL.replace('DATE', date), date)
})

