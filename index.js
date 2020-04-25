const scrapeEbay = require('./src/scrape');
const sendEmbed = require('./src/webhook');
const settings = require('./settings.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
let active;
let stock = [];

const checkListings = async (keywords, index) => {
    let update = await scrapeEbay(keywords);
    if (!stock[index]) {
        return stock[index] = update;
    }
    let newStock = update.filter(x => !stock[index].some(y => x.id === y.id));
    for (let i = 0; i < newStock.length; i++) {
        await sendEmbed(newStock[i]);
    }
    stock[index] = update;
}

const startMonitor = () => {
    active = true;
    let monitor = setInterval(() => {
        if (!active) {
            return clearInterval(monitor);
        }
        settings.keyword.forEach((key, index) => {
            checkListings(key.split(', '), index)
        })
    }, 30000)
}

const edit = (type, content) => {
    try {
        fs.readFile('settings.json', (err, data) => {
            if (err) throw err;
            let json = JSON.parse(data);
    
            type == 'add' ? json.keyword.push(content) : null;
            type == 'remove' ? json.keyword.splice(content, 1) : null;
            fs.writeFileSync('settings.json', JSON.stringify(json, null, 4))
            stock.length = 0;
        })
        return true;
    } catch (err) {
        return false;
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    startMonitor();
    client.user.setActivity('eBay Listings', { type: 'WATCHING'})
});

client.on('message', (msg) => {

    let command = msg.content.split(' ')[0];
    let content = msg.content.replace(`${command} `, '');

    switch (command) {
        case '!start':
            !active ? startMonitor() : null;
            client.user.setActivity('eBay Listings', { type: 'WATCHING'})
            break;
        case '!stop':
            active = false;
            stock.length = 0;
            client.user.setActivity('with nothing :(', { type: 'PLAYING'})
            break;
        case '!add':
            msg.channel.send(edit('add', content) ? `Successfully added: ${content}` : 'Failed!')
            break;
        case '!remove':
            let c = JSON.parse(fs.readFileSync('settings.json')).keyword[content - 1]
            msg.channel.send(edit('remove', content - 1) ? `Successfully removed: ${c}` : 'Failed!')
            break;
        case '!keyword':
            settings.keyword.forEach((key, index) => {
                msg.channel.send(`Keyword group[${index + 1}]: ${key}`)
            })
            break;
    }
})

client.login(settings.token)
