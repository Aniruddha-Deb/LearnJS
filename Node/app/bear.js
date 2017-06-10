var mongoose = require( 'mongoose' );
var schema = mongoose.Schema;

var BearSchema   = new schema( {
    name: String
} );

module.exports = mongoose.model( 'Bear', BearSchema );
