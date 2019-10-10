# AllTheNewsThatsFitToScrape
https://daily-scraper-cl.herokuapp.com/

### TODO:
Restructure code
Comment code
Write readme

Eat-Da-Burger is an app that lets you eat burgers!
Enter the name of a burger in the input on the bottom to add it to the list on the left.
Click a burger on the left to eat it!

### OVERVIEW:
This is app utilizes a MySQL database, Express/Handlebars routing, and an MVC design pattern. The database and server are hosted on Heroku.

A request to the root directory grabs a list of burgers from the MySQL database and serves up the *"index.html"* page with that burger data. This, and all other SQL calls are made through a custom ORM. The *"index.html"* layout is built using *"main.handlebars"* and "*index.handlebars*". Animations and further API calls to eat a burger or add a new burger are done using JavaScript.

### TECHNOLOGIES USED:
* Node
* Express Node module
* Express-Handlebars Node module
* MySQL
* Heroku

### TEAM:
* Cameron Lattz, Developer