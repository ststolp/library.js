function searchLibrary() {

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
				div.appendChild(document.createTextNode(request.responseText));

			}else{
				div.appendChild(document.createTextNode(JSON.stringify(ERROR)));
			}
			output.appendChild(div);
		}
	}
}