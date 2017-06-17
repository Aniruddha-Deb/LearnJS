function onCalculateClick() {
	var expr = document.getElementById( "expression" ).value;
	expr = encodeURIComponent( expr );
	$.get( "http://192.168.0.100:8080/api/calculate?expression="+expr, 
			( data, status ) => {
				document.getElementById( "answer" ).innerHTML = data;				
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

$(document).keypress( function( event ){
	if( event.which == 13 ) {
		onCalculateClick();
	}
});

refreshHistory();