if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var codes = require( "src/services/keyboard/key-codes" );

  var names = {}; // Keys by keyName

  codes.forEach( function( arr ) {
    var keyName = arr[0];
    var keyCode = arr[1];

    names[keyName] = keyCode;
  });

  function getKeyCode( name ) {
    return names[name];
  }

  return getKeyCode;

});