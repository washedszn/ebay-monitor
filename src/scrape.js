const superagent = require('superagent');
const settings = require('../settings.json');
const cheerio = require('cheerio');
const fs = require('fs');

const scrapeEbay = () => {

    superagent
        .get('https://www.ebay.co.uk/sch/i.html?_nkw=' + settings.keyword.join('+') + '&_sacat=0&_sop=10')
        .then(res => {
            let $ = cheerio.load(res.text);

            let products = [];

            $('#ListViewInner > li').each( function (index, element) {
                let name = $($(element).find('.lvtitle')).text().split('\n')[1].replace('\t\t', '');
                let price = $($(element).find('ul > li > .bold')).text().replace(/[^0-9.]/g, '');
                let condition = $($(element).find('.lvsubtitle')).text().replace(/[^a-zA-Z0-9 .]/g, '');
                products[index] = {
                    name: name,
                    price: price,
                    condition: condition
                }
            })

            console.log(products);
        })
        .catch(err => {
            console.log(err)
        })
}

scrapeEbay()