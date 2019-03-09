var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("views", "view");
app.set("view engine", "ejs");

app.get("/", redirectUser);

function redirectUser(req, res) {
    return res.redirect('home.html');
};