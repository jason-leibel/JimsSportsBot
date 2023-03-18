require("dotenv").config()
const {Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, Events} = require("discord.js")
const puppeteer = require('puppeteer')

let funnyWords = ['69', '420', 'tits', 'boobs', 'butt', 'sex']

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.once("ready", () => {
    console.log("Listening for events...")

    const loadout = new SlashCommandBuilder()
        .setName('loadout')
        .setDescription('Your command description goes here')
        .addBooleanOption(option =>
            option
                .setName("warzone")
                .setDescription("Is this warzone")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("weapon")
                .setDescription("You must supply the name of the weapon")
                .setRequired(true)
        )

    client.application.commands.create(loadout, process.env.GUILD_ID)
})

client.login(process.env.TOKEN)

// Listen for messages
client.on("messageCreate", msg => {
    if (funnyWords.some(function (v) {
        return msg.content.toLowerCase().indexOf(v) >= 0;
    }) && !msg.content.includes('@')) {
        msg.channel.send('nice.')
    }
})

// Listen for commands
client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'loadout') {
        const weaponName = interaction.options.getString("weapon")
        interaction.reply(`You have requested a meta build for: ${weaponName}`)
        getWeaponLoadout(weaponName.split(' ').join('-').toLowerCase(), interaction.channel, interaction.options.getBoolean("warzone"))
    }
})


/**
 * This method gets weapons data from https://mwloadout.com/gun/ and outputs it into an embed
 * @param weaponName - String with the name of the weapon
 * @param channel - The channel to send the weapon to
 * @param isWarzone - wether or not you want a warzone build
 * @returns {Promise<void>}
 */
async function getWeaponLoadout(weaponName, channel, isWarzone) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto((isWarzone) ? `https://warzoneloadout.games/wz2/${weaponName}/` : `https://mwloadout.com/gun/${weaponName}/`);

    try {
        // initialize a variable we can use to store all our scraped data from
        let result = {};
        // Extract the weapon img from the website (this may be null if it doesnt exist)
        result['img'] = (await page.$$eval('img', a => {
            const data = [];
            for (const child of a) data.push(child.getAttribute('src'));
            return data;
        })).filter(src => src.includes((isWarzone) ? "Loadout-1" : "Loadouts"))[0]
        // Make a variable to keep track of where we are while looping, we will start at the 0 position
        let index = 0;
        // Fetch the different groups of attachements (ranked <- if exists, mulitplayer)
        const wrappers = (await page.$$('.loadout__attachments'))
        // Loop through those groups
        for (const wrapper of wrappers) {
            // Assume the first group is the normal attachements
            let current = 'normal'
            // If we retrieved 2 groups then 1 of them is for ranked
            if (wrappers.length > 1) {
                // If we are currently looping through 1 of 2 elements and that element is the first one, its for ranked
                current = (index === 0) ? 'ranked' : 'normal'
            }
            // setup object
            result[current] = {}
            // loop through the children of this group (the children should be all attachments for the group)
            for (const loadoutType of (await wrapper.$$('.loadout_attachment'))) {
                // To prevent errors we need to initalize an array if it doesnt exist so we can add items to it later
                if (!result[current].hasOwnProperty('types')) result[current]['types'] = []
                if (!result[current].hasOwnProperty('values')) result[current]['values'] = []
                // Extract the type of weapon attachment (ex. Muzzle)
                // once extracted add it to the types array
                result[current]['types'].push(await loadoutType.$eval('.loadouts_attachment_type', e => e.textContent))
                // Extract the name of the attachement and the tuning if it exists
                // once extracted add it to the values array
                result[current]['values'].push(await loadoutType.$eval('.loadouts_attachment_name_wrapper', e => {
                    const data = [];
                    for (const child of e.children) data.push(child.innerText);
                    return data;
                }))
                // increase the counter at the end of the loop so when we loop through again we know we are in the next position
                index += 1
            }
        }

        await browser.close();

        console.log(result.normal)

        const embed = new EmbedBuilder()
            .setTitle(`${weaponName.toUpperCase()}`)
            .setImage(result.img)
            .setDescription(`Meta build for the ${weaponName}`)
            .setColor('#00ffff')
            .setURL(`https://mwloadout.com/gun/${weaponName}`)

        let fields = []
        if (result.hasOwnProperty('ranked')) {
            let rankedValues = []
            for (let i = 0; i < result.ranked.values.length; i++) {
                rankedValues.push(`*** ${result.ranked.types[i]} ***: ${result.ranked.values[i][0]}${(result.ranked.values[i].length > 1) ? ` *** TUNING: *** ${result.ranked.values[i][1].replace('\n', ' ')}` : ''}`)
            }
            fields.push({
                name: (isWarzone) ? 'Close Range' : 'Ranked Build',
                value: rankedValues.join('\n')
            })
        }

        let normalValues = []
        for (let i = 0; i < result.normal.values.length; i++) {
            normalValues.push(`*** ${result.normal.types[i]} ***: ${result.normal.values[i][0]}${(result.normal.values[i].length > 1) ? ` *** TUNING: *** ${result.normal.values[i][1].replace('\n', ' ')}` : ''}`)
        }
        fields.push({
            name: (isWarzone) ? 'Sniper Support' : 'Normal Build',
            value: normalValues.join('\n')
        })
        embed.addFields(fields)

        channel.send({embeds: [embed]})
    } catch (err) {
        // Do whatever you want here, an error happened
        channel.send(`Figure it out buddddyyy, The gun name: ${weaponName}, is not listed on the Call of Duty: Modern Warfare II gun list or does not have a meta build`)
    }
}
