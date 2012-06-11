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

      test( "construct meaningful actions-only map", function() {
        expect( 2 );

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
        deepEqual(newMap, expected, "map return has correct dicts");
      });          

      test( "construct meaningful map, states and actions", function() {
        expect( 2 );

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
        deepEqual(newMap, expected, "map return has correct dicts");
      });
      
      test( "constructing a map with non-string property values throws", 
        function () {
          expect(1);
          
          var mapArg = {
            "Actions": {
              "First": []
            }
          };
          
          raises(function() {
            var newMap = new Map(mapArg);
          }, function(err) {
            return err instanceof Error &&
              err.message == "map initializer contained non-string value";
          },"exception raised by map creation with non-string prop val");
        }); 
    };
  }
);
