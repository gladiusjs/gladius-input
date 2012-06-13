if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Extension = require( "base/extension" );

  return new Extension( "gladius-input", {
      
      services: {
        "dispatcher": {
          service: require( "src/services/dispatcher" ),
          components: {
            Controller: require( "src/components/controller" )
          },
          resources: {
          }
        }
      },
      
      components: {
      },
      
      resources: {
        InputMap: require( "src/resources/map" )
      }
      
  });

});
