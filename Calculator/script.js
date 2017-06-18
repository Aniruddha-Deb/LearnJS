function onCalculateClick() {
	var expr = document.getElementById( "expression" ).value;
	expr = encodeURIComponent( expr );
	$.get( "http://192.168.0.100:8080/api/calculate?expression="+expr, 
			( data, status ) => {
				response = data;
				if( response.status ) {
					document.getElementById( "answer" ).innerHTML = response.answer;									
				}
				else {
					document.getElementById( "expression" ).style.backgroundColor = "red";	
				}
			} );
	refreshHistory();
}

function onClearClick() {
	document.getElementById( "answer" ).innerHTML = "";				
}

function refreshHistory() {
	$.get( "http://192.168.0.100:8080/api/history", 
			( data, status ) => {
				document.getElementById( "history" ).innerHTML = data;				
			} );
}

$(document).keypress( function( event ) {
	document.getElementById( "expression" ).style.backgroundColor = "white";	

	if( event.which == 13 ) {
		onCalculateClick();
	}
});

refreshHistory();