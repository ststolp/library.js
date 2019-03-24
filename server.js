const express = require('express');
//const bodyParser = require('body-parser');
const app = express();


const controller = require("./controllers/libraryFunctions.js");
app.set('port', (process.env.PORT || 5000));
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
console.log("The url is: " + connectionString);
const pool = Pool({connectionString: connectionString});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", redirectUser);
app.get("/get_library", getLibrary);
app.get("/search_library", searchLibrary);
app.get("/get_genres", getGenres);
app.get("/get_authors", getAuthors);

app.post("/add_author", addAuthor);
app.post("/add_book", addBook);
app.post("/add_genre", addGenre);
app.post("/check_out", checkOut);

app.listen(app.get('port'), function(){
	console.log("It's working");
});
/*************************************** */

function redirectUser(req, res) {
    return res.redirect('home_library.html');
};

function checkOut(req, response) {
    let array = req.body.checkout;

    let query = "";
    let list;
    let result;
    array.forEach(function(item) {
       query = `INSERT INTO patron_book (patron_id, book_id) VALUES (1, $1)`;
        let params = [item];
        pool.query(query, params, function(error, res) {
            if (error) {
                console.log(`There was an error: ${error}`);
                res.status(500).json({success: false,});
            } else {
                console.log(res);
                list += res;
                queryInserted = `SELECT book_id FROM patron_book WHERE book_id = $1`;
                let param = [item];
                pool.query(queryInserted, param, function(error, res) {
                    if (error) {
                        console.log(`There was an error ${error}`);
                    } else {
                        result += res;
                    }
                });
            }
        });
    });
    response.status(200).json(result);
}

function getLibrary(req, res) {
    getAllBooks(function(error, result) {
        if (error || result == null) {
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
 

function searchLibrary(req, response) {
    const method = req.query.method;
    const search = req.query.search;

    getBooks(method, search, function(error, result) {
              if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			const books = result;
			response.status(200).json(books);
		}
    });
}

function getBooks(method, search, callback) {
    let query = "";
    if (search != "") {
	   if (method == 'lname') {
		query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE a.lname = $1 ORDER BY b.title";
       } else if (method == 'title') {
		query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title = $1 ORDER BY b.title";	
	   } else if (method == 'genre') {
       	query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id INNER JOIN genre g ON a.genre_id = g.genre_id WHERE g.genre = $1 ORDER BY b.title";
       } else {
	     query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title = $1 ORDER BY b.title";
       }
    }
    const params = [search];
    console.log("The search is : " + search);
    pool.query(query, params, function(error, response) {
        if (error) {
            console.log("There was an error: " + error);
            callback(error, null);
        }
        callback(null, response.rows);
    });
}



function getAuthors(req, res) {
    queryAuthors(function(error, result) {
        if (error || result == null) {
            res.status(500).json({success: false, data: error});
        } else {
            const authors = result;
            res.status(200).json(authors);
        }
    });
}

function queryAuthors(callback) {
    let query = "SELECT author_id, fname, lname FROM author";
      pool.query(query, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
   });
}

function getGenres(req, res) {
    queryGenres(function(error, result) {
        if (error || result == null) {
            res.status(500).json({success: false, data: error});
        } else {
            const books = result;
            res.status(200).json(books);
        }
    });
}

function queryGenres(callback) {
   let query = "SELECT genre_id, genre FROM genre";
   pool.query(query, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
   });
}

function addGenre(req, res) {
    let genre = req.body.genre;
     postGenre(genre, function(error, result) {
        if (error || result == null) {
            console.log("failed to post genre: " + error);
        } else {
            console.log("genre posted!");
            res.status(200).json(result);
        }
    });
}

function addBook(req, res) {
    let title = req.body.title;
    let new_genre = req.body.new_genre;
    let genre = req.body.genre;

    let author_id = req.body.author_id;
    let year = req.body.year;
    let publisher = req.body.publisher;
        postBook(title, author_id, year, publisher, function(error, result) {
        if (error || result == null) {
            console.log("failed to post book: " + error);
        } else {
            console.log("book posted!");
            res.status(200).json(result);
        }
    });
}

function addAuthor(req, res) {
    let fname = req.query.fname;
    let lname = req.query.lname;
    let genre_id = req.query.genre_id;
        postAuthor(fname, lname, genre_id, function(error, result) {
        if (error || result == null) {
            console.log("failed to post author: " + error);
        } else {
            console.log("author posted!");
            res.status(200).json(result);
        }
    });
}

function postGenre(genre, callback) {
    let query = "INSERT INTO genre (genre) VALES ( $1 )";
    params = [genre];
      pool.query(query, params, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           let queryId = "SELECT genre_id FROM genre WHERE genre = $1";
           pool.query(queryId, params, function(err, res) {
               if (error) {
                   console.log("There was an error: " + error);
                   error = err;
               } else {
                   response = res;
               }
           });
           if (error) {
               console.log("There was an error: " + error);
               callback(error, null);
           } else {
            callback(null, response.rows);
           }
        }
   });
}

function postBook(title, author_id, year, publisher, callback) {
    let query = "INSERT books (title, author_id, due_date, year, publisher) VALUES ( $1, $2, (SELECT CURRENT_DATE), $3, $4)";
    let params = [title, author_id, year, publisher];
      pool.query(query, params, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
   });
}

function postAuthor(fname, lname, genre_id, callback) {
    let query = "INSERT INTO author (genre_id, fname, lname) VALUES ( $1, $2, $3 )";
    let params = [genre_id, fname, lname];
      pool.query(query, params, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           let queryId = "SELECT author_id FROM author WHERE fname = $1 AND lname = $1";
           let paramsId = [fname, lname];
             pool.query(queryId, paramsId, function(err, res) {
                 if (err) {
                     console.log("There was an error: " + error);
                     error = err;
                 } else {
                   response = res;
                 }
             });
             if (error) {
                 console.log("There was an error: " + error);
             } else {
           callback(null, response.rows);
             }
       }
   });
}