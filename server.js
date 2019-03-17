var express = require('express');
var app = express();

const controller = require("./controllers/libraryFunctions.js");
app.set('port', (process.env.PORT || 5000));
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = Pool({connectionString: connectionString});

app.use(express.static("public"));
app.set("views", "view");
app.set("view engine", "ejs");

app.get("/", redirectUser);
//app.get("/get_library", getLibrary);
app.get("/search_library", searchLibrary);

app.listen(app.get('port'), function(){
	console.log("It's working");
});
/*************************************** */

function redirectUser(req, res) {
    return res.redirect('home_library.html');
};

function getLibrary(req, res) {
    getAllBooks(function(error, result) {
        if (error || result == null || result.length != 1) {
            res.status(500).json({success: false, data: error});
        } else {
            const books = result;
            res.status(200).json(books);
        }
    });
}
 
function getAllBooks(callback_lib) {
    const query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id ORDER BY b.title";
    pool.query(query, function(error, response) {
        if (error) {
            console.log("There was an error" + error);
            callback(error, null);
        }
        callback_lib(null, response.rows);
    });
}
 

// function searchLibrary(req, response) {
//     const method = req.query.method;
//     const search = req.query.search;

//     getBooks(method, search, function(error, result) {
//               if (error || result == null || result.length != 1) {
// 			response.status(500).json({success: false, data: error});
// 		} else {
// 			const books = result;
// 			response.status(200).json(books);
// 		}
//     });
// }

// function getBooks(method, search, callback) {
//     let query = "";
//     if (search != "") {
// 	   if (method == 'lname') {
// 		query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE a.lname = $1 ORDER BY b.title";
//        } else if (method == 'title') {
// 		query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title = $1 ORDER BY b.title";	
// 	   } else if (method == 'genre') {
//        	query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id INNER JOIN genre g ON a.genre_id = g.genre_id WHERE g.genre = $1 ORDER BY b.title";
//        } else {
// 	     query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title = $1 ORDER BY b.title";
//        }
//     }
//     const params = [search];
//     console.log("The search is : " + search);
//     pool.query(query, params, function(error, response) {
//         if (error) {
//             console.log("There was an error" + error);
//             callback(error, null);
//         }
//         callback(null, response.rows);
//     });
// }