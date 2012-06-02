if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var InputMap = function( data ) {
    var map = JSON.parse( data );
    map._gladius = {};
    return map;
  };

  return InputMap;

});