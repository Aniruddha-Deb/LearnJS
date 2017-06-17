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

var express = require( 'express' );
var app = express();
var mongoose = require( 'mongoose' );
mongoose.connect( "mongodb://localhost/calculator" );
var db = mongoose.connection;
var History = mongoose.model( 'History', mongoose.Schema( {
    expression: String, 
    answer: String
} ) ) ;

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

app.get( '/api/calculate', ( req, res ) => {
    var expression = req.query.expression;
    pushedBackTokenStack=[];
    tokenList=[];
    Lexer( expression );
    var answer = Evaluator();

    // Save history to MongoDB
    new History( { 
        expression: expression, 
        answer: answer+""
    } ).save();

    res.send( answer+"" );
} );

app.get( '/api/history', ( req, res ) => {
    var history = "";
    var query = History.find( {} )
                       .limit( 10 )
                       .select({ "expression": 1, "answer": 1, "_id": 0})
                       .sort( { "_id": -1 } );

    query.exec(function ( err, someValue ) {
        someValue.forEach( (entry) => {
            history += entry.expression + " = " + entry.answer + "<br>";
        } )
        res.send( history );
    });    
} );

app.listen( 8080 );
console.log( 'Listening for API calls' );



