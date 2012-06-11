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
        expect( 0 );

        var map = new Map(
          {
            "Actions": {
              "Fire": "SPACE"
            }
          }
        );
        var controller = new Controller( map );
        
        // create fake entity API object
        var myEntityAPI = { handleEvent: function () {} };
        
        // create entity mock
        var entityMock = sinon.mock(myEntityAPI);

        // tell controller where to dispatch events
        controller.setOwner(entityMock);
        
        // set up mock to expect handleEvent called with dispatched event
        mock.expects("handleEvent").once().withArgs(new Event(XXX));
        
        // call controller.onKey(XXX)
       
        // ensure expectations

      });

    };
  }
);