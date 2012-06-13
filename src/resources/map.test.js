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
        expect( 6 );

        var expected = {
          "States": {
          },
          "Actions": {
          }
        };
        
        var newMap = new Map();
        ok(newMap instanceof Map, "type is correct when no args passed");
        deepEqual(newMap.States, expected.States, "map return has correct empty state dict");
        deepEqual(newMap.Actions, expected.Actions, "map return has correct empty action dict");
        
        newMap = new Map({});
        ok(newMap instanceof Map, "type is correct when no args passed");
        deepEqual(newMap.States, expected.States, "map return has correct empty state dict");
        deepEqual(newMap.Actions, expected.Actions, "map return has correct empty action dict");

      });  
      
      test( "construct meaningful states-only map", function() {
        expect( 3 );

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
        deepEqual(newMap.States, expected.States, "map return has correct state dict");
        deepEqual(newMap.Actions, expected.Actions, "map return has correct action dict");
      });          

      test( "construct meaningful actions-only map", function() {
        expect( 3 );

        var arg = {
          "Actions": {
            "Fire": "SPACE",
            "Help": "F1"
          }
        };
        
        var expected = {
          "States": {
          },
          "Actions": {
            "Fire": "SPACE",
            "Help": "F1"
          }
        };
        
        var newMap = new Map(arg);
        ok(newMap instanceof Map, "type is correct when arg passed");
        deepEqual(newMap.States, expected.States, "map return has correct state dict");
        deepEqual(newMap.Actions, expected.Actions, "map return has correct action dict");
      });          

      test( "construct meaningful map, states and actions", function() {
        expect( 3 );

        var arg = {
          "Actions": {
            "Fire": "SPACE",
            "Help": "F1"
          },
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
            "Fire": "SPACE",
            "Help": "F1"
          }
        };
        
        var newMap = new Map(arg);
        ok(newMap instanceof Map, "type is correct when arg passed");
        deepEqual(newMap.States, expected.States, "map return has correct state dict");
        deepEqual(newMap.Actions, expected.Actions, "map return has correct action dict");
      });
      
      test( "constructing a map with non-string/non-array property values throws", 
        function () {
          expect(2);
          
          var mapArg = {
            "Actions": {
              "First": {}
            }
          };
          
          raises(function() {
            var newMap = new Map(mapArg);
          },
            function(err) {
            return err instanceof Error &&
              err.message == "map contains action First that is not a string or array";
          },
            "exception raised by map creation with non-string prop val");

          mapArg = {
            "States": {
              "First": {}
            }
          };

          raises(function() {
              var newMap = new Map(mapArg);
            },
            function(err) {
              return err instanceof Error &&
                err.message == "map contains state First that is not a string or array";
            },
            "exception raised by map creation with non-string prop val");
        }); 
    };
  }
);
