define(
    [ "src/resources/map" ],
    function( Map ) {
      return function() {

        module( "Map", {
          setup: function() {
          },
          teardown: function() {}
        });
        
        test( "construct empty map", function() {
          expect( 4 );

          var expected = {
            "States": {
            },
            "Actions": {
            }
          };
          
          var newMap = new Map();
          ok(newMap instanceof Map, "type is correct when no args passed");
          deepEqual(newMap, expected, "map return has correct empty dicts");
          
          newMap = new Map({});
          ok(newMap instanceof Map, "type is correct when no args passed");
          deepEqual(newMap, expected, "map return has correct empty dicts");

        });  
        
        test( "construct meaningful states-only map", function() {
          expect( 2 );

          var arg = {
            "States": {
              "RunModifier": "SHIFT",
              "WalkForward": "W"
            }
          };
          
          var expected = {
            "States": {
              "RunModifier": "SHIFT",
              "WalkForward": "W"
            },
            "Actions": {
            }
          };
          
          var newMap = new Map(arg);
          ok(newMap instanceof Map, "type is correct when arg passed");
          deepEqual(newMap, expected, "map return has correct dicts");
        });          

        // XXX construct meaningful actions-only map
        
        // XXX construct states & actions map
      };
    }
);