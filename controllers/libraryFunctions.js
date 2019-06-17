const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = Pool({connectionString: connectionString});
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function redirectUser(req, res) {
    req.headers['if-none-match'] = 'no-match-for-this';
    res.status(200).redirect('home_library.html');
};

function requireLogin(req, res, next) {
  if (req.session.user) {
      console.log(req.session.user);
      next();
  } else {
    console.log(`user: ${req.session.user}`);
    res.status(200).json({SignIn: false});
  }
};

//  checkOut puts books onto the users account
function checkOut(req, response) {
    const array = req.body.checkout;
    let query = "";
    let url =  `checkOut=true`;
    let count = 0;
    for (let index = 0; index < array.length; index++) {
        query = `INSERT INTO patron_book (patron_id, book_title, book_id, due_date, checked_out) VALUES ($3, (SELECT title FROM books WHERE book_id = $1), $2, (SELECT CURRENT_DATE + interval '30' day), (SELECT CURRENT_DATE))`;
        const params = [array[index], array[index], req.session.user];
        pool.query(query, params, function(error, res) {
            if (error) {
                console.log(`There was an error: ${error}`);
                response.redirect(`home_library.html?${url}`);
            } else {
                console.log(res);
                count++;
                console.log(`Item: ${array[index]}`);
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

/*  getChecked is called to retrieve a book that the client checked out 
    to form the receipt.  */
function getChecked(req, res) {
    const user = req.session.user;
    const book = req.query.book;
    queryChecked(book, user, function(error, result) {
        if (error || result == null) {
            res.status(500).json({success: false, data: error});
        } else {
            const books = result;
            res.status(200).json(books);
        }
    });
}

function queryChecked(book, user, callback) {
    const queryInserted = `SELECT patron_id, book_title, due_date, checked_out FROM patron_book WHERE book_id = $1 AND patron_id = $2`;
    const params = [book, user];
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
		query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE LOWER(a.lname) LIKE $1 ORDER BY b.title";
       } else if (method == 'title') {
		query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE LOWER(b.title) LIKE $1 ORDER BY b.title";	
	   } else if (method == 'genre') {
       	query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id INNER JOIN genre g ON b.genre_id = g.genre_id WHERE LOWER(g.genre) LIKE $1 ORDER BY b.title";
       } else {
	     query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b INNER JOIN author a ON b.author_id = a.author_id WHERE LOWER(b.title) LIKE $1 ORDER BY b.title";
       }
    }
    const params = [search.toLowerCase()];
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
    const query = "SELECT author_id, fname, lname FROM author ORDER BY lname";
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
   const query = "SELECT genre_id, genre FROM genre ORDER BY genre";
   pool.query(query, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
   });
}

function requiresLibrarian(req, res, next) {
    let librarian = req.session.librarian;
    if (librarian != NULL && librarian) {
        next();
    } else {
        res.redirect(301);
    }
}

function addGenre(req, res) {
    if(req.session.user) {
        const genre = req.body.genre;
         postGenre(genre, function(error, result) {
            if (error || result == null) {
                console.log("failed to post genre: " + error);
            } else {
                console.log("genre posted!");
                console.log(result);
                res.redirect("home_library.html?login=true");
            }
        });
    } else { 
        res.redirect("home_library.html");
    }
}

function addBook(req, res) {
    if(req.session.user) {
        const title = req.body.title;
        const author_id = req.body.author_id;
        const year = req.body.year;
        const publisher = req.body.publisher;
        const genre_id = req.body.genre_id;
            postBook(title, author_id, year, publisher, genre_id, function(error, result) {
            if (error || result == null) {
                console.log("failed to post book: " + error);
            } else {
                console.log("book posted!");
                console.log(result);
                res.redirect("home_library.html?login=true");
            }
        });
    } else {
        res.redirect("home_library.html");
    }
}

function addAuthor(req, res) {
    if(req.session.user) {
        const fname = req.body.fname;
        const lname = req.body.lname;
            postAuthor(fname, lname, function(error, result) {
            if (error || result == null) {
                console.log("failed to post author: " + error);
            } else {
                console.log("author posted!");
                console.log(result);
                res.redirect("home_library.html?login=true");
            }
        });
    } else {
        res.redirect("home_library.html");
    }
}

function postGenre(genre, callback) {
    const query = "INSERT INTO genre (genre) VALUES ( $1 )";
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

function postBook(title, author_id, year, publisher, genre_id, callback) {
    const query = "INSERT INTO books (title, author_id, year, publisher, genre_id) VALUES ( $1, $2, $3, $4, $5)";
    const params = [title, author_id, year, publisher, genre_id];
      pool.query(query, params, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
   });
}

function postAuthor(fname, lname, callback) {
    const query = "INSERT INTO author (fname, lname) VALUES ( $1, $2)";
    const params = [fname, lname];
      pool.query(query, params, function(error, response) {
       if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
   });
}

// getMyBooks retrieves all of the books currently on the user's account
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
    const query = "SELECT book_title, due_date, checked_out FROM patron_book WHERE patron_id = $1";
    const param = [user_id];
    pool.query(query, param, function(error, response) {
         if(error) {
           console.log("There was an error: " + error);
           callback(error, null);
       } else {
           callback(null, response.rows);
       }
    });
}

function validatePassword(req, res, next) {
    const password = req.body.password;
    const confirm = req.body.confirm;
    if (password == confirm) {
        next();
    } else {
        res.status(200).redirect(`home_library.html?register=false`);
    }
}

function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const isLibrarian = Boolean(req.body.librarian);
    console.log("Password: " + password);
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            console.log(err);
        } else {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                }
            postUser(username, hash, isLibrarian, function(error, result) {
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
                        req.session.isLibrarian = res[0].librarian;
                        console.log(`user: ${req.session.user} librarian: ${req.session.isLibrarian}`);
                       }
                       req.session.save(function(err) {
                           if(err) {
                               console.log(err);
                           }
                       });
                       const lib = toString(req.session.isLibrarian);
                  res.status(200).redirect(`home_library.html?login=true&librarian=${lib}`);
                  })
               } else {
                    res.status(500).redirect(`home_library.html?login=false`);
               }
           });
       }
    });
}

function getId(username, callback) {
    const query = "SELECT patron_id, librarian FROM patron WHERE username = $1";
    const param = [username];
    pool.query(query, param, function(error, response) {
        if(error) {
            console.log(`There was an error: ${error}`);
            callback(error, null);
         } else {
             console.log(`From getId: ${response.rows}`);
            callback(null, response.rows);
        }
    });
}
function getHashed(username, callback) {
    const query = "SELECT password FROM patron WHERE username = $1";
    const param = [username];
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

function postUser(username, password, isLibrarian, callback) {
    const query = "INSERT INTO patron(username, password, librarian) VALUES ($1, $2, $3) RETURNING patron_id";
    const param = [username, password, isLibrarian];
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

module.exports = {
    signOut: signOut,
    redirectUser: redirectUser, 
    requireLogin: requireLogin,
    checkOut: checkOut,
    getChecked: getChecked,
    getAuthors: getAuthors,
    getMyBooks: getMyBooks,
    getGenres: getGenres,
    signIn: signIn,
    getLibrary: getLibrary,
    searchLibrary: searchLibrary,
    register: register,
    addAuthor: addAuthor,
    addBook: addBook,
    addGenre: addGenre,
    validatePassword: validatePassword,
    requiresLibrarian: requiresLibrarian
 };