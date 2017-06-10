var express = require( 'express' );
var app = express();
var bodyParser = require( 'body-parser' );

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get( '/', ( req, res ) => {
    res.json({ message: 'hooray! welcome to our api!' });   
} );

app.use( '/api', router );

app.listen( port );
console.log( 'Magic happens on port ' + port );

var mongoose = require( 'mongoose' );
mongoose.connect('mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o');

var Bear = require( './bear.js' );

router.route( '/bears/' )
    .post( (req, res) => {

        var bear = new Bear();      
        bear.name = req.body.name;  

        bear.save( function( err ) {
            if ( err ) {
                res.send(err);
            }

            res.json({ message: 'Bear created!' });
        });

    } );
app.use( '/api', router );
