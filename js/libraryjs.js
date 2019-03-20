function searchLibrary() {

}

function getLibrary() {
    target = "/get_Library";
    let request = new XMLHttpRequest();
    request.open("GET", target);
    request.send();
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
