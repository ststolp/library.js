function printGenres(array, subdiv) {
    if (array.length > 0) {
        let choice = "";
        array.forEach(function(item) {
            let emt = document.createElement('p');
            choice = `<label>${item.genre}</label>`;
            choice += `<input type='radio' name='genre' id='${item.genre_id}'><br>`;
            emt.innerHTML = choice;
        });
        subdiv.innerHTML = subdiv.innerHTML + choice;
    }
}

function printAuthors(array, subdiv) {
    if (array.length > 0) {
        let choice = "";
        array.forEach(function(item) {
            let emt = document.createElement('p');
            choice = `<label>${item.fname} ${item.lname}</label>`;
            choice += `<input type='radio' name="author" id='${item.author_id}'><br>`;
            emt.innerHTML = choice;
        });
        subdiv.innerHTML = subdiv.innerHTML + choice;
    }
}


function fill(array, div) {
    div.innerHTML = "";
    array.forEach(function(item) {
        let emt = document.createElement('p');
        let entry = `<p><b>${item.title}</b> by ${item.fname} ${item.lname}</p>`;
        entry += `<p>Publisher: ${item.publisher}, ${item.year}.</p>`;
	    entry += "<label>Check out this book</label><br>";
	    entry += `<input type='checkbox' name='checkout[]' value='${item.book_id}'>`;
        emt.innerHTML = entry; 
        div.appendChild(emt)
    });
    let emt = document.createElement('p');
    let button = '<br><button class="button" onclick="checkOut()">Check Out</button>';
    emt.innerHTML = button;
    div.appendChild(emt);

 let content = "<h2>Add a Book</h2>";

	content += "<label>Title</label><input type='text' id='title'><br><h3>Genre</h3>";
    div.innerHTML = div.innerHTML + content;
//get all the genres</br>
    let request = new XMLHttpRequest();
    let target = "/get_genres"; 
    request.open("GET", target);
    request.send();
	   request.onreadystatechange = function(){
		console.log("on ready state function calling: " + request.readyState);
		if(request.readyState == 4){
			var subdiv = document.createElement('div');
			if(request.status == 200){
                console.log(request.responseText);
                let array = JSON.parse(request.responseText);
                printGenres(array, subdiv);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
            }
            div.innerHTML = div.innerHTML + subdiv;
        }
    }


    let newGenre = "<label>Other Genre</label><input type='text' id='new_genre' value=''><br>";
    div.innerHTML = div.innerHTML + newGenre;
//get all authors
 let requestAuthor = new XMLHttpRequest();
    let targetAuthor = "/get_authors"; 
    requestAuthor.open("GET", targetAuthor);
    requestAuthor.send();
       requestAuthor.onreadystatechange = function(){
		console.log("on ready state function calling: " + requestAuthor.readyState);
		if(requestAuthor.readyState == 4){
			var subdiv = document.createElement('div');
			if(requestAuthor.status == 200){
                console.log(requestAuthor.responseText);
                let array = JSON.parse(requestAuthor.responseText);
                printAuthors(array, subdiv);
			}else{
				div.appendChild(document.createTextNodeJSON.stringify(ERROR));
            }
               div.innerHTML = div.innerHTML + subdiv;
        }
     
	}

	let more = '<label>Other Author</label><input type="text" id="fname" value=""><input type="text" id="lname" value=""><br>';
	more += '<label>year</label><input type="date" id="year"><br><label>Publisher</label>';
    more += '<input type="text" id="publisher"><br><button class="button" onclick="addBook()">Add Book</button>';
    div.innerHTML = div.innerHTML + more;
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
   let output = document.getElementById('output');
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
            output.innerHTML = "";
			output.appendChild(div);
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
   let output = document.getElementById('output');
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
            output.innerHTML = "";
			output.appendChild(div);
		}
	}
}

function checkOut() {

}

function addBook() {

}