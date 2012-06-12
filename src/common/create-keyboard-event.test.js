define(
  [ "src/common/create-keyboard-event" ],
  function( createKeyboardEvent ) {
    return function() {

      module( "createKeyboardEvent", {
        setup: function() {
        },
        teardown: function() {}
      });

      // createTestKbdEvent is a partially implemented polyfill of sorts,
      // create to avoid excessively ugliness in the keyboard testing code.
      // It currently fails on WebKit-based browsers because of (at least)
      // WebKit bugs 16735 and 13368, but possibly also because of bugs in the
      // partial implementation that this tests.
      //
      // Events created this way are expected to be fragile; using them for
      // anything other than automated testing is discouraged.
      test( "create a new keyboard event", function() {
        expect( 7 );
        
        var e = createKeyboardEvent( "keydown",
                                          true,
                                          true,
                                          document.defaultView,
                                          'A',
                                          'A',
                                          0, // location
                                          "", // modifiersList
                                          false, // repeat
                                          ""); // localeArg
        ok( e instanceof KeyboardEvent, "created event is a KeyboardEvent");
        equal( e.type, "keydown", "type set to 'keydown'" );
        equal( e.bubbles, true, "bubbles set to true" );
        equal( e.cancelable, true, "cancelable set to true" );
        equal( e.view, window, "view set to window" );
        
        // depracted de facto standard: Webkit real: pass,
        // Webkit synthetic: fail, Firefox: pass
        equal( e.keyCode, 65, "keyCode property set");
        equal( e.charCode, 0, "charCode property set");

      });

    };
  }
);