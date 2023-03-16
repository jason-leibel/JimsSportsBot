module.exports = (sport) => {
    switch (sport) {
        case 'ncaab':
        case 'nba':
        case 'ncaabpicks':
        case 'nbapicks':
            return '🏀'
        case 'nfl':
        case 'ncaaf':
        case 'nflpicks':
        case 'ncaafpicks':
            return '🏈'
        case 'soccer':
            return '⚽️'
        case 'nhl':
        case 'nhlpicks':
            return '🏒'
    }
}
