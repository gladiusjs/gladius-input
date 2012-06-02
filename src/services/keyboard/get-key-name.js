if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var codes = require( "src/services/keyboard/key-codes" );

  var keys = [];  // Keys by keyCode

  codes.forEach( function( arr ) {
    var keyName = arr[0];
    var keyCode = arr[1];

    keys[keyCode] = keyName;
  });

  function getKeyName( code ) {
    switch (code) {
    case 8:
      return 46; // delete on Mac
    case 61:
      return 109; // + on Mac
    case 91: // META L (Saf/Mac)
    case 93: // META R (Saf/Mac)
    case 224: // META (FF/Mac)
      return 157;
    case 57392: // CONTROL (Op/Mac)
      return 17;
    case 45: // INSERT
      return 155;
    }
    return keys[code];
  }

  return getKeyName;

});