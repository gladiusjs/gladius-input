if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  function createKeyboardEvent( type, canBubble, cancelable, view, charArg, key, 
    location, modifiersList, repeat, locale ) {
                
    var e = document.createEvent("KeyboardEvent");

    // DOM3 API implementors (currently WebKit, IE, ...)
    if ( "initKeyboardEvent" in e ) {
      e.initKeyboardEvent( type, canBubble, cancelable, view,
        charArg, key, location, modifiersList, repeat, locale );
    // Gecko browsers
    } else if ( "initKeyEvent" in e ) {
      e.initKeyEvent( type, canBubble, cancelable, view, false,
        false, false, false, key.charCodeAt(0),
        charArg.charCodeAt(0));
    } else {
      throw new Error("This browser's KeyboardEvent supports " +
                      "neither initKeyEvent nor initKeyboardEvent");
    }
    
    return e;
  }

  return createKeyboardEvent;

});