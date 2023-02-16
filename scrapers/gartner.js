const common = require('../modules/common');
const fs = require('fs');


/**
 * The scrapeWebsite function scrapes the Gartner website for IT glossary terms and their definitions.
 * 
 *
 * @param dataDir Store the scraped data
 *
 * @return A promise
 *
 * @docauthor Trelent
 */
async function scrapeWebsite(dataDir) {
    // Accept Cookies Button
    // await page.$eval("#onetrust-accept-btn-handler", btn => btn.click());
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const url = 'https://www.gartner.com/en/information-technology/glossary?glossaryletter=';
    const termSelector = "div.search-result div.keysearch-result-container div.search-item a.result-heading";
    const glossaryPageCallback = (elems) => elems.map((el) => {
        return {
            'term': el.innerText,
            'href': el.href
        };
    });

    // Get term definitions.
    const termDefinitionSelector = "div.cmp-globalsite-glossaryterm > section > div.row > div.col-md-12 > p";
    const termCallback = (elems) => elems.map((el) => {
        return {
            'definition': el.innerText
        };
    });

    for (let ltr of alpha){
        let data = [];
        let pageData = await common.scrapeWebData(url+ltr, termSelector, glossaryPageCallback);
        // console.log(pageData.length);
        for (let pd of pageData) {
            let {term, href} = pd;  
            let termData = await common.scrapeWebData(href, termDefinitionSelector, termCallback);
            let termDef = [];
            for(let td of termData) {
                if(td.definition != ''){
                    termDef.push(td.definition);
                }
            }
            let termObj = {
                'term': term,
                'definition': termDef.join(' ')
            };
            if(termObj.definition){
                data.push(termObj);
                console.log(`Found '${term}' definition.`);
            }
        }
        fs.writeFileSync(`${dataDir}/${ltr}.json`, JSON.stringify(data), 'utf8');
    }
}

exports.scrapeWebsite = scrapeWebsite;