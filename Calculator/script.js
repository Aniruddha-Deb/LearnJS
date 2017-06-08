const OPERATOR = 0;
const NUMERIC  = 1;
const PARENTHESES = 2;

var pushedBackTokenStack = [];
var tokenList = [];

function getToken() {
	if( pushedBackTokenStack.length != 0 ) {
		return pushedBackTokenStack.pop();
	}
	else {
		return tokenList.shift();
	}
}

function onLoad() {
	document.addEventListener( "keydown", (e) => {
		onCalculateClick();
	} );
}

function onCalculateClick() {
	pushedBackTokenStack=[];
	tokenList=[];
 	Lexer( document.getElementById( "expression" ).value );
	var answer = Evaluator();
	document.getElementById( "answer" ).innerHTML = answer;
}

function onClearClick() {
	document.getElementById( "answer" ).innerHTML = "";				
}

function Lexer( expression ) {
	for( var i=0; i<expression.length; i++ ) {
		if( isOperator( expression.charAt( i ) ) ) {
			tokenList.push( new Token( expression.charAt( i ), 
					OPERATOR ) );
		}
		else if( isPartOfNumToken( expression.charAt( i ) ) ) {
			var t = new Token( expression.charAt( i ), NUMERIC );
			i++;
			while( isPartOfNumToken( expression.charAt( i ) ) ) {
				t.value = t.value + expression.charAt( i );
				i++;
			}
			i--;
			tokenList.push( t );
		}
		else if( isParentheses( expression.charAt( i ) ) ) {
			tokenList.push( new Token( expression.charAt( i ), 
					PARENTHESES ) );			
		}
	}
}

function Evaluator() {

	var answer = evaluateASOp();
	var token = getToken();

	while( token != null ) {

		var tokenValue = token.value;

		if( tokenValue == "+" || tokenValue == "-" ) {
			var rightHandVal = evaluateASOp();
			if( tokenValue == "+" ) {
				answer += rightHandVal;
			}
			else {
				answer -= rightHandVal;
			}
			token = getToken();
		}
		else {
			pushedBackTokenStack.push( token );
			break;
		}
	}
	console.log( "answer is " + answer );
	return answer;
}

function evaluateASOp() {
	var answer = evaluateMDOp();
	var token = getToken();

	while( token != null ) {

		var tokenValue = token.value;

		if( tokenValue == "*" || tokenValue == "/" ) {
			var rightHandVal = evaluateMDOp();
			if( tokenValue == "*" ) {
				answer *= rightHandVal;
			}
			else {
				answer /= rightHandVal;
			}
			token = getToken();
		}
		else {
			pushedBackTokenStack.push( token );
			break;
		}
	}
	return answer;
}

function evaluateMDOp() {
	var answer = 0;
	var token  = getToken();

	if( token.type == NUMERIC ) {
		answer = parseFloat( token.value );
	}
	else if( token.type == PARENTHESES ) {
		answer = Evaluator();
		token = getToken();
	}
	return answer;
}

function Token( value, type ) {
	this.value = value;
	this.type = type;
}

function isParentheses( c ) {
	return (c == ')' || c == '(');
}

function isPartOfNumToken( c ) {
	return !isNaN( parseInt( c+"" ) ) || c == '.';
}

function isOperator( c ) {
	return (c == '+' || c == '-' || c == '*' || c == '/');
}
