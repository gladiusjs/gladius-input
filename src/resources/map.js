if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  var Map = function( map ) {
    map = map || {};
    this.States = (undefined !== map.States ) ? map.States : {};
    this.Actions = (undefined !== map.Actions ) ? map.Actions : {};
    this._validate();
  };
  Map.prototype = {
    _validate: function _mapValidate() {
      var actionLength = this.Actions.length;
      for ( var i=0; i < actionLength; ++ i ) {
        if ( (!(typeof this.Actions[i]) == String) &&
             (!(typeof this.Actions[i]) == Array)) {
               throw new Error("map contains action " + i +
                 "that is neither String nor Array");
             } 
      }
    }
  }
  
  return Map;
});