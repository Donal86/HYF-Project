const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');

const pages = [
    'https://milano.bakeca.it/annunci/vendita-case/',
    'https://milano.bakeca.it/annunci/vendita-case/page/2/',
    'https://milano.bakeca.it/annunci/vendita-case/page/3/',
    'https://milano.bakeca.it/annunci/vendita-case/page/4/',
    'https://milano.bakeca.it/annunci/vendita-case/page/5/'
];

if (!fs.existsSync('links.json')) {
    fs.appendFile('links.json', '[]', error => console.log(error));

    let housesLinksArr = [];
    const initURL = 'https://milano.bakeca.it/dettaglio/vendita-case';

    pages.forEach(url => {
        rp(url)
            .then(html => {
                const $ = cheerio.load(html, {
                    xmlMode: true
                });
                $('.b-ann-title > a').each((i, elm) => {
                    const houseLink = initURL + $(elm).attr('href');
                    housesLinksArr.push(houseLink);
                });
                fs.writeFile(
                    './links.json', JSON.stringify(housesLinksArr),
                    error => {
                        if (error) console.log(error);
                        else console.log("Done!");
                    }
                );
            })
            .catch(error => console.log("error", error));
    });
} else console.log("error", error);
