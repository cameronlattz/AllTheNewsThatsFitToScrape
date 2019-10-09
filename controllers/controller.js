const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
const connection = require("../config/connection");
const Articles = require("../models/articlesModel");

const cnn = "http://rss.cnn.com/rss/cnn_allpolitics.rss";
const fox = "http://feeds.foxnews.com/foxnews/politics";
const wapo = "http://feeds.washingtonpost.com/rss/politics?tid=lk_inline_manual_2";
const reuters = "http://feeds.reuters.com/Reuters/PoliticsNews";
const time = "http://feeds.feedburner.com/timeblogs/swampland";
const feeds = {cnn, fox, wapo, reuters, time};

// converts rss feed into html so cheerio can read it
// also standardizes layout so we don't have to customize cheerio lookups for each site
function getHtmlUrlFromRssUrl(rssUrl) {
    const encodedRssUrl = encodeURIComponent(rssUrl);
    return "http://rss.bloople.net/?url=" + encodedRssUrl + "&showtitle=false&type=html";
}

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/api/articles", function(req, res) {
    Articles.find({}).then(function(articles) {
        res.send(articles);
    });
});

router.get("/api/articles/scrape", function(req, res) {
    // make this do all news sites at once
    const keys = Object.keys(feeds);
    const key = keys[0]
    const url = getHtmlUrlFromRssUrl(feeds[key]);
    axios.get(url).then(function(response) {
        const $ = cheerio.load(response.data);
        let articles = [];
        $("h4").each(function(i, element) {
            const link = $(element).find("a").get(0);
            const href = $(link).attr("href");
            const title = $(link).text();
            const p = $(element).next();
            const description = $(p).text().trim();
            if (description.length !== 0) {
                articles.push({
                    title: title,
                    url: href,
                    summary: description,
                    site: key
                });
            }
        });
        Articles.create(articles).then(function(response) {
            res.send(articles);
        }).catch(function(error) {
            res.send(articles);
        });
    });
});

router.get("/api/articles/wipe", function(req, res) {
    Articles.deleteMany({}).then(function(articles) {
        res.send(articles);
    });
});

router.get("/api/articles/:id", function(req, res) {
    Articles.findOne({_id: req.body.id}).then(function(articles) {
        res.send(articles);
    });
});

router.post("/api/articles/:id/comment", function(req, res) {
    Articles.updateOne({_id: req.body.articleId}, {$push: { comments: req.body.comment}})
        .then(function(response) {
            res.send(JSON.stringify(response));
        });
});

module.exports = router;