const cheerio = require("cheerio");
const axios = require("axios");
const cnn = "http://rss.cnn.com/rss/cnn_allpolitics.rss"; // error
const foxNews = "http://feeds.foxnews.com/foxnews/politics";
const washingtonPost = "http://feeds.washingtonpost.com/rss/politics?tid=lk_inline_manual_2";
const reuters = "http://feeds.reuters.com/Reuters/PoliticsNews"; // error
const time = "http://feeds.feedburner.com/timeblogs/swampland";
const feeds = [cnn, foxNews, washingtonPost, reuters, time];
//const fs = require("fs");

// converts rss feed into html so cheerio can read it
function getHtmlUrlFromRssUrl(rssUrl) {
    const encodedRssUrl = encodeURIComponent(rssUrl);
    return "http://rss.bloople.net/?url=" + encodedRssUrl + "&showtitle=false&type=html";
}

const url = getHtmlUrlFromRssUrl(time);
axios.get(url).then(function(response) {
  const $ = cheerio.load(response.data);
  let titles = [];
  let descriptions = [];
  //fs.writeFile("test.html", response.data, () => {});
  $("a").each(function(i, element) {
      titles.push(element.children[0].data);
  });
  $("p").each(function(i, element) {
      descriptions.push(element.children[0].data);
  });
  titles.forEach((title, i) => {
    const description = descriptions[i];
    console.log(title + "- " + description);
  });
});