# TheDailyScraper
https://daily-scraper-cl.herokuapp.com/

The Daily Scraper is an app that scrapes RSS news feeds and displays their articles on one page.

### **USAGE:**
**News feeds:**  
To add a news feed, first add the site's name to the "Site name" input box on the top right. Then paste an RSS feed url into the "Feed url" input and hit enter or the "Add Feed" button.  
To remove a news feed, click the "x" button next to the site name in the article list.  
NOTE: Not all RSS feeds will work. Some, especially ones that are wrapped in a JS function, are not formatted in a way that the scraper can read. A partial list of working RSS feeds is included below.

**Comments:**  
To add a comment, enter a comment into the text box underneath an article and click "Add Comment".  
To remove a comment, click the "x" button next to the comment you want to remove.

**Filtering:**  
To filter news articles, type keywords (separated by a comma) in the "Keyword" input on the top right then click "Filter". If you don't use a comma, multiple words (separated by spaces) will be formatted as a single keyword.  
To remove a filter, clear the "Keyword" input and click "Filter" again.

### **OVERVIEW:**
This is app utilizes a Mongo database, Express/Handlebars routing, and an MVC design pattern. The database and server are hosted on Heroku.

A request to the root directory grabs a list of scraped articles from the Mongo database and serves up the *"index.html"* page with that article data. This, and all other Mongo calls are validated using Mongoose. The *"index.html"* layout is built using *"main.handlebars"* and "*index.handlebars*". Further API calls to add or remove a feed or comment, or to re-scrape articles, are done using JavaScript.

RSS feeds are formatted using *https://rss.bloople.net/*, which converts the RSS into HTML. The resulting HTML is then scraped by Cheerio, and all articles are added to the database.

### **PARTIAL LIST OF WORKING RSS FEEDS:**
* BBC: http://feeds.bbci.co.uk/news/rss.xml
* CBS Sports: https://rss.cbssports.com/rss/headlines/
* CNBC: https://www.cnbc.com/id/15837362/device/rss/rss.html
* CNN: http://rss.cnn.com/rss/cnn_allpolitics.rss
* Fox News: http://feeds.foxnews.com/foxnews/politics
* Reuters: http://feeds.reuters.com/Reuters/PoliticsNews
* Time: http://feeds.feedburner.com/timeblogs/swampland
* Wall Street Journal: https://feeds.a.dj.com/rss/RSSWorldNews.xml
* Washington Post: http://feeds.washingtonpost.com/rss/politics?tid=lk_inline_manual_2
* Wired: https://www.wired.com/feed/rss

### **TECHNOLOGIES USED:**
* Cheerio
* Express
* Express-Handlebars
* Heroku
* Node
* Mongo
* Mongoose

### **TEAM:**
* Cameron Lattz, Developer