function printGenres(array, subdiv) {
    if (array.length > 0) {
        let choice = "<h3>Select Genre</h3>";
        array.forEach(function(item) {
            let emt = document.createElement('p');
            choice += `<label>${item.genre}</label>`;
            choice += `<input type='radio' name='genre' id='${item.genre_id}'><br>`;
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
            choice += `<input type='radio' name="author" value='${item.author_id}'><br>`;
            emt.innerHTML = choice;
        });
        let textN = document.createTextNode(choice);
        subdiv.innerHTML = choice;
    }
}


function fill(array, divBooks) {
     document.getElementById("AddBookHeader").style.visibility = "visible";
     document.getElementById("addGenre").style.visibility = "visible";
    let divGenre = document.getElementById('addGenre');
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
    authorName.innerHTML = '<h3>Add Author</h3><label>First Name</label><input type="text" name="fname"><label>Last Name</label><input type="text" name="lname">';
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
                if (array.length > 0) {
                    fill(array, div);
                }
                else {
                    let p = document.createElement('p');
                    p.innerHTML = "No Results";
                    div.appendChild(p);
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

// function checkOut() {

// }

// function addBook() {
//     let genres = document.getElementsByName('genre');
//     let authors = document.getElementsByName('author');
//     let fname = document.getElementById('fname');
//     let lname = document.getElementById('lname');
//     let new_genre = document.getElementById('new_genre');
//     let genre_id = 0;
//     let author_id = 0;
//     if (new_genre.value != "") {
//         // make new genre and return the id
//         let target = "/add_genre";
//         let request = new XMLHttpRequest();
//         request.open("POST", target);
//         request.send();
//         console.log("sending request...");
//         request.onreadystatechange = function(){
// 		    if(request.readyState == 4){
//     			if(request.status == 200){
//                     let array = JSON.parse(request.responseText);
//                     genre_id = array.author_id;
//                 }
// 	    	}
// 	    }
//     } else {
//         //iterate through genres
//         for(let i = 0; ; i++) {
//             if (genres[i].checked == true) {
//                 genre_id = genres[i].id;
//             }
//             break;
//         }
//     }
   
//     if (fname.value != "") {
//         let authorTarget = "/add_author"; 
//         let requestAuthor = new XMLHttpRequest();
//         requestAuthor.open("POST", authorTarget);
//         requestrequestAuthor.send();
//         console.log("sending request...");
//         requestAuthor.onreadystatechange = function(){
// 		    if(requestAuthor.readyState == 4){
//     			if(requestAuthor.status == 200){
//                     let array = JSON.parse(requestAuthor.responseText);
//                     author_id = array.author_id;
//                 }
// 	    	}
// 	    } 
//     } else {
//         for(let i = 0; ; i++) {
//             if (authors[i].checked == true) {
//                 author_id = authors[i].id;
//             }
//             break;
//         }
//     }
//     let title = document.getElementById('title');

//     let year = document.getElementById('year');
//     let publisher = document.getElementById('publisher');
//     let body = [title, author_id, year, publisher];
// }