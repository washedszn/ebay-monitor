const superagent = require('superagent');
const webhook = require('../settings.json').webhook;

const sendWebhook = async (data) => {

    if (data.saleType == 'Auction' || 50 < data.price < 250) {
        console.log(`Blocked - ${data.url}`)
        return;
    }
    let embed = {
        embeds: [
            {
                "title": data.name,
                "url": data.url,
                "color": 6520503,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": "https://pbs.twimg.com/profile_images/1122866158414307328/5uPw6hkM_400x400.jpg",
                    "text": "eBay didn't give me API access"
                },
                "thumbnail": {
                    "url": data.img
                },
                "fields": [
                    {
                        name: 'Price:',
                        value: '£' + data.price,
                        inline: true
                    },
                    {
                        name: 'Condition:',
                        value: data.condition,
                        inline: true
                    },
                    {
                        name: 'Sale Type:',
                        value: data.saleType,
                        inline: true
                    }
                ]
            }]
    }

    return await superagent
        .post(webhook)
        .send(embed)
        .then(res => {
            console.log(`Sent: [${res.status}]`)
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = sendWebhook;