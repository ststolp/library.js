const http = require('http');
const express = require('express');
//const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const session = require('express-session');
//var FileStore = require('session-file-store')(session);
const controller = require("./controllers/libraryFunctions.js");
app.set('port', (process.env.PORT || 5000));
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = Pool({connectionString: connectionString});

app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave: false,
}))


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", redirectUser);
app.get("/get_library", getLibrary);
app.get("/search_library", searchLibrary);
app.get("/get_genres", getGenres);
app.get("/get_authors", getAuthors);
app.get("/get_checked", getChecked);
app.get("/get_myBooks", requireLogin, getMyBooks);
app.get('/sign_in', signIn);
app.get('/sign_out', signOut);

app.post("/add_author", addAuthor);
app.post("/add_book", addBook);
app.post("/add_genre", addGenre);
app.post("/check_out", requireLogin, checkOut);
app.post("/add_user", register);

app.listen(app.get('port'), function(){
	console.log("It's working");
});
/*************************************** */

function redirectUser(req, res) {
    req.headers['if-none-match'] = 'no-match-for-this';
    res.status(200).redirect('home_library.html');
};

function requireLogin(req, res, next) {
  if (req.session.user) {
      console.log(req.session.user);
      next();
  } else {
    console.log("user: " + req.session.user);
    res.redirect('home_library.html?login=false');
  }
};

function checkOut(req, response) {
    let array = req.body.checkout;
    let query = "";
    let url =  `checkOut=true`;
    count = 0;
    for (let index = 0; index < array.length; index++) {
        // console.log("value : " + array[index+1] == array.length)
        // if (array[index + 1] === array.length) {  
        //     return response.status(200).redirect(`home_library.html?${url}`);
        // } else {
        query = `INSERT INTO patron_book (patron_id, book_title, book_id, due_date, checked_out) VALUES ($3, (SELECT title FROM books WHERE book_id = $1), $2, SELECT CURRENT_DATE + interval '30' day, SELECT CURRENT_DATE)`;
        let params = [array[index], array[index], req.session.user];
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
    const search = "%" + req.query.search + "%";
    
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
		query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE a.lname LIKE $1 ORDER BY b.title";
       } else if (method == 'title') {
		query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title LIKE $1 ORDER BY b.title";	
	   } else if (method == 'genre') {
       	query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id INNER JOIN genre g ON a.genre_id = g.genre_id WHERE g.genre LIKE $1 ORDER BY b.title";
       } else {
	     query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE b.title LIKE $1 ORDER BY b.title";
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
    queryMyBooks(req.session.user, function(error, result) {
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

function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log("Password: " + password);
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            console.log(err);
        } else {
            bcrypt.hash(password, salt, function(err, hash) {
              // Store hash in your password DB.
                if (err) {
                    console.log(err);
                }
                postUser(username, hash, function(error, result) {
                    if (error || result == null) {  
                        console.log("failed to get books " + error);
                    } else {
                        console.log(result);
                    res.status(200).redirect(`home_library.html?register=true`);
                    }      
                });
            });
        }
    });
}

function signIn(req, res) {
    const username = req.query.username;
    const password = req.query.password;
    console.log("Username: " + username);
    getHashed(username, function(error, hash) {
            if (error || hash == null || typeof hash[0] === undefined) {
           console.log("failed to get user " + error);
           console.log("hash: " + hash.passord);
           console.log("patron: " + hash.patron_id);
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.write("<h3>Invalid username or password</h3>");
       } else {
           console.log("typeof(hash): " + typeof(hash));
           bcrypt.compare(password, hash[0].password, function(err, response) {
               if (err) {
                   console.log(err);
                   res.status(500).redirect(`home_library.html?login=false`);
               } else if (response) {
                   getId(username, function(error, res) {
                       if (error) {
                           console.log(error);
                       } else {
                        req.session.user = res[0].patron_id;
                        console.log("user: " + req.session.user);

                       }
                       req.session.save(function(err) {
                           if(err) {
                               console.log(err);
                           }
                       });
                   });
                  res.status(200).redirect(`home_library.html?login=true`);
               } else {
                    res.status(500).redirect(`home_library.html?login=false`);
               }
           });
       }
    });
}

function getId(username, callback) {
    let query = "SELECT patron_id FROM patron WHERE username = $1";
    let param = [username];
    pool.query(query, param, function(error, response) {
        if(error) {
            console.log("There was an error: " + error);
            callback(error, null);
         } else {
             console.log("From getId: " + response.rows);
            callback(null, response.rows);
        }
    });
}
function getHashed(username, callback) {
    let query = "SELECT password FROM patron WHERE username = $1";
    let param = [username];
    pool.query(query, param, function(error, response) {
        if(error) {
            console.log("There was an error: " + error);
            callback(error, null);
         } else {
             console.log("From getHashed: " + response.rows);
            callback(null, response.rows);
        }
    });
}

function postUser(username, password, callback) {
    let query = "INSERT INTO patron(username, password) VALUES ($1, $2) RETURNING patron_id";
    let param = [username, password];
    pool.query(query, param, function(error, response) {
        if(error) {
            console.log("There was an error: " + error);
            callback(error, null);
         } else {
            callback(null, response.rows);
        }
    });
}

function signOut(req, res) {
    req.session.destroy();
    res.redirect('home_library.html');
}