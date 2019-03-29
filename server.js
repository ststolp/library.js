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
app.get("/get_checked", getChecked);
app.get("/get_myBooks", getMyBooks);

app.post("/add_author", addAuthor);
app.post("/add_book", addBook);
app.post("/add_genre", addGenre);
app.post("/check_out", checkOut);

app.listen(app.get('port'), function(){
	console.log("It's working");
});
/*************************************** */

function redirectUser(req, res) {
    //req.headers['if-none-match'] = 'no-match-for-this';
    res.status(200).redirect('home_library.html');
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 17; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function checkOut(req, response) {
    let array = req.body.checkout;
    let query = "";
    let url = "checkOut=true";
    count = 0;
    for (let index = 0; index < array.length; index++) {
        // console.log("value : " + array[index+1] == array.length)
        // if (array[index + 1] === array.length) {  
        //     return response.status(200).redirect(`home_library.html?${url}`);
        // } else {
            query = `INSERT INTO patron_book (patron_id, book_title, book_id, due_date, checked_out) VALUES (1, (SELECT title FROM books WHERE book_id = $1), $2, CURRENT_DATE + interval '30' day, CURRENT_DATE)`;
            let params = [array[index], array[index]];
            pool.query(query, params, function(error, res) {
                if (error) {
                    console.log(`There was an error: ${error}`);
                    response.redirect(`home_library.html?${url}`);
                } else {
                    console.log(res);
                    count++;
                    console.log("Item: " + array[index]);
                    url += "&array[]=" + array[index];
                    console.log("Index: " + index + " arrayLength: " + array.length);
                         console.log("value : " + array[index+1] == array.length)
                    if (count == array.length) {  
                        return response.status(200).redirect(`home_library.html?${url}`);
                    }
                }
            });
        }
    };
}

function getChecked(req, res) {
    let book = req.query.book;
    queryChecked(book, function(error, result) {
        if (error || result == null) {
            res.status(500).json({success: false, data: error});
        } else {
            const books = result;
            res.status(200).json(books);
        }
    });
}

function queryChecked(book, callback) {
    queryInserted = `SELECT patron_id, book_title, due_date, checked_out FROM patron_book WHERE book_id = $1`;
    let params = [book];
    pool.query(queryInserted, params, function(error, res) {
    if (error) {
        console.log("There was an error" + error);
            callback(error, null);
        } else {
            callback(null, res.rows);
        }
    });
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
		query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE a.lname = $1 ORDER BY b.title";
       } else if (method == 'title') {
		query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title = $1 ORDER BY b.title";	
	   } else if (method == 'genre') {
       	query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id INNER JOIN genre g ON a.genre_id = g.genre_id WHERE g.genre = $1 ORDER BY b.title";
       } else {
	     query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title = $1 ORDER BY b.title";
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
            console.log(result);
            res.redirect("home_library.html");
        }
    });
}

function addBook(req, res) {
    let title = req.body.title;
    let author_id = req.body.author_id;
    let year = req.body.year;
    let publisher = req.body.publisher;
        postBook(title, author_id, year, publisher, function(error, result) {
        if (error || result == null) {
            console.log("failed to post book: " + error);
        } else {
            console.log("book posted!");
            console.log(result);
            res.redirect("home_library.html");
        }
    });
}

function addAuthor(req, res) {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let genre_id = req.body.genre_id;
        postAuthor(fname, lname, genre_id, function(error, result) {
        if (error || result == null) {
            console.log("failed to post author: " + error);
        } else {
            console.log("author posted!");
            console.log(result);
            res.redirect("home_library.html");
        }
    });
}

function postGenre(genre, callback) {
    let query = "INSERT INTO genre (genre) VALUES ( $1 )";
    params = [genre];
      pool.query(query, params, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
        } else {
            callback(null, response.rows);
        }
   });
}

function postBook(title, author_id, year, publisher, callback) {
    let query = "INSERT INTO books (title, author_id, year, publisher) VALUES ( $1, $2, $3, $4)";
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
    console.log("The value of genre_id is: " + genre_id);
    let query = "INSERT INTO author (genre_id, fname, lname) VALUES ( $1, $2, $3 )";
    let params = [genre_id, fname, lname];
      pool.query(query, params, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
   });
}

function getMyBooks(req, res) {
    let user_id = req.query.user_id;
    queryMyBooks(user_id, function(error, result) {
       if (error || result == null) {
           console.log("failed to get books " + error);
       } else {
           console.log(result);
           res.status(200).json(result);
       }
    });
}

function queryMyBooks(user_id, callback) {
    let query = "SELECT book_title, due_date, checked_out FROM patron_book WHERE patron_id = $1";
    let param = [user_id];
    pool.query(query, param, function(error, response) {
         if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
    });
}