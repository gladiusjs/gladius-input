if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  function DOMKeyMapper () {
    this.mapDOMCode = function( DOMKeyCode ) {
      return "WORD";
    }
  }
  
  return DOMKeyMapper;
});
