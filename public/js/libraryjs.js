function fill(array, div) {
    array.foreach(function(item) {
        let entry = "";
        entry += `<p><b>${item.title}</b> by ${item.fname} ${item.lname}</p>`;
        entry += `<p>Publisher: ${item.publisher}, ${item.year}.</p>`;
	    entry += "<label>Check out this book</label><br>";
	    entry += `<input type='checkbox' name='checkout[]' value='${item.book_id}'>`;
        div.appendChild(document.createTextNode(entry));
    });
    let button = '<br><button class="button" onclick="">Check Out</button>';
    div.appendChild(document.createTextNode(button));
}

function searchLibrary() {
    let method = document.getElementById('method').value;
    let search = document.getElementById('search').value;
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
                let array = request.responseText;
                fill(array, div);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
			}
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
                let array = request.responseText;
                fill(array, div);
			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
			}
			output.appendChild(div);
		}
	}
}