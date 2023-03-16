const fs = require("fs")
const client = require("https")

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}

function doSomething() {
    const fetchConfig = {"referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET"}
    Promise.all([
        fetch("https://api.actionnetwork.com/web/v1/standings/nhl", fetchConfig).then(resp => resp.json())
    ]).then(resp => {
        const urls = []
        resp[0].standings.forEach(standing => {
            urls.push({
                src: standing.team.logo,
                abbr: standing.team['display_name']
            })
        })

        urls.forEach(urlObj => {
            if (urlObj.src !== null && !urlObj.src.includes('fallback')) {
                downloadImage(urlObj.src, `./logos/${urlObj.abbr}.png`).then(console.log).catch(console.error)
            }
        })
    })
}

doSomething()
