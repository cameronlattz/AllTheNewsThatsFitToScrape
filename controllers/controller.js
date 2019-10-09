const express = require("express");
const router = express.Router();
const Articles = require("../models/articlesModel");
const Feeds = require("../models/feedsModel");
const Scraper = require("../modules/scraper");

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/api/articles", function(req, res) {
    Articles.find({}).then(function(articles) {
        res.send(articles.reverse());
    });
});

router.get("/api/articles/scrape", async function(req, res) {
    const existingArticles = await Articles.find({});
    const scrapedArticles = await Scraper.asyncScrape();
    const newArticles = scrapedArticles.filter(article => {
        return !existingArticles.some(existingArticle => {
            return existingArticle.summary === article.summary;
        });
    });
    const articles = existingArticles.concat(newArticles).reverse();
    Articles.create(newArticles).then(function(response) {
        res.send(articles);
    }).catch(function(error) {
        //catching duplicate keys error - we don't want to save articles with the same title so this is ok
        if (error.code === 11000) {
            res.send(articles);
        }
    });
});

router.post("/api/articles/:id/comment", function(req, res) {
    Articles.updateOne({_id: req.body.articleId}, {$push: { comments: req.body.comment}})
        .then(function(response) {
            res.send(JSON.stringify(response));
        });
});

router.delete("/api/feeds/:id", function(req, res) {
    Feeds.deleteOne({_id: req.body.feedId}).then(function(response) {
        res.send(response);
    });
});

router.post("/api/feeds", function(req, res) {
    Feeds.create(req.body).then(function(response) {
        res.send(JSON.stringify(response));
    });
});

router.get("/api/articles/wipe", function(req, res) {
    Articles.deleteMany({}).then(function(response) {
        res.send(response);
    });
});

router.get("/api/feeds/wipe", function(req, res) {
    Feeds.deleteMany({}).then(function(response) {
        res.send(response);
    });
});

module.exports = router;