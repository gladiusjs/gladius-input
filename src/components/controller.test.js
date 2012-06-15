define(
  [ "src/components/controller",
    "src/resources/map",
    "core/event"
     ],
  function( Controller, Map, Event ) {
    return function() {

      module( "Controller", {
        setup: function() {
        },
        teardown: function() {}
      });

      test( "construct a controller, no map", function() {
        expect( 3 );

        var controller = new Controller();
        ok( controller instanceof Controller, "type is correct" );

        var expected = {
          "States": {
          },
          "Actions": {
          }
        };

        deepEqual( controller.map.States, expected.States, "controller map states are correct" );
        deepEqual( controller.map.Actions, expected.Actions, "controller map actions are correct" );
      });


      test( "construct a controller with a map", function() {
        expect( 3 );
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
        var controller = new Controller( null, map );

        ok( controller instanceof Controller, "type is correct" );
        deepEqual( controller.map.States, map.States, "controller map states are correct" );
        deepEqual( controller.map.Actions, map.Actions, "controller map actions are correct" );
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
        var controller = new Controller( null, map );
        
        // create fake entity API object
        var myEntityAPI = { 
          handleEvent: function ( event ) {
            deepEqual( event, new Event( "Fire" ), "event dispatched to entity" );
          }
        };
        
        // create entity mock
        var entityMock = sinon.mock(myEntityAPI);

        // tell controller where to dispatch events
        controller.setOwner(myEntityAPI);
        
        // set up mock to expect handleEvent called with dispatched event
        entityMock.expects("handleEvent").once();
        
        ok( "onKeyDown" in controller, "has key event handler" );
        controller.onKeyDown( new Event( "KeyDown", "SPACE" ));
       
        // ensure expectations
        ok( entityMock.verify(), "entity method invocations are correct" );
      });

      test( "key event triggers multiple mapped game actions, based on map", function() {
        expect( 3 );

        var map = new Map(
          {
            "Actions": {
              "Fire": "SPACE",
              "Fly": "SPACE"
            }
          }
        );
        var controller = new Controller( null, map );

        var fireCounter = 0;
        var flyCounter = 0;
        // create fake entity API object
        var fakeEntity = {
          //Code in here doesn't actually get run. Whoops.
          handleEvent: function ( event ) {
            if (event.type === "Fire"){
              if (fireCounter === 0){
                ok(true, "fire event dispatched to entity once and once only");
                ++ fireCounter;
              }else{
                ok(false, "fire event dispatched to entity once and once only");
              }
            }else if (event.type === "Fly"){
              if (flyCounter === 0){
                ok(true, "fly event dispatched to entity once and once only");
                ++ flyCounter;
              }else{
                ok(false, "fly event dispatched to entity once and once only");
              }
            }else{
              ok(false, "valid type dispatched to entity");
            }
          }
        };

        // tell controller where to dispatch events
        controller.setOwner(fakeEntity);
        ok( "onKeyDown" in controller, "has key event handler" );
        controller.onKeyDown( new Event( "KeyDown", "SPACE" ));
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
        var controller = new Controller( null, map );
        ok( "onKeyDown" in controller,
          "controller has KeyDown event handler" );
        ok( "onKeyUp" in controller,
          "controller has KeyUp event handler" );

        var eventCounter = 0;

        // create fake entity API object
        var fakeEntity = {
          handleEvent: function ( event ) {
            ++ eventCounter;
            equal( event.type, "WalkForward", "event type is correct" );

            if( 1 === eventCounter ) {
              equal( event.data, true, 
                "WalkForward state is true after KeyDown" );
              equal( controller.states["WalkForward"], true, 
                "controller WalkForward state is correct after KeyDown" );
            } else {
              equal( event.data, false, 
                "WalkForward state is false after KeyUp" );
              equal( controller.states["WalkForward"], false, 
                "controller WalkForward state is false after KeyUp" );
            }
          }
        };

        controller.setOwner(fakeEntity);
               
        equal( controller.states["WalkForward"], false, 
          "controller WalkForward state is initially false" );

        // call controller.onKey()
        controller.onKeyDown( new Event( "KeyDown", "W" ) );
        controller.onKeyUp( new Event( "KeyUp", "W" ) );
       
        // ensure expectations
        equal( eventCounter, 2, "handleEvent invoked twice" );
      });

      //TODO: Find out if we want to set all states at once and then fire each
      // event or set a state then fire an event state by state
      test( "key event triggers multiple mapped game states, based on map", function() {
        expect( 18 );

        var map = new Map(
          {
            "States": {
              "WalkForward": "W",
              "Pain": "W"
            }
          }
        );
        var controller = new Controller( null, map );
        ok( "onKeyDown" in controller,
          "controller has KeyDown event handler" );
        ok( "onKeyUp" in controller,
          "controller has KeyUp event handler" );

        var walkEventCounter = 0;
        var painEventCounter = 0;

        // create fake entity API object
        var fakeEntity = {
          handleEvent: function ( event ) {
            if (event.type === "WalkForward"){
              ++ walkEventCounter;
              if( 1 === walkEventCounter ) {
                equal( event.data, true,
                  "WalkForward state is true after KeyDown" );
                equal( controller.states["WalkForward"], true,
                  "controller WalkForward state is correct after KeyDown" );
                equal( controller.states["Pain"], true,
                  "controller Pain state is correct after KeyDown");
              } else {
                equal( event.data, false,
                  "WalkForward state is false after KeyUp" );
                equal( controller.states["WalkForward"], false,
                  "controller WalkForward state is false after KeyUp" );
                equal( controller.states["Pain"], false,
                  "controller Pain state is correct after KeyDown");
              }
            }else if (event.type === "Pain"){
              ++ painEventCounter;
              if( 1 === painEventCounter ) {
                equal( event.data, true,
                  "pain state is true after KeyDown" );
                equal( controller.states["WalkForward"], true,
                  "controller WalkForward state is correct after KeyDown" );
                equal( controller.states["Pain"], true,
                  "controller Pain state is correct after KeyDown");
              } else {
                equal( event.data, false,
                  "pain state is false after KeyUp" );
                equal( controller.states["WalkForward"], false,
                  "controller WalkForward state is false after KeyUp" );
                equal( controller.states["Pain"], false,
                  "controller Pain state is correct after KeyDown");
              }
            }
          }
        };

        controller.setOwner(fakeEntity);

        equal( controller.states["WalkForward"], false,
          "controller WalkForward state is initially false" );
        equal( controller.states["Pain"], false,
          "controller Pain state is initially false" );

        // call controller.onKey()
        controller.onKeyDown( new Event( "KeyDown", "W" ) );
        controller.onKeyUp( new Event( "KeyUp", "W" ) );

        // ensure expectations
        equal( walkEventCounter, 2, "walk handleEvent invoked twice" );
        equal( painEventCounter, 2, "pain handleEvent invoked twice" );
      });

    };
  }
);