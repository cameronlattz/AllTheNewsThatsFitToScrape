(function() {
    const _init = function() {
        document.getElementById("scrape").addEventListener("click", _scrape);
        fetch("api/articles")
        .then(function(response) {
            return response.json();
        }).then(function(articles){
            articles.map(article => {
                const clone = document.getElementsByTagName("form")[0].cloneNode(true);
                const link = clone.getElementsByClassName("link")[0];
                link.href = article.url;
                link.innerText = article.title;
                clone.getElementsByClassName("summary")[0].innerText = article.summary;
                clone.getElementsByClassName("icon")[0].src = "assets/images/" + article.site + ".jpg";
                const lis = article.comments.map(comment => {
                    const li = document.createElement("li");
                    li.innerText = comment;
                    return li;
                })
                clone.getElementsByClassName("comments")[0].append(...lis);
                clone.setAttribute("id", article._id);
                clone.addEventListener("submit", _submitComment);
                document.getElementById("container").append(clone);
            });
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

    const _scrape = function() {
        document.getElementById("container").classList.add("hide");
        document.getElementById("loadingWrapper").classList.remove("hide");
        fetch("api/articles/scrape")
        .then(function(response) {
            return response.json();
        }).then(function(){
            window.location.reload();
        });
    }

    document.addEventListener("DOMContentLoaded", _init);
})();