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

      //This could probably have its length cut in half by making a function that gets called from in here.
      this._validateSubmap(this.Actions, "action");
      this._validateSubmap(this.States, "state");
    },
    _validateSubmap: function _validateSubmap(submap, submapName){
      var submapLength, submapIndex;
      var submapKeys = Object.keys(submap);
      for ( submapIndex = 0, submapLength = submapKeys.length; submapIndex < submapLength; ++ submapIndex ) {
        if (!(typeof submap[submapKeys[submapIndex]] == "string")){
          if ( !Array.isArray(submap[submapKeys[submapIndex]])) {
            throw new Error("map contains " + submapName + " " + submapKeys[submapIndex] +
              " that is not a string or array");
          } else {
            var i, l;
            var submapArray = submap[submapKeys[submapIndex]];
            if (submapArray.length === 0){
              throw new Error("map contains a(n) " + submapName + " array called " + submapKeys[submapIndex] + " of length 0");
            }
            for (i = 0, l = submapArray.length; i < l; ++ i){
              if (typeof submapArray[i] !== "string"){
                throw new Error("map contains " + submapName + " " + submapArray[i] +
                  " in a(n) " + submapName + " array. That " + submapName + " is not a string and the map is invalid as a result");
              }
            }
          }
        }
      }
    }
  }
  
  return Map;
});