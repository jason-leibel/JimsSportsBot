module.exports = (homeStats, awayStats, sportType) => {
    if (sportType === 'ncaab' || sportType === 'nba') {
        const teamStatIcons = getTeamStatIcons(homeStats, awayStats, sportType)
        return [
            `${teamStatIcons['home'][0]} *Field Goal Pct:* ${(homeStats['field_goals_pct']) ? homeStats['field_goals_pct'].toFixed(0) : 'NA'}%
             ${teamStatIcons['home'][1]} *Three Point Pct:* ${(homeStats['three_points_pct']) ? homeStats['three_points_pct'].toFixed(0) : 'NA'}%
             ${teamStatIcons['home'][2]} *Free Throw Pct:* ${(homeStats['free_throws_pct']) ? homeStats['free_throws_pct'].toFixed(0) : 'NA'}%
             ${teamStatIcons['home'][3]} *Rebounds Avg:* ${(homeStats['rebounds']) ? homeStats['rebounds'] : 'NA'}
             ${teamStatIcons['home'][4]} *Assists Avg:* ${(homeStats['assists']) ? homeStats['assists'] : 'NA'}
             ${teamStatIcons['home'][5]} *Turnovers Avg:* ${(homeStats['turnovers']) ? homeStats['turnovers'] : 'NA'}
             ${teamStatIcons['home'][6]} *Steals Avg:* ${(homeStats['steals']) ? homeStats['steals'] : 'NA'}
             ${teamStatIcons['home'][7]} *Blocks Avg:* ${(homeStats['blocks']) ? homeStats['blocks'] : 'NA'}
             ${teamStatIcons['home'][8]} *Fouls Avg:* ${(homeStats['personal_fouls']) ? homeStats['personal_fouls'] : 'NA'}`,

            `${teamStatIcons['away'][0]} *Field Goal Pct:* ${(awayStats['field_goals_pct']) ? awayStats['field_goals_pct'].toFixed(0) : 'NA'}%
             ${teamStatIcons['away'][1]} *Three Point Pct:* ${(awayStats['three_points_pct']) ? awayStats['three_points_pct'].toFixed(0) : 'NA'}%
             ${teamStatIcons['away'][2]} *Free Throw Pct:* ${(awayStats['free_throws_pct']) ? awayStats['free_throws_pct'].toFixed(0) : 'NA'}%
             ${teamStatIcons['away'][3]} *Rebounds Avg:* ${(awayStats['rebounds']) ? awayStats['rebounds'] : 'NA'}
             ${teamStatIcons['away'][4]} *Assists Avg:* ${(awayStats['assists']) ? awayStats['assists'] : 'NA'}
             ${teamStatIcons['away'][5]} *Turnovers Avg:* ${(awayStats['turnovers']) ? awayStats['turnovers'] : 'NA'}
             ${teamStatIcons['away'][6]} *Steals Avg:* ${(awayStats['steals']) ? awayStats['steals'] : 'NA'}
             ${teamStatIcons['away'][7]} *Blocks Avg:* ${(awayStats['blocks']) ? awayStats['blocks'] : 'NA'}
             ${teamStatIcons['away'][8]} *Fouls Avg:* ${(awayStats['personal_fouls']) ? awayStats['personal_fouls'] : 'NA'}`
        ]
    } else if (sportType === 'nhl') {
        let hockeyHome = null, hockeyAway = null, goalTendingHome = null, goalTendingAway = null
        if (homeStats['summary']['total']) {
            hockeyHome = homeStats['summary']['total']
            goalTendingHome = homeStats['goaltending']['total']
        } else if (homeStats['summary']['average']) {
            hockeyHome = homeStats['summary']['average']
            goalTendingHome = homeStats['goaltending']['average']
        }
        if (awayStats['summary']['total']) {
            hockeyAway = awayStats['summary']['total']
            goalTendingAway = awayStats['goaltending']['total']
        } else if (awayStats['summary']['average']) {
            hockeyAway = awayStats['summary']['average']
            goalTendingAway = awayStats['goaltending']['average']
        }
        const teamStatIcons = getTeamStatIcons({
            hockeyHome, goalTendingHome
        }, {
            hockeyAway, goalTendingAway
        }, sportType)

        return [
            `${teamStatIcons['home'][0]} *Hits:* ${(hockeyHome['hits'] ? hockeyHome['hits'] : 'NA')}
             ${teamStatIcons['home'][1]} *Goals:* ${(hockeyHome['goals'] ? hockeyHome['goals'] : 'NA')}
             ${teamStatIcons['home'][2]} *Shots:* ${(hockeyHome['shots'] ? hockeyHome['shots'] : 'NA')}
             ${teamStatIcons['home'][3]} *Points:* ${(hockeyHome['points'] ? hockeyHome['points'] : 'NA')}
             ${teamStatIcons['home'][4]} *Assists:* ${(hockeyHome['assists'] ? hockeyHome['assists'] : 'NA')}
             ${teamStatIcons['home'][5]} *Giveaways:* ${(hockeyHome['giveaways'] ? hockeyHome['giveaways'] : 'NA')}
             ${teamStatIcons['home'][6]} *Penalties:* ${(hockeyHome['penalties'] ? hockeyHome['penalties'] : 'NA')}
             ${teamStatIcons['home'][7]} *Takeaways:* ${(hockeyHome['takeaways'] ? hockeyHome['takeaways'] : 'NA')}
             ${teamStatIcons['home'][8]} *Missed Shots:* ${(hockeyHome['missed_shots'] ? hockeyHome['missed_shots'] : 'NA')}
             ${teamStatIcons['home'][9]} *Blocked Shots:* ${(hockeyHome['blocked_shots'] ? hockeyHome['blocked_shots'] : 'NA')}
             ${teamStatIcons['home'][10]} *Goals Against:* ${(goalTendingHome['goals_against'] ? goalTendingHome['goals_against'] : 'NA')}
             ${teamStatIcons['home'][11]} *Shots Against:* ${(goalTendingHome['shots_against'] ? goalTendingHome['shots_against'] : 'NA')}`,

            `${teamStatIcons['away'][0]} *Hits:* ${(hockeyAway['hits'] ? hockeyAway['hits'] : 'NA')}
             ${teamStatIcons['away'][1]} *Goals:* ${(hockeyAway['goals'] ? hockeyAway['goals'] : 'NA')}
             ${teamStatIcons['away'][2]} *Shots:* ${(hockeyAway['shots'] ? hockeyAway['shots'] : 'NA')}
             ${teamStatIcons['away'][3]} *Points:* ${(hockeyAway['points'] ? hockeyAway['points'] : 'NA')}
             ${teamStatIcons['away'][4]} *Assists:* ${(hockeyAway['assists'] ? hockeyAway['assists'] : 'NA')}
             ${teamStatIcons['away'][5]} *Giveaways:* ${(hockeyAway['giveaways'] ? hockeyAway['giveaways'] : 'NA')}
             ${teamStatIcons['away'][6]} *Penalties:* ${(hockeyAway['penalties'] ? hockeyAway['penalties'] : 'NA')}
             ${teamStatIcons['away'][7]} *Takeaways:* ${(hockeyAway['takeaways'] ? hockeyAway['takeaways'] : 'NA')}
             ${teamStatIcons['away'][8]} *Missed Shots:* ${(hockeyAway['missed_shots'] ? hockeyAway['missed_shots'] : 'NA')}
             ${teamStatIcons['away'][9]} *Blocked Shots:* ${(hockeyAway['blocked_shots'] ? hockeyAway['blocked_shots'] : 'NA')}
             ${teamStatIcons['away'][10]} *Goals Against:* ${(goalTendingAway['goals_against'] ? goalTendingAway['goals_against'] : 'NA')}
             ${teamStatIcons['away'][11]} *Shots Against:* ${(goalTendingAway['shots_against'] ? goalTendingAway['shots_against'] : 'NA')}`
        ]
    } else {
        return ['', '']
    }
}

function getTeamStatIcons(homeStats, awayStats, sportType) {
    if (sportType === 'ncaab' || sportType === 'nba') {
        return {
            home: [
                (homeStats['field_goals_pct'] && awayStats['field_goals_pct']) ? (homeStats['field_goals_pct'].toFixed(0) >= awayStats['field_goals_pct'].toFixed(0)) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['three_points_pct'] && awayStats['three_points_pct']) ? (homeStats['three_points_pct'].toFixed(0) >= awayStats['three_points_pct'].toFixed(0)) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['free_throws_pct'] && awayStats['free_throws_pct']) ? (homeStats['free_throws_pct'].toFixed(0) >= awayStats['free_throws_pct'].toFixed(0)) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['rebounds'] && awayStats['rebounds']) ? (homeStats['rebounds'] >= awayStats['rebounds']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['assists'] && awayStats['assists']) ? (homeStats['assists'] >= awayStats['assists']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['turnovers'] && awayStats['turnovers']) ? (homeStats['turnovers'] < awayStats['turnovers']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['steals'] && awayStats['steals']) ? (homeStats['steals'] >= awayStats['steals']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['blocks'] && awayStats['blocks']) ? (homeStats['blocks'] >= awayStats['blocks']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['personal_fouls'] && awayStats['personal_fouls']) ? (homeStats['personal_fouls'] < awayStats['personal_fouls']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:'
            ],
            away: [
                (awayStats['field_goals_pct'] && homeStats['field_goals_pct']) ? (awayStats['field_goals_pct'].toFixed(0) >= homeStats['field_goals_pct'].toFixed(0)) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['three_points_pct'] && homeStats['three_points_pct']) ? (awayStats['three_points_pct'].toFixed(0) >= homeStats['three_points_pct'].toFixed(0)) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['free_throws_pct'] && homeStats['free_throws_pct']) ? (awayStats['free_throws_pct'].toFixed(0) >= homeStats['free_throws_pct'].toFixed(0)) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['rebounds'] && homeStats['rebounds']) ? (awayStats['rebounds'] >= homeStats['rebounds']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['assists'] && homeStats['assists']) ? (awayStats['assists'] >= homeStats['assists']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['turnovers'] && homeStats['turnovers']) ? (awayStats['turnovers'] < homeStats['turnovers']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['steals'] && homeStats['steals']) ? (awayStats['steals'] >= homeStats['steals']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['blocks'] && homeStats['blocks']) ? (awayStats['blocks'] >= homeStats['blocks']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['personal_fouls'] && homeStats['personal_fouls']) ? (awayStats['personal_fouls'] < homeStats['personal_fouls']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:'
            ]
        }
    } else if (sportType === 'nhl') {
        return {
            home: [
                (homeStats['hockeyHome']['hits'] && awayStats['hockeyAway']['hits']) ? (homeStats['hockeyHome']['hits'] >= awayStats['hockeyAway']['hits']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['goals'] && awayStats['hockeyAway']['goals']) ? (homeStats['hockeyHome']['goals'] >= awayStats['hockeyAway']['goals']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['shots'] && awayStats['hockeyAway']['shots']) ? (homeStats['hockeyHome']['shots'] >= awayStats['hockeyAway']['shots']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['points'] && awayStats['hockeyAway']['points']) ? (homeStats['hockeyHome']['points'] >= awayStats['hockeyAway']['points']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['assists'] && awayStats['hockeyAway']['assists']) ? (homeStats['hockeyHome']['assists'] >= awayStats['hockeyAway']['assists']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['giveaways'] && awayStats['hockeyAway']['giveaways']) ? (homeStats['hockeyHome']['giveaways'] < awayStats['hockeyAway']['giveaways']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['penalties'] && awayStats['hockeyAway']['penalties']) ? (homeStats['hockeyHome']['penalties'] < awayStats['hockeyAway']['penalties']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['takeaways'] && awayStats['hockeyAway']['takeaways']) ? (homeStats['hockeyHome']['takeaways'] >= awayStats['hockeyAway']['takeaways']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['missed_shots'] && awayStats['hockeyAway']['missed_shots']) ? (homeStats['hockeyHome']['missed_shots'] >= awayStats['hockeyAway']['missed_shots']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['hockeyHome']['blocked_shots'] && awayStats['hockeyAway']['blocked_shots']) ? (homeStats['hockeyHome']['blocked_shots'] >= awayStats['hockeyAway']['blocked_shots']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['goalTendingHome']['goals_against'] && awayStats['goalTendingAway']['goals_against']) ? (homeStats['goalTendingHome']['goals_against'] < awayStats['goalTendingAway']['goals_against']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (homeStats['goalTendingHome']['shots_against'] && awayStats['goalTendingAway']['shots_against']) ? (homeStats['goalTendingHome']['shots_against'] >= awayStats['goalTendingAway']['shots_against']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
            ],
            away: [
                (awayStats['hockeyAway']['hits'] && homeStats['hockeyHome']['hits']) ? (awayStats['hockeyAway']['hits'] >= homeStats['hockeyHome']['hits']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['goals'] && homeStats['hockeyHome']['goals']) ? (awayStats['hockeyAway']['goals'] >= homeStats['hockeyHome']['goals']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['shots'] && homeStats['hockeyHome']['shots']) ? (awayStats['hockeyAway']['shots'] >= homeStats['hockeyHome']['shots']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['points'] && homeStats['hockeyHome']['points']) ? (awayStats['hockeyAway']['points'] >= homeStats['hockeyHome']['points']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['assists'] && homeStats['hockeyHome']['assists']) ? (awayStats['hockeyAway']['assists'] >= homeStats['hockeyHome']['assists']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['giveaways'] && homeStats['hockeyHome']['giveaways']) ? (awayStats['hockeyAway']['giveaways'] < homeStats['hockeyHome']['giveaways']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['penalties'] && homeStats['hockeyHome']['penalties']) ? (awayStats['hockeyAway']['penalties'] < homeStats['hockeyHome']['penalties']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['takeaways'] && homeStats['hockeyHome']['takeaways']) ? (awayStats['hockeyAway']['takeaways'] >= homeStats['hockeyHome']['takeaways']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['missed_shots'] && homeStats['hockeyHome']['missed_shots']) ? (awayStats['hockeyAway']['missed_shots'] >= homeStats['hockeyHome']['missed_shots']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['hockeyAway']['blocked_shots'] && homeStats['hockeyHome']['blocked_shots']) ? (awayStats['hockeyAway']['blocked_shots'] >= homeStats['hockeyHome']['blocked_shots']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['goalTendingAway']['goals_against'] && homeStats['goalTendingHome']['goals_against']) ? (awayStats['goalTendingAway']['goals_against'] < homeStats['goalTendingHome']['goals_against']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
                (awayStats['goalTendingAway']['shots_against'] && homeStats['goalTendingHome']['shots_against']) ? (awayStats['goalTendingAway']['shots_against'] >= homeStats['goalTendingHome']['shots_against']) ? ':white_check_mark:' : ':x:' : ':heavy_minus_sign:',
            ]
        }
    }
}
