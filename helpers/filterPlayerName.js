module.exports = (name) => {
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1),
        split = name.split('-')
    let player = {
        name: '',
        id: ''
    }
    for (let i = 0; i < split.length - 1; i++) {
        player.name += capitalizeFirstLetter(`${split[i]} `)
    }
    player.id = split[split.length - 1]
    player.name = player.name.trim()
    return player
}
