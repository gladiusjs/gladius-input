if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  var Map = function( options ) {
    options = options || {};
    this.States = (undefined !== options.States ) ? options.States : {};
    this.Actions = (undefined !== options.Actions ) ? options.Actions : {};
  };
  return Map;
});