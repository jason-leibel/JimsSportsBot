const calculateOdds = require("./calculateOdds");
const buildStatsSection = require("./buildStatsSection");
const {EmbedBuilder} = require("discord.js");
const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}

module.exports = (channel, url, standingsUrl, teamStatsUrl, sportType) => {
    Promise.all([
        fetch(url, fetchConfig).then(resp => resp.json()),
        fetch(standingsUrl, fetchConfig).then(resp => resp.json())
    ]).then(response => {
        if (sportType === 'mma') {
            getPredictionsForMMA(channel, response)
        } else {
            getPredictionsForBasketball(channel, teamStatsUrl, standingsUrl, sportType, response)
        }
    })
}

function getPredictionsForMMA(channel, response) {
    console.log(response[0].competitions)
}

function getPredictionsForBasketball(channel, teamStatsUrl, standingsUrl, sportType, response) {
    const gamesToday = []
    // First response is a list of all games, we want to loop through each game
    response[0].games.forEach(game => {
        const homeTeam = game.teams.filter(team => team.id === game['home_team_id'])[0],
            awayTeam = game.teams.filter(team => team.id === game['away_team_id'])[0], odds = game['odds'][0]
        gamesToday.push({
            id: game['id'], startTime: game['start_time'], homeTeamId: homeTeam['id'], awayTeamId: awayTeam['id'],
            homeTeamName: homeTeam['display_name'], awayTeamName: awayTeam['display_name'],
            homeTeamColor: homeTeam['primary_color'], awayTeamColor: awayTeam['primary_color'],
            homeTeamLogo: homeTeam['logo'], awayTeamLogo: awayTeam['logo'],
            homeTeamSpread: (odds['spread_home'] !== null) ? odds['spread_home'] : 'NA',
            awayTeamSpread: (odds['spread_away'] !== null) ? odds['spread_away'] : 'NA',
            homeTeamMl: (odds['ml_home'] !== null) ? (odds['ml_home'] > 0) ? `+${odds['ml_home']}` : odds['ml_home'] : 'NA',
            awayTeamMl: (odds['ml_away'] !== null) ? (odds['ml_away'] > 0) ? `+${odds['ml_away']}` : odds['ml_away'] : 'NA',
            over: odds['total'], under: odds['total']
        })
    })

    // Loop through our filtered list of games.
    gamesToday.forEach(game => {
        // Save the team standings object, and each teams standings as well
        const standings = response[1]['standings'],
            homeTeamStanding = standings.filter(standing => standing['team_id'] === game.homeTeamId)[0],
            awayTeamStanding = standings.filter(standing => standing['team_id'] === game.awayTeamId)[0]
        fetch(teamStatsUrl.replace('gameId', game.id), fetchConfig).then(resp => resp.json()).then(teamStatsResponse => {
            const teamStats = teamStatsResponse['team_stats'],
                awayStats = teamStats['away'],
                homeStats = teamStats['home'],
                homeWinPercentage = ((homeTeamStanding['win'] / (homeTeamStanding['win'] + homeTeamStanding['loss'])) * 100).toFixed(2),
                awayWinPercentage = ((awayTeamStanding['win'] / (awayTeamStanding['win'] + awayTeamStanding['loss'])) * 100).toFixed(2)

            const calculatedOdds = calculateOdds(homeTeamStanding, awayTeamStanding, standingsUrl);
            let homeRank = calculatedOdds[0],
                awayRank = calculatedOdds[1],
                homeOverUnders = calculatedOdds[2],
                awayOverUnders = calculatedOdds[3],
                homeRecords = calculatedOdds[4],
                awayRecords = calculatedOdds[5],
                homeWinRecord = calculatedOdds[6],
                awayWinRecord = calculatedOdds[7]


            const projectedWinner = {
                teamColor: (homeRank > awayRank) ? game.homeTeamColor : game.awayTeamColor,
                teamLogo: (homeRank > awayRank) ? game.homeTeamLogo : game.awayTeamLogo,
                teamName: (homeRank > awayRank) ? game.homeTeamName : game.awayTeamName,
                homeOrAwayWinPercentage: (homeRank > awayRank) ?
                    `${(homeRecords.filter(r => r['record_type'] === 'home')[0]['win_pct'] * 100).toFixed(2)}%`
                    : `${(awayRecords.filter(r => r['record_type'] === 'road')[0]['win_pct'] * 100).toFixed(2)}%`,
                homeOrAway: (homeRank > awayRank) ? 'Home' : 'Away',
                winnerWinPercentage: (homeRank > awayRank) ? `${(100 * (homeRank / (homeRank + awayRank))).toFixed(2)}%` : `${(100 * (awayRank / (awayRank + homeRank))).toFixed(2)}%`,
                underdogName: (game.homeTeamMl < game.awayTeamMl) ? game.awayTeamName : game.homeTeamName,
                underdogWinRecord: (game.homeTeamMl < game.awayTeamMl) ? (awayRecords.filter(r => r['record_type'] === 'dog')[0]) : (homeRecords.filter(r => r['record_type'] === 'dog')[0])
            }

            const statsSection = buildStatsSection(homeStats, awayStats, sportType)

            const prediction = new EmbedBuilder()
                .setColor(`#${projectedWinner.teamColor}`)
                .setTitle(`${game.homeTeamName} vs. ${game.awayTeamName}`)
                .setDescription(`${projectedWinner.teamName} is projected to win with a ${projectedWinner.winnerWinPercentage} chance`)
                .setThumbnail(`${projectedWinner.teamLogo}`)
                .addFields(
                    {
                        name: `${(homeWinPercentage > awayWinPercentage) ? ':chart_with_upwards_trend:' : ':chart_with_downwards_trend:'} ${game.homeTeamName} Overall Win Percentage`,
                        value: `${homeWinPercentage}% *Wins:* ${homeWinRecord['wins']} *Losses:* ${homeWinRecord['losses']}`,
                        inline: true
                    },
                    {
                        name: `${(awayWinPercentage > homeWinPercentage) ? ':chart_with_upwards_trend:' : ':chart_with_downwards_trend:'} ${game.awayTeamName} Overall Win Percentage`,
                        value: `${awayWinPercentage}% *Wins:* ${awayWinRecord['wins']} *Losses:* ${awayWinRecord['losses']}`,
                        inline: true
                    },
                    {
                        name: `:bar_chart:Random statistics`,
                        value: `This is a ${projectedWinner.homeOrAway} game for ${projectedWinner.teamName}, their win percentage for here is: ${projectedWinner.homeOrAwayWinPercentage}`
                    },
                    {
                        name: `:trophy:${game.homeTeamName} Rank`,
                        value: `*** Division: *** ${homeTeamStanding['division_rank']} *** Conference: *** ${homeTeamStanding['conference_rank']}`,
                        inline: true
                    },
                    {
                        name: `${game.homeTeamName} Over/Unders:arrow_up: :arrow_down: `,
                        value: `*** Overs: *** ${homeOverUnders['overs']} *** Unders: *** ${homeOverUnders['unders']} *** Draw: *** ${homeOverUnders['draws']}`,
                        inline: true
                    },
                    {
                        name: '\u200B', value: '\u200B'
                    },
                    {
                        name: `:trophy:${game.awayTeamName} Rank`,
                        value: `*** Division: *** ${awayTeamStanding['division_rank']} *** Conference: *** ${awayTeamStanding['conference_rank']}`,
                        inline: true
                    },
                    {
                        name: `${game.awayTeamName} Over/Unders:arrow_up: :arrow_down: `,
                        value: `*** Overs: *** ${awayOverUnders['overs']} *** Unders: *** ${awayOverUnders['unders']} *** Draw: *** ${awayOverUnders['draws']}`,
                        inline: true
                    },
                    {
                        name: '\u200B', value: '\u200B'
                    },
                    {
                        name: `${game.homeTeamName} Odds`,
                        value: `*** ML: *** ${game.homeTeamMl} *** Spread: *** ${game.homeTeamSpread} *** Over: *** ${game.over}`,
                        inline: true
                    },
                    {
                        name: `${game.awayTeamName} Odds`,
                        value: `*** ML: *** ${game.awayTeamMl} *** Spread: *** ${game.awayTeamSpread} *** Under: *** ${game.under}`,
                        inline: true
                    },
                    {
                        name: '\u200B', value: '\u200B'
                    },
                    {
                        name: `${game.homeTeamName} Statistics`,
                        value: statsSection[0],
                        inline: true
                    },
                    {
                        name: `${game.awayTeamName} Statistics`,
                        value: statsSection[1],
                        inline: true
                    },
                    {
                        name: `Wins/Losses as the underdog for: ${projectedWinner.underdogName} (Based on ML)`,
                        value: `*** Wins: *** ${projectedWinner.underdogWinRecord['wins']} *** Losses: *** ${projectedWinner.underdogWinRecord['losses']}`
                    },
                    {
                        name: `Jason's Formula Team Ranking`,
                        value: `${game.homeTeamName}: ${homeRank} - ${game.awayTeamName}: ${awayRank}`
                    },
                )
                .setTimestamp(new Date(game['startTime']))
                .setFooter({
                    text: `Predicted winner is ${projectedWinner.teamName}`,
                    iconURL: `${projectedWinner.teamLogo}`
                });

            channel.send({embeds: [prediction]});
        })
    })
}
