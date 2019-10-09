const cheerio = require("cheerio");
const axios = require("axios");
const Feeds = require("../models/feedsModel");

const Scraper = function() {
    async function getFeeds() {
        const feedsObjects = await Feeds.find({});
        const feeds = feedsObjects.map(feedsObject => {
            return {
                url: feedsObject.url,
                site: feedsObject.site
            }
        });
        return feeds;
    }

    // converts rss feed into html so cheerio can read it
    // also standardizes layout so we don't have to customize cheerio lookups for each site
    function getHtmlUrlFromRssUrl(rssUrl) {
        const encodedRssUrl = encodeURIComponent(rssUrl);
        return "http://rss.bloople.net/?url=" + encodedRssUrl + "&showtitle=false&type=html";
    }

    async function scrape(url, site) {
        const htmlUrl = getHtmlUrlFromRssUrl(url);
        const response = await axios.get(htmlUrl);
        const $ = cheerio.load(response.data);
        let articles = [];
        $("h4").each(function(i, element) {
            const aElement = $($(element).find("a").get(0));
            const pElement = $($(element).next());
            const href = aElement.attr("href").trim();
            const title = aElement.text().trim();
            const description = pElement.text().trim();
            if (description.length !== 0) {
                const article = {
                    title: title,
                    url: href,
                    summary: description,
                    site: site,
                    comments: []
                };
                articles.push(article);
            }
        });
        return articles.reverse();
    }

    return {
        asyncScrape: async function() {
            const feeds = await getFeeds();
            const funcs = feeds.map(feed => {
                return scrape(feed.url, feed.site);
            });
            const articlesArrays = await Promise.all(funcs);
            const articles = [].concat.apply([], articlesArrays);
            return articles;
        }
    }
}

module.exports = Scraper();