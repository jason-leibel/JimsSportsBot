const {ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");
module.exports = (interaction, date, sportType) => {
    const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}
    let url = ''
    switch (sportType) {
        case 'nba':
        case 'nhl':
        case 'nfl':
            url = process.env.API_GENERAL_URL.replace('DATE', date).replace('SPORTTYPE', sportType)
            break
        case 'ncaab':
            url = process.env.API_NCAAB_URL.replace('DATE', date)
            break
    }
    fetch(url, fetchConfig).then(resp => resp.json())
        .then(data => {
            let options = []
            data['games'].forEach(game => {
                options.push({
                    label: `${game['teams'][0]['display_name']} vs. ${game['teams'][1]['display_name']}`,
                    description: `${game['teams'][0]['full_name']} vs. ${game['teams'][1]['full_name']}`,
                    value: `${game['id']}`
                })
            })
            let menu = new StringSelectMenuBuilder()
                .setCustomId('game')
                .setPlaceholder('please make selection...')
                .addOptions(...options)
            const row = new ActionRowBuilder()
                .addComponents(menu);
            interaction.reply({ content: 'Which game would you like to get the player props for?', components: [row] });
        })
}
