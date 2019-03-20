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
		console.log("on ready state function calling");
		if(request.readystate == 4){
			var div = document.createElement('div');
			if(request.status == 200){
				div.appendChild(Dcoument.createTextNode(request.responseText));

			}else{
				div.appendChild(Dcoument.createTextNode(JSON.stringify(ERROR)));
			}
			output.appendChild(div);
		}
	}
}