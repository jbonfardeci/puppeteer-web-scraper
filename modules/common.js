const puppeteer = require('puppeteer-core');

/**
 * The scrapeWebData function takes a URL, CSS selector, and callback function as arguments.
 * It uses the Puppeteer library to scrape data from the given URL using the given CSS selector.
 * The results are passed into the callback function which is then returned by this function.
 
 *
 * @param url Specify the url of the website to scrape
 * @param selector Select the elements that will be scraped
 * @param callback Return the data to the scrapewebdata function
 * @param headless Specify whether or not to use a headless browser
 *
 * @return An array of objects
 *
 * @docauthor Trelent
 */
async function scrapeWebData(url, selector, callback, headless){
    if(headless === undefined){
        headless = true;
    }
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        headless: headless
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    const res = await page.goto(url);
    const status = res.status();
    if(status != 200){
        throw new Error(`The URL at '${url}' was not found.`);
    }
    const results = await page.$$eval(selector, callback);
    await browser.close();
    if(results === undefined || results.length === 0) {
        throw new Error('The CSS selector returned 0 results.');
    }
    return results;
}

exports.scrapeWebData = scrapeWebData