const rp = require('request-promise')
const cheerio = require('cheerio');
const fs = require('fs');
const housesUrl = require('./links.json');
let houseData = [];

if (!fs.existsSync('milano-bakeca-it.json')) {
    fs.appendFile('milano-bakeca-it.json', houseData, error => console.log(error));
}

function select($, selector) {
    const selected = $(selector)
        .text()
        .trim();
    return selected
}

function reqScrape(url, ...selectors) {
    return rp(url)
        .then(html => {
            const $ = cheerio.load(html, {
                xmlMode: true
            });
            return $

        })
}

for (let i = 0; i < housesUrl.length; i++) {
    let house = {};
    reqScrape(housesUrl[i]).then($ => {      // work - blocked because of many requests
        const address = select($, '.b-dett-title h1')
        house.address = address;
        const price = select($, '.b-prezzo')
        house.price = price;
        const size = select($, 'div.col-xs-12:nth-child(5) > strong:nth-child(2)')
        house.size = size;
        houseData.push(house);
        fs.writeFile('./milano-bakeca-it.json', JSON.stringify(houseData), error => {
            if (error) console.log(error);
            else console.log('Success');
        });
    })
}