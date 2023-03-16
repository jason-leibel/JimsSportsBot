module.exports = (homeTeamStanding, awayTeamStanding, standingsUrl) => {
    let homeRank = 0, awayRank = 0

    // Add total wins
    homeRank += homeTeamStanding['win']
    awayRank += awayTeamStanding['win']

    if ((homeTeamStanding['win_p']) > (awayTeamStanding['win_p'])) {
        homeRank += (homeTeamStanding['win_p']) - (awayTeamStanding['win_p'])
    } else {
        awayRank += (awayTeamStanding['win_p']) - (homeTeamStanding['win_p'])
    }

    const homeRecords = homeTeamStanding['records'],
        awayRecords = awayTeamStanding['records'],
        homeOverUnders = homeRecords.filter(r => r['record_type'] === 'over_under')[0],
        awayOverUnders = awayRecords.filter(r => r['record_type'] === 'over_under')[0]

    if (!standingsUrl.includes('nhl') && !standingsUrl.includes('nfl') && !standingsUrl.includes('ncaaf')) {
        // Points for fewer turnovers
        homeRank += homeRecords.filter(r => r['record_type'] === 'fewer_turnovers')[0]['win_pct']
        awayRank += awayRecords.filter(r => r['record_type'] === 'fewer_turnovers')[0]['win_pct']
    }

    let homeWinRecord = homeRecords.filter(r => r['record_type'] === 'conference')[0]
    let awayWinRecord = awayRecords.filter(r => r['record_type'] === 'conference')[0]
    // Home and away game win percentage points
    if (!standingsUrl.includes('nfl') && !standingsUrl.includes('ncaaf')) {
        homeRank += homeRecords.filter(r => r['record_type'] === 'home')[0]['win_pct']
        awayRank += awayRecords.filter(r => r['record_type'] === 'road')[0]['win_pct']
    } else {
        homeRank += (homeWinRecord['wins'] / (homeWinRecord['wins'] + homeWinRecord['losses']))
        awayRank += (awayWinRecord['wins'] / (awayWinRecord['wins'] + awayWinRecord['losses']))
        homeRank += (homeWinRecord['wins'] + homeWinRecord['losses'])
        awayRank += (awayWinRecord['wins'] + awayWinRecord['losses'])
    }

    if (!standingsUrl.includes('nfl') && !standingsUrl.includes('ncaaf')) {
        // Random record additions
        homeRank += homeRecords.filter(r => r['record_type'] === 'last_10')[0]['win_pct']
        awayRank += awayRecords.filter(r => r['record_type'] === 'last_10')[0]['win_pct']
        homeRank += homeRecords.filter(r => r['record_type'] === 'last_10_home')[0]['win_pct']
        awayRank += awayRecords.filter(r => r['record_type'] === 'last_10_road')[0]['win_pct']
    }

    // Subtract their division rank to their score
    if (!standingsUrl.includes('ncaab') && !standingsUrl.includes('nfl') && !standingsUrl.includes('ncaaf')) {
        homeRank -= homeTeamStanding['division_rank']
        awayRank -= awayTeamStanding['division_rank']
    }

    return [
        homeRank,
        awayRank,
        homeOverUnders,
        awayOverUnders,
        homeRecords,
        awayRecords,
        homeWinRecord,
        awayWinRecord
    ]
}
