var mongoose = require( "mongoose" );
mongoose.Promise = require( "bluebird" );
mongoose.connect( "mongodb://localhost/test" );
var db = mongoose.connection;
db.on( "error", console.error.bind(console, 'connection error:') );
db.once( "open", function() {

    var KittenSchema = mongoose.Schema( {
        name: String
    } );
    var Kitten = mongoose.model( 'Kitten', KittenSchema );

    var fluffy = new Kitten( { name: "Fluffy" } );
    console.log( fluffy.name );
    fluffy.save( (err, kittens) => {} );
    db.close();
} );