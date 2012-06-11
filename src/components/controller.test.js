define(
  [ "src/components/controller",
    "src/resources/map",
    "core/event"
     ],
  function( Controller, Map ) {
    return function() {

      module( "Controller", {
        setup: function() {
        },
        teardown: function() {}
      });

      test( "construct a controller, no map", function() {
        expect( 2 );

        var controller = new Controller();
        ok( controller instanceof Controller, "type is correct" );

        var expected = {
          "States": {
          },
          "Actions": {
          }
        };

        deepEqual( controller.map, expected, "controller map is correct" );
      });


      test( "construct a controller with a map", function() {
        expect( 2 );
        var map = new Map(
          {
            "Actions": {
              "Fire": "SPACE",
              "Help": "F1"
            },
            "States": {
              "RunModifier": "SHIFT",
              "WalkForward": "W"
            }
          }
        );
        var controller = new Controller( map );

        ok( controller instanceof Controller, "type is correct" );
        deepEqual( controller.map, map, "controller map is correct" );
      });


      test( "key event triggers game action, based on map", function() {
        expect( 2 );

        var map = new Map(
          {
            "Actions": {
              "Fire": "SPACE"
            }
          }
        );
        var controller = new Controller( map );
        
        // create fake entity API object
        var myEntityAPI = { 
          handleEvent: function ( event ) {
            deepEqual( event, new Event( "Fire" ), "event dispatched to entity" );
          }
        };
        
        // create entity mock
        var entityMock = sinon.mock(myEntityAPI);

        // tell controller where to dispatch events
        controller.setOwner(entityMock);
        
        // set up mock to expect handleEvent called with dispatched event
        mock.expects("handleEvent").once();
        
        ok( controller.hasOwnProperty( "onKeyDown" ), "has key event handler" );
        controller.onKeyDown( new Event( "KeyDown", "SPACE" ) );
       
        // ensure expectations
        ok( entityMock.verify(), "entity method invocations are correct" );
      });

      test( "key event triggers game state, based on map", function() {
        expect( 10 );

        var map = new Map(
          {
            "States": {
              "WalkForward": "W"
            }
          }
        );
        var controller = new Controller( map );
        ok( controller.hasOwnProperty( "onKeyDown" ), 
          "controller has KeyDown event handler" );
        ok( controller.hasOwnProperty( "onKeyUp" ), 
          "controller has KeyUp event handler" );

        var eventCounter = 0;

        // create fake entity API object
        var myEntityAPI = { 
          handleEvent: function ( event ) {
            ++ eventCounter;
            equal( event.type, "WalkForward", "event type is correct" );

            if( 1 === eventCounter ) {
              equal( event.data, true, 
                "WalkForward state is true after KeyDown" );
              equal( controller.states["WalkForward"], true, 
                "controller WalkForward state is correct after KeyUp" );
            } else {
              equal( event.data, false, 
                "WalkForward state is false after KeyUp" );
              equal( controller.states["WalkForward"], false, 
                "controller WalkForward state is false after KeyUp" );
            }
          }
        };
               
        equal( controller.states["WalkForward"], false, 
          "controller WalkForward state is initially false" );

        // call controller.onKey()
        controller.onKeyDown( new Event( "KeyDown", "W" ) );
        controller.onKeyUp( new Event( "KeyUp", "W" ) );
       
        // ensure expectations
        equal( eventCounter, 2, "handleEvent invoked twice" );
      });

    };
  }
);