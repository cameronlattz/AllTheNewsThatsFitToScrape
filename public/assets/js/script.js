(function() {
    let _articles = [];

    const _addFeed = function(event) {
        event.preventDefault();
        const input = event.target;
        const form = input.closest("form");
        const body = {
            url: form.url.value,
            site: form.site.value
        };
        fetch("api/feeds", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"},
          })
        .then(function(response) {
            return response.json();
        }).then(function() {
            form.reset();
            _scrape();
        })
        .catch(function() {});
    }

    const _displayArticles = function(articles) {
        const articlesDiv = document.getElementById("articles");
        const sites = [...new Set(articles.map(article => article.site))];
        if (sites.length === 0) {
            document.getElementById("sitesList").innerText = "No feeds added. Please add a feed to scrape news from.";
        } else {
            document.getElementById("sitesList").innerText = sites.join(", ");
        }
        sites.forEach(site => {
            const siteDiv = document.createElement("div");
            siteDiv.classList.add("site");
            switch (sites.length) {
                case 1:
                    siteDiv.style.width = "100%";
                    break;
                case 2:
                    siteDiv.style.width = "50%";
                    break;
                case 3:
                    siteDiv.style.width = "33%";
                    break;
                case 4:
                    siteDiv.style.width = "25%";
                    break;
                case 5:
                    siteDiv.style.width = "20%";
                    break;
                case 6:
                    siteDiv.style.width = "33%";
                    break;
            }
            const h3 = document.createElement("h3");
            h3.innerText = site;
            siteDiv.append(h3);
            const siteArticles = articles.filter(article => article.site === site);
            siteArticles.forEach(article => {
                const clone = document.getElementsByClassName("articleForm")[0].cloneNode(true);
                const link = clone.getElementsByClassName("link")[0];
                link.href = article.url;
                link.innerText = article.title;
                clone.getElementsByClassName("summary")[0].innerText = article.summary;
                article.comments.forEach(comment => {
                    const li = document.createElement("li");
                    li.innerText = comment;
                    clone.getElementsByClassName("comments")[0].append(li);
                });
                clone.setAttribute("id", article._id);
                clone.addEventListener("submit", _submitComment);
                siteDiv.append(clone);
            });
            articlesDiv.append(siteDiv);
        });
    }

    const _init = function() {
        document.getElementById("scrapeImg").addEventListener("click", _scrape);
        document.getElementById("addFeedForm").addEventListener("submit", _addFeed);
        fetch("api/articles").then(function(response) {
            return response.json();
        }).then(function(articles){
            if (articles.length === 0) {
                _scrape();
            } else {
                _displayArticles(articles);
            }
        });
    }

    const _scrape = function() {
        document.getElementById("articles").innerHTML = "";
        document.getElementById("filterForm").classList.add("hide");
        document.getElementById("addFeedForm").classList.add("hide");
        document.getElementById("loading").classList.remove("hide");
        fetch("api/articles/scrape").then(function(response) {
            return response.json();
        }).then(function(articles) {
            document.getElementById("loading").classList.add("hide");
            document.getElementById("filterForm").classList.remove("hide");
            document.getElementById("addFeedForm").classList.remove("hide");
            _articles = articles;
            _displayArticles(articles);
        });
    }

    const _submitComment = function(event) {
        event.preventDefault();
        const form = event.target;
        const body = {
            articleId: form.id,
            comment: form.comment.value
        };
        fetch("api/articles/" + form.id + "/comment", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"},
          })
        .then(function(response) {
            return response.json();
        }).then(function() {
            const form = document.getElementById(body.articleId);
            const li = document.createElement("li");
            li.innerText = body.comment;
            const ul = form.getElementsByTagName("ul")[0];
            ul.append(li);
            form.reset();
        })
        .catch(function() {});
    }

    document.addEventListener("DOMContentLoaded", _init);
})();