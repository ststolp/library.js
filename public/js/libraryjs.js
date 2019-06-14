function myBooks() {   
    eraseForms();
    hideTags();
    const target = `/get_myBooks`;
    let request = new XMLHttpRequest();
    request.open("GET", target);
    request.send();
    console.log("sending request...");
    let divBooks = document.getElementById('books');
    request.onreadystatechange = function(){
		if(request.readyState == 4){
			var div = document.createElement('div');
			if(request.status == 200){
                let array = JSON.parse(request.responseText);
                currentBooks(array, div);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
            divBooks.innerHTML = "";
			divBooks.appendChild(div);
		}
	}
}

// Display the users books provided in the array
function currentBooks(array, divBooks) {
   const formStart = "<h2>My Boooks</h2>";
    let books = "";
    array.forEach(function(item) {
        let entry = `<p><b>${item.book_title}</b><p>`;
        entry += `<p>Checkd Out: ${item.checked_out}</p>`;
	    entry += `<p>Due Date: ${item.due_date}`;
        books = books + entry;
    });
    const wholeForm = formStart + books;
    divBooks.innerHTML = wholeForm;
}

function eraseForms() {
    document.getElementById("addAuthor").innerHTML = "";
    document.getElementById("addBook").innerHTML = "";
}

function home() {
    document.getElementById("AddBookHeader").style.visibility = "hidden";
    document.getElementById("addGenre").style.visibility = "hidden";
    eraseForms();
    document.getElementById("LibHead").style.visibility = "visible";
    document.getElementById("searchDiv").style.visibility = "visible";
    document.getElementById("seeBookHead").style.visibility = "visible";
    document.getElementById("books").innerHTML = "";
}

function buttonSignIn() {
    document.getElementById("signButton").innerHTML = "Sign In";
}

function Register() {
    hideTags();
    document.getElementById("signButton").innerHTML = "Sign In";
    eraseForms();
    let html = "<form action='/add_user' method='post'><h2>Create New Account</h2><br><label>Username</label><input type='text' name='username' placeholder='username...' required><br><br>";
    html += "<label>Password</label><input name='password' type='password' placeholder='enter password...' required><br><br>";
    html += "<label>Confirm Password</label><input type='password' name='confirm' placeholder='confirm password...' required><br><br><label>I'm a Librarian</label><input type='checkbox' name='librarian'><br><br><input type='submit' value='Register' onclick='buttonSignIn()'></form>";
    document.getElementById("books").innerHTML = html;
}

function addUser() {
    let request = new XMLHttpRequest();
    const target = "/add_user"; 
    request.open("POST", target);
    request.send();
	   request.onreadystatechange = function(){
		if(request.readyState == 4){
			let genreP = document.createElement('p');
			if(request.status == 200){
                let array = JSON.parse(request.responseText);
                printGenres(array, genreP);
                divAuthor.insertBefore(genreP, divAuthor.childNodes[1]);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
        }
    }
}

function changeButton() {
    document.getElementById("signButton").innerHTML = "Sign Out";
}

function signIn() {
    hideTags();
    eraseForms();
    let InorOut = document.getElementById('signButton');
    let html = "";
    if (InorOut.innerHTML == "Sign In") {
        html = "<form action='/sign_in' method='get'><h2>Sign In</h2><br><label>Username</label><input type='text' name='username' placeholder='username...' required><br><br>";
        html += "<label>Password</label><input name='password' type='password' placeholder='enter password...' required><br><br><input type='submit' value='Sign In' onclick='changeButton()'></form>";
    } else {
        let request = new XMLHttpRequest();
        const target = "/sign_out"; 
        request.open("GET", target);
        request.send();
        InorOut.innerHTML = "Sign In";
        html = "<h2>Please come again!</h2>";
    }
    document.getElementById("books").innerHTML = html;
}

function printGenres(array, subdiv) {
    if (array.length > 0) {
        let choice = "";
        array.forEach(function(item) {
            choice += `<option value='${item.genre_id}'>${item.genre}</option>`;
        });
        subdiv.innerHTML = "<h3>Select Genre</h3><select>" + choice + "</select>";
    }
}

function printAuthors(array, subdiv) {
    if (array.length > 0) {
        let choice = "";
        array.forEach(function(item) {
            choice += `<option value='${item.author_id}'>${item.fname} ${item.lname}</option>`;
        });
        subdiv.innerHTML = "<h3>Select Author</h3><select>" + choice + "</select>";
    }
}


function fill(array, divBooks) {
    document.getElementById("AddBookHeader").style.visibility = "visible";
    document.getElementById("addGenre").style.visibility = "visible";
    document.getElementById("LibHead").style.visibility = "visible";
    document.getElementById("searchDiv").style.visibility = "visible";
    document.getElementById("seeBookHead").style.visibility = "visible";
    let divAuthor = document.getElementById('addAuthor');
    let divAddBook = document.getElementById('addBook');
    divAddBook.innerHTML = "";
    divAuthor.innerHTML = "";
    divBooks.innerHTML = "";
    const formStart = "<form action='/check_out' method='post'>";
    let books = "";
    array.forEach(function(item) {
        let entry = `<p><b>${item.title}</b> by ${item.fname} ${item.lname}</p>`;
        entry += `<p>Publisher: ${item.publisher}, ${item.year}.</p>`;
	    entry += "<label>Check out this book</label><br>";
	    entry += `<input type='checkbox' name='checkout[]' value='${item.book_id}'>`;
        books = books + entry;
    });
    const button = '<br><input type="submit" class="button" value="Check Out"></form>';
    const wholeForm = formStart + books + button;
    divBooks.innerHTML = wholeForm;
    let formBookStart = document.createElement('p');
    const content = "<label>Title </label><input type='text' name='title' required><br>";
    formBookStart.innerHTML = content;
    divAddBook.insertBefore(formBookStart, divAddBook.childNodes[0]);

    //get all the genres</br>
    let authorName = document.createElement('p');
    authorName.innerHTML = '<h3>Add Author</h3><label>First Name </label><input type="text" name="fname" required><br><br><label>Last Name </label><input type="text" name="lname" required>';
    divAuthor.insertBefore(authorName, divAuthor.childNodes[0]);
    let authorSubmit = document.createElement('p');
    authorSubmit.innerHTML = "<input type='submit' value='Add Author'>";
    divAuthor.insertBefore(authorSubmit, divAuthor.childNodes[2]);
//get all authors
    let requestAuthor = new XMLHttpRequest();
    const targetAuthor = "/get_authors"; 
    requestAuthor.open("GET", targetAuthor);
    requestAuthor.send();
       requestAuthor.onreadystatechange = function(){
		if(requestAuthor.readyState == 4){
			let authorP = document.createElement('p');
			if(requestAuthor.status == 200){
                console.log(requestAuthor.responseText);
                let array = JSON.parse(requestAuthor.responseText);
                printAuthors(array, authorP);
                divAddBook.insertBefore(authorP, divAddBook.childNodes[1]);
			}else{
				div.appendChild(document.createTextNodeJSON.stringify(ERROR));
            }
        }
    }

        let request = new XMLHttpRequest();
    const target = "/get_genres"; 
    request.open("GET", target);
    request.send();
    request.onreadystatechange = function(){
		console.log("on ready state function calling: " + request.readyState);
		if(request.readyState == 4){
			let genreP = document.createElement('p');
			if(request.status == 200){
                let array = JSON.parse(request.responseText);
                printGenres(array, genreP);
                divAddBook.insertBefore(genreP, divAddBook.childNodes[1]);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
        }
    }
    let more = '<label>Year </label><input type="date" name="year" required><br><br><label>Publisher </label>';
    more += '<input type="text" name="publisher" required><br><br><input type="submit" class="button" value="Add Book">';
    let bookAddButton = document.createElement('p');
    bookAddButton.innerHTML = more;
    divAddBook.insertBefore(bookAddButton, divAddBook.childNodes[3]);
}

function searchLibrary() {
    const method = document.getElementById('method').value;
    const search = document.getElementById('search').value;
    let request = new XMLHttpRequest();
    const target = "/search_library?method=" + method + "&search=" + search;
    request.open("GET", target);
    request.send();
    let divBooks = document.getElementById('books');
    request.onreadystatechange = function(){
        if(request.readyState == 4){
			let div = document.createElement('div');
			if(request.status == 200){
                const array = JSON.parse(request.responseText);
                if (array.length == 0) {
                    div.innerHTML = "<h3>No Results</h3>";
                } else {
                    fill(array, div);
                }
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
            divBooks.innerHTML = "";
			divBooks.appendChild(div);
		}
	}
}

function getLibrary() {
    target = "/get_Library";
    let request = new XMLHttpRequest();
    request.open("GET", target);
    request.send();
    console.log("sending request...");
    let divBooks = document.getElementById('books');
    request.onreadystatechange = function(){
		console.log("on ready state function calling: " + request.readyState);
		if(request.readyState == 4){
			var div = document.createElement('div');
			if(request.status == 200){
                let array = JSON.parse(request.responseText);
                fill(array, div);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
            divBooks.innerHTML = "";
			divBooks.appendChild(div);
		}
	}
}

function hideTags() {
    document.getElementById("AddBookHeader").style.visibility = "hidden";
    document.getElementById("addGenre").style.visibility = "hidden";
    document.getElementById("LibHead").style.visibility = "hidden";
    document.getElementById("searchDiv").style.visibility = "hidden";
    document.getElementById("seeBookHead").style.visibility = "hidden";
}

function getParams() {
    let signButton = document.getElementById("signButton");
    const url = location.search.substring(1);
    if (!url) {
        if (signButton.innerHTML != "Sign Out") {
            signButton.innerHTML = "Sign In";
        }
        home();
        return;
    } else {
        signButton.innerHTML = "Sign Out";
    }
    let SignVariables = url.split('&');
    let SignVarArray = SignVariables[0].split('=');
    if (SignVarArray[0] == 'register') {
        hideTags();
        let welcome = document.getElementById('books');
        alert(typeof SignVarArray[0]);
        if (SignVarArray[0].value == true)
            welcome.innerHTML = "<h2>You have successfully registered. Feel free to sign in.</h2>";
        else
            welcome.innerHTML = "<h2>Your passwords did not match</h2>";
    } else if (SignVarArray[0] == 'false') {
        // wrong password or username
        hideTags();
        signButton.innerHTML = "Sign In";
        document.getElementById('books').innerHTML = "<h3>Incorrect username or password</h3>";
    // Display Check Out receipt    
    } else if (SignVarArray[0] == 'checkOut') {
        hideTags();
        let variables = url.split('&');
        let items = variables.length - 1;
        let itemsP = document.createElement('p');
        itemsP.innerHTML = `<h2>TOTAL: ${items}</h2>`;
        let Head = document.createElement('p');
        Head.innerHTML = "<h1>Checkout Receipt</h1>"
        let divBooks = document.getElementById('books');
        divBooks.appendChild(Head);
        divBooks.appendChild(itemsP);
        for (let i = 1; i < variables.length; i++) {
            nextReq = false;
            let book_id = variables[i].split('=');
            target = `/get_checked?book=${book_id[1]}`;
            let request = new XMLHttpRequest();
            request.open("GET", target);
            request.send(); 
            request.onreadystatechange = function() {
                if(request.readyState == 4){
                    var p = document.createElement('p');
                    if(request.status == 200){
                        let array = JSON.parse(request.responseText);
                        let books = "";
                        let entry = `<p><b>${array[0].book_title}</b> loaned on ${array[0].checked_out}</p>`;
                        entry += `<p>Due date ${array[0].due_date}</p>`;
                        books = books + entry;
                        p.innerHTML = books;
                        divBooks.appendChild(p);
                    }
                }   
            }
        }
    }
}
