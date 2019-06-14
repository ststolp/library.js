const http = require('http');
const express = require('express');
const controller = require("./controllers/libraryFunctions.js");
const session = require('express-session');
const app = express();

app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave: false,
}))

app.set('port', (process.env.PORT || 5000));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", controller.redirectUser);
app.get("/get_library", controller.getLibrary);
app.get("/search_library", controller.searchLibrary);
app.get("/get_genres", controller.getGenres);
app.get("/get_authors", controller.getAuthors);
app.get("/get_checked", controller.getChecked);
app.get("/get_myBooks", controller.requireLogin, controller.getMyBooks);
app.get('/sign_in', controller.signIn);
app.get('/sign_out', controller.signOut);

app.post("/add_author", controller.addAuthor);
app.post("/add_book", controller.addBook);
app.post("/add_genre", controller.addGenre);
app.post("/check_out", controller.requireLogin, controller.checkOut);
app.post("/add_user", controller.validatePassword, controller.register);

app.listen(app.get('port'), function(){
	console.log("It's working");
});