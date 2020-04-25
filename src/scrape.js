const superagent = require('superagent');
const cheerio = require('cheerio');

const scrapeEbay = async (keywords) => {

    return await superagent
        .get('https://www.ebay.co.uk/sch/i.html?_nkw=' + keywords.join('+') + '&_sacat=0&_sop=10')
        .then(res => {
            let $ = cheerio.load(res.text);
            let products = [];

            $('#ListViewInner > li').each( function (index, element) {
                el = $(element);
                let id = el.attr('listingid')
                let url = $(el.find('.lvtitle > a')).attr('href');
                let img = $(el.find('.img.load-img')).attr('imgurl');
                let name = $(el.find('.lvtitle')).text().split('\n')[1].replace('\t\t', '');
                let price = $(el.find('ul > li > .bold')).text().replace(/[^0-9.]/g, '');
                let condition = $(el.find('.lvsubtitle')).text().replace(/[^a-zA-Z0-9 .]/g, '');
                let type = $(el.find('.lvformat > span')).text();
                let type2 = $(el.find('.lvformat > div')).text();
                type = !type || type2 ? 'Buy it Now' : 'Auction'
                products[index] = {
                    id: id,
                    url: url,
                    img: img,
                    name: name,
                    price: price,
                    condition: condition,
                    saleType: type
                }
            })
            if (res.status != 200) {
                console.log(res.status)
            }
            return products
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = scrapeEbay;