
function myBooks() {   
    document.getElementById("addBook").innerHTML = "";
    document.getElementById("addAuthor").innerHTML = "";
       document.getElementById("AddBookHeader").style.visibility = "hidden";
     document.getElementById("addGenre").style.visibility = "hidden";
        document.getElementById("LibHead").style.visibility = "hidden";
     document.getElementById("searchDiv").style.visibility = "hidden";
        document.getElementById("seeBookHead").style.visibility = "hidden";
    let target = `/get_myBooks`;
    console.log("got target");
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
                currentBooks(array, div);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
            divBooks.innerHTML = "";
			divBooks.appendChild(div);
		}
	}
}

function currentBooks(array, divBooks) {
   let formStart = "<h2>Your Boooks</h2>";
    let books = "";
    array.forEach(function(item) {
        let entry = `<p><b>${item.book_title}</b><p>`;
        entry += `<p>Checkd Out: ${item.checked_out}</p>`;
	    entry += `<p>Due Date: ${item.due_date}`;
        books = books + entry;
    });
    let wholeForm = formStart + books;
    divBooks.innerHTML = wholeForm;
}

function home() {
         document.getElementById("AddBookHeader").style.visibility = "hidden";
     document.getElementById("addGenre").style.visibility = "hidden";
     document.getElementById("addAuthor").innerHTML = "";
      document.getElementById("addBook").innerHTML = "";
      document.getElementById("LibHead").style.visibility = "visible";
     document.getElementById("searchDiv").style.visibility = "visible";
        document.getElementById("seeBookHead").style.visibility = "visible";
        document.getElementById("books").innerHTML = "";

}
function Register() {
     document.getElementById("AddBookHeader").style.visibility = "hidden";
     document.getElementById("addGenre").style.visibility = "hidden";
     document.getElementById("addAuthor").innerHTML = "";
      document.getElementById("addBook").innerHTML = "";
      document.getElementById("LibHead").style.visibility = "hidden";
     document.getElementById("searchDiv").style.visibility = "hidden";
        document.getElementById("seeBookHead").style.visibility = "hidden";
        let html = "<form action='/add_user' method='post'><h2>Sign Up</h2><br><label>Username</label><input type='text' name='username' placeholder='username...'>";
        html += "<label>Password</label><input name='password' type='password' placeholder='enter password...'><input type='submit' value='Register'></form>";
        document.getElementById("books").innerHTML = html;
}

function addUser() {
    let request = new XMLHttpRequest();
    let target = "/add_user"; 
    request.open("POST", target);
    request.send();
	   request.onreadystatechange = function(){
		console.log("on ready state function calling: " + request.readyState);
		if(request.readyState == 4){
			let genreP = document.createElement('p');
			if(request.status == 200){
                console.log(request.responseText);
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
            document.getElementById("AddBookHeader").style.visibility = "hidden";
     document.getElementById("addGenre").style.visibility = "hidden";
     document.getElementById("addAuthor").innerHTML = "";
      document.getElementById("addBook").innerHTML = "";
      document.getElementById("LibHead").style.visibility = "hidden";
     document.getElementById("searchDiv").style.visibility = "hidden";
        document.getElementById("seeBookHead").style.visibility = "hidden";
       let InorOut = document.getElementById('signButton');
       let html = "";
       if (InorOut.innerHTML == "Sign In") {
        html = "<form action='/sign_in' method='get'><h2>Sign In</h2><br><label>Username</label><input type='text' name='username' placeholder='username...'>";
        html += "<label>Password</label><input name='password' type='password' placeholder='enter password...'><input type='submit' value='Sign In' onclick='changeButton()'></form>";

        } else {
            let request = new XMLHttpRequest();
            let target = "/sign_out"; 
            request.open("GET", target);
            request.send();
	        request.onreadystatechange = function(){
		        console.log("on ready state function calling: " + request.readyState);
		        if(request.readyState == 4){
			         if(request.status == 200){
                    }  
                }
            }
          InorOut.innerHTML = "Sign In";
          html = "<h2>Please come again!</h2>";
        }
    document.getElementById("books").innerHTML = html;
}

function printGenres(array, subdiv) {
    if (array.length > 0) {
        let choice = "<h3>Select Genre</h3>";
        array.forEach(function(item) {
            let emt = document.createElement('p');
            choice += `<label>${item.genre}</label>`;
            choice += `<input type='radio' name='genre_id' value='${item.genre_id}'><br>`;
            emt.innerHTML = choice;
        });
        let textN = document.createTextNode(choice);
        subdiv.innerHTML = choice;
    }
}

function printAuthors(array, subdiv) {
    if (array.length > 0) {
        let choice = "<h3>Select Author</h3>";
        array.forEach(function(item) {
            let emt = document.createElement('p');
            choice += `<label>${item.fname} ${item.lname}</label>`;
            choice += `<input type='radio' name="author_id" value='${item.author_id}'><br>`;
            emt.innerHTML = choice;
        });
        let textN = document.createTextNode(choice);
        subdiv.innerHTML = choice;
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
    let formStart = "<form action='/check_out' method='post'>";
    let books = "";
    array.forEach(function(item) {
        let entry = `<p><b>${item.title}</b> by ${item.fname} ${item.lname}</p>`;
        entry += `<p>Publisher: ${item.publisher}, ${item.year}.</p>`;
	    entry += "<label>Check out this book</label><br>";
	    entry += `<input type='checkbox' name='checkout[]' value='${item.book_id}'>`;
        books = books + entry;
    });
    let button = '<br><input type="submit" class="button" value="Check Out"></form>';
    let wholeForm = formStart + books + button;
    divBooks.innerHTML = wholeForm;


   let formBookStart = document.createElement('p');
    content = "<label>Title</label><input type='text' name='title'><br>";
    formBookStart.innerHTML = content;
    divAddBook.insertBefore(formBookStart, divAddBook.childNodes[0]);
//get all the genres</br>

    let authorName = document.createElement('p');
    authorName.innerHTML = '<h3>Add Author</h3><label>First Name </label><br><input type="text" name="fname"><label>Last Name </label><br><input type="text" name="lname">';
    divAuthor.insertBefore(authorName, divAuthor.childNodes[0]);
    let authorSubmit = document.createElement('p');
    authorSubmit.innerHTML = "<input type='submit' value='Add Author'>";
    divAuthor.insertBefore(authorSubmit, divAuthor.childNodes[2]);
    let request = new XMLHttpRequest();
    let target = "/get_genres"; 
    request.open("GET", target);
    request.send();
	   request.onreadystatechange = function(){
		console.log("on ready state function calling: " + request.readyState);
		if(request.readyState == 4){
			let genreP = document.createElement('p');
			if(request.status == 200){
                console.log(request.responseText);
                let array = JSON.parse(request.responseText);
                printGenres(array, genreP);
                divAuthor.insertBefore(genreP, divAuthor.childNodes[1]);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
        }
    }
//get all authors
 let requestAuthor = new XMLHttpRequest();
    let targetAuthor = "/get_authors"; 
    requestAuthor.open("GET", targetAuthor);
    requestAuthor.send();
       requestAuthor.onreadystatechange = function(){
		console.log("on ready state function calling: " + requestAuthor.readyState);
		if(requestAuthor.readyState == 4){
			var authorP = document.createElement('p');
			if(requestAuthor.status == 200){
                console.log(requestAuthor.responseText);
                let array = JSON.parse(requestAuthor.responseText);
                printAuthors(array, authorP);
              //  console.log(subdiv.innerHTML);
                divAddBook.insertBefore(authorP, divAddBook.childNodes[1]);
			}else{
				div.appendChild(document.createTextNodeJSON.stringify(ERROR));
            }
        }
     
    }
	let more = '<label>year</label><input type="date" name="year"><br><label>Publisher</label>';
    more += '<input type="text" name="publisher"><br><input type="submit" class="button" value="Add Book">';
    let bookAddButton = document.createElement('p');
    bookAddButton.innerHTML = more;
    divAddBook.insertBefore(bookAddButton, divAddBook.childNodes[3]);
}

function searchLibrary() {
    let method = document.getElementById('method').value;
    let search = document.getElementById('search').value;
    console.log("method: " + method + "search : " + search);
    let request = new XMLHttpRequest();
    let target = "/search_library?method=" + method + "&search=" + search;
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

function getLibrary() {
    console.log("getting stuff");
    target = "/get_Library";
    console.log("got target");
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

function getParams() {
    let url = location.search.substring(1);
    if (!url) {
        if (document.getElementById("signButton").innerHTML != "Sign Out") {
            document.getElementById("signButton").innerHTML = "Sign In";
        }
        home();
       return;
    } else {
        document.getElementById("signButton").innerHTML = "Sign Out";
    }
   let SignVariables = url.split('&');
    let SignVarArray = SignVariables[0].split('=');
    if (SignVarArray[0] == "patron_id") {

        USER_ID = SignVarArray[1];
    } else if (SignVarArray[0] == 'login') {
        // if (SignVarArray[1] == false) {
        //     alert("The login is false" + SignVarArray[1]);
        //     document.getElementById("signButton").innerHTML = "Sign In";
        //     document.getElementById("AddBookHeader").style.visibility = "hidden";
        //     document.getElementById("addGenre").style.visibility = "hidden";
        //     document.getElementById("LibHead").style.visibility = "hidden";
        //     document.getElementById("searchDiv").style.visibility = "hidden";
        //     document.getElementById("seeBookHead").style.visibility = "hidden";
        //      let divBooks = document.getElementById('books');
        //     divBooks.innerHTML = "<h2>Please Login</h2>";
        // } else if (SignVarArray[1] == true) {
        //     alert("The login is true:" + SignVarArray[1]);
        //     document.getElementById('signButton').innerHTML = "Sign Out";
        //     document.getElementById("AddBookHeader").style.visibility = "hidden";
        //     document.getElementById("addGenre").style.visibility = "hidden";
        //     document.getElementById("LibHead").style.visibility = "visible";
        //     document.getElementById("searchDiv").style.visibility = "visible";
        //     document.getElementById("seeBookHead").style.visibility = "visible";
        //      document.getElementById('books').innerHTML = "";
        // }
    } else if (SignVarArray[0] == 'register') {
           document.getElementById("AddBookHeader").style.visibility = "hidden";
     document.getElementById("addGenre").style.visibility = "hidden";
        document.getElementById("LibHead").style.visibility = "hidden";
     document.getElementById("searchDiv").style.visibility = "hidden";
        document.getElementById("seeBookHead").style.visibility = "hidden";
        let welcome = document.getElementById('books');
        welcome.innerHTML = "<h2>You have successfully registered. Feel free to sign in.</h2>";
    } else {
     document.getElementById("AddBookHeader").style.visibility = "hidden";
     document.getElementById("addGenre").style.visibility = "hidden";
        document.getElementById("LibHead").style.visibility = "hidden";
     document.getElementById("searchDiv").style.visibility = "hidden";
        document.getElementById("seeBookHead").style.visibility = "hidden";
        console.log("The url: " + url);
        let variables = url.split('&');
        console.log("The variables: " + variables);
        console.log("The var: " + variables[0]);
        let itemArray = variables[1].split('=');
        let items = variables.length - 1;
        let itemsP = document.createElement('p');
        itemsP.innerHTML = `<h2>TOTAL: ${items}</h2>`;
        let Head = document.createElement('p');
        Head.innerHTML = "<h1>Checkout Receipt</h1>"
        let divBooks = document.getElementById('books');
        divBooks.appendChild(Head);
        divBooks.appendChild(itemsP);
       // let nextReq = true;
        for (let i = 1; i < variables.length;i++ ) {
            //request each book individually.
          //  console.log(`I: ${i}, nextReq: ${nextReq}`)
            // if(nextReq)
            // { 
                nextReq = false;
                let book_id = variables[i].split('=');
                console.log("The id: " + book_id[1]);
                target = `/get_checked?book=${book_id[1]}`;
                let request = new XMLHttpRequest();
                request.open("GET", target);
                request.send(); 
                console.log("sending request...");
                request.onreadystatechange = function() {
                    console.log("on ready state function calling: " + request.readyState);
                    if(request.readyState == 4){
                        var p = document.createElement('p');
                        if(request.status == 200){
                            // nextReq = true;
                            // i++;
                            console.log(`incrementing i: ${i}`);
                            let array = JSON.parse(request.responseText);
                            let books = "";
                            array.forEach(function(item) {
                                let entry = `<p><b>${item.book_title}</b> loaned on ${item.checked_out}</p>`;
                                entry += `<p>Due date ${item.due_date}</p>`;
                                books = books + entry;
                            });
                            p.innerHTML = books;
                            divBooks.appendChild(p);
                        }
    		        }   
                }
            }
        }
    }
//}