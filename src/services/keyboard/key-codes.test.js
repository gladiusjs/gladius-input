if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/services/keyboard/key-codes" ],
  function( keyboard ) {
    return function() {

      module( "keyboard", {
        setup: function() {},
        teardown: function() {}
      });

      test( "keyboard dictionary", function() {
        expect( 0 );
      });

    };
  }
);      