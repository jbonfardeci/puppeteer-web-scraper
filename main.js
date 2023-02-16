const gartner = require('./scrapers/gartner');

/**
 * Runs all web scrapers.
 */
(async () => {
    await gartner.scrapeWebsite('json/gartner');
})();