if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  return [
    "src/resources/map.test",
    "src/components/controller.test",
    "src/services/dispatcher.test"
          ];

});
