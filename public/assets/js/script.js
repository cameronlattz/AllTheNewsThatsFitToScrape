(function() {
    let _articles = [];

    const _addComment = function(event) {
        event.preventDefault();
        const form = event.target;
        const body = {
            comment: form.comment.value
        };
        fetch("api/articles/" + form.id + "/comments", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"},
          })
        .then(function(response) {
            return response.json();
        }).then(function() {
            const ul = form.getElementsByTagName("ul")[0];
            _buildComments(ul, [body.comment])
            form.reset();
        })
        .catch(function() {});
    }

    const _addFeed = function(event) {
        event.preventDefault();
        const sites = [...new Set(_articles.map(article => article.site))].sort();
        if (sites.length < 5) {
            const input = event.target;
            const form = input.closest("form");
            const body = {
                url: form.url.value,
                site: form.site.value
            };
            fetch("api/feeds", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {"Content-Type": "application/json"}
            })
            .then(function(response) {
                return response.json();
            }).then(function() {
                form.reset();
                _scrape();
            })
            .catch(function() {});
        } else {
            _alert("You may not have more than 5 RSS feeds.");
        }
    }

    const _alert = function(message) {
        const alertDiv = document.getElementById("alertDiv");
        alertDiv.innerText = message;
        alertDiv.classList.add("show");
        setTimeout(function() {
            alertDiv.classList.remove("show");
        }, 3000);
    }

    const _buildComments = function(ul, comments) {
        const lis = comments.map(comment => {
            const li = document.createElement("li");
            li.innerText = comment;
            const link = document.createElement("a");
            link.innerText = "x";
            link.classList.add("x");
            link.addEventListener("click", _removeComment);
            li.append(link);
            return li;
        });
        const existingComments = ul.getElementsByTagName("li");
        if (existingComments.length === 0 && comments.length > 0) {
            const lh = document.createElement("lh");
            lh.innerText = "Comments:";
            lis.unshift(lh);
        }
        ul.append(...lis)
        return ul;
    }

    const _displayArticles = function(articles, updateFeeds = true) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        const date = days[today.getDay()] + ", " + months[today.getMonth()+1] + " " + today.getDate() + ", " + today.getFullYear();
        document.getElementById("subHeader").innerText = date;
        const articlesTr = document.getElementById("articles");
        articlesTr.innerHTML = "";
        const sites = [...new Set(articles.map(article => article.site))].sort();
        if (sites.length === 0) {
            const td = document.createElement("td");
            const h3 = document.createElement("h3");
            h3.classList.add("no-feeds");
            h3.innerText = "No feeds added. Please add an RSS feed to continue.";
            td.append(h3);
            articlesTr.append(td);
        }
        document.getElementById("scrapeImg").classList.remove("spin");
        sites.forEach(site => {
            const siteTd = document.createElement("td");
            siteTd.classList.add("site");
            const h3 = document.createElement("h3");
            h3.innerText = site;
            const link = document.createElement("a");
            link.innerText = "x";
            link.classList.add("x");
            link.addEventListener("click", _removeFeed);
            h3.append(link);
            siteTd.append(h3);
            const siteArticles = articles.filter(article => article.site === site);
            siteArticles.forEach(article => {
                const clone = document.getElementsByClassName("articleForm")[0].cloneNode(true);
                const link = clone.getElementsByClassName("link")[0];
                link.href = article.url;
                link.innerText = article.title;
                const lastSummaryCharacter = article.summary.charAt(article.summary.length-1);
                if (![".", "!", "?", ",", ":", ";", "…"].includes(lastSummaryCharacter)) {
                    article.summary += ".";
                }
                clone.getElementsByClassName("summary")[0].innerText = article.summary;
                const ul = clone.getElementsByClassName("comments")[0];
                _buildComments(ul, article.comments);
                clone.setAttribute("id", article._id);
                clone.addEventListener("submit", _addComment);
                siteTd.append(clone);
            });
            articlesTr.append(siteTd);
        });
    }

    const _filterArticles = function(event) {
        event.preventDefault();
        const form = event.target;
        const keywords = form.keywords.value.split(",");
        const filteredArticles = _articles.filter(article => {
            return keywords.some(keyword => {
                if (article.summary.toLowerCase().indexOf(keyword) !== -1) {
                    return true;
                } else if (article.title.toLowerCase().indexOf(keyword) !== -1) {
                    return true;
                }
            });
        });
        _displayArticles(filteredArticles, false);
    }

    const _init = function() {
        const scrapeImg = document.getElementById("scrapeImg");
        scrapeImg.classList.add("spin");
        scrapeImg.addEventListener("click", _scrape);
        document.getElementById("addFeedForm").addEventListener("submit", _addFeed);
        document.getElementById("filterForm").addEventListener("submit", _filterArticles);
        fetch("api/articles").then(function(response) {
            return response.json();
        }).then(function(articles){
            _articles = articles;
            if (articles.length === 0) {
                _scrape();
            } else {
                scrapeImg.classList.remove("spin");
                _displayArticles(articles);
            }
        });
    }

    const _removeComment = function(event) {
        const a = event.target;
        const text = a.previousSibling.textContent;
        const body = {
            comment: text
        }
        const form = a.closest("form");
        fetch("api/articles/" + form.id + "/comments", {
            method: "DELETE",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"},
          })
        .then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            const ul = a.closest("ul");
            a.closest("li").remove();
            const lis = ul.getElementsByTagName("li");
            if (lis.length === 0) {
                ul.getElementsByTagName("lh")[0].remove();
            }
        });
    }

    const _removeFeed = function(event) {
        const sites = [...new Set(_articles.map(article => article.site))].sort();
        if (sites.length > 3) {
            const a = event.target;
            const text = a.previousSibling.textContent;
            const body = {
                name: text
            }
            fetch("api/feeds/", {
                method: "DELETE",
                body: JSON.stringify(body),
                headers: {"Content-Type": "application/json"},
              })
            .then(function(response) {
                return response.json();
            }).then(function(responseJson) {
                a.closest("h3").remove();
                _scrape();
            });
        } else {
            _alert("You cannot have less than 3 RSS feeds.");
        }
    }

    const _scrape = function() {
        document.getElementById("articles").innerHTML = "";
        document.getElementById("filterForm").keywords.value = "";
        document.getElementById("filterForm").classList.add("hide");
        document.getElementById("addFeedForm").classList.add("hide");
        document.getElementById("loading").classList.remove("hide");
        document.getElementById("scrapeImg").classList.add("spin");
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

    document.addEventListener("DOMContentLoaded", _init);
})();