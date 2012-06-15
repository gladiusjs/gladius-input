if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var Map = require("src/resources/map");
  var Event = require( "core/event" );

  var Controller = function(service, map){
    Component.call( this, "Controller", service, [] );
    var that = this;
    var stateIndex, stateLength, keyIndex, keyLength;
    var actionIndex, actionLength;

    this.map = (undefined !== map ) ? map: new Map();
    this.states = {};
    this._stateMapping = {};
    //The following code segment reverses the mapping of states to keys that is
    // in map into a mapping of keys to states. This is useful in keyDown and
    // keyUp when we want to find out what keys correspond to what states.
    var states = Object.keys(this.map.States);
    for (stateIndex = 0, stateLength = states.length; stateIndex < stateLength; ++ stateIndex){
      var keys = this.map.States[states[stateIndex]];
      //The current state will have either one key or an array of keys mapped to it
      if (Array.isArray(keys)){
        for ( keyIndex = 0, keyLength = keys.length; keyIndex < keyLength; ++ keyIndex){
          this._mapKey(this._stateMapping, keys[keyIndex], states[stateIndex]);
        }
      }else{
        this._mapKey(this._stateMapping, keys, states[stateIndex]);
      }
      this.states[states[stateIndex]] = false;
    }

    this._actionMapping = {};
    //See above comments but for actions
    var actions = Object.keys(this.map.Actions);
    for (actionIndex = 0, actionLength = actions.length; actionIndex < actionLength; ++ actionIndex){
      var keys = this.map.Actions[actions[actionIndex]];
      if (Array.isArray(keys)){
        for ( keyIndex = 0, keyLength = keys.length; keyIndex < keyLength; ++ keyIndex){
          this._mapKey(this._actionMapping, keys[keyIndex], actions[actionIndex]);
        }
      }else{
        this._mapKey(this._actionMapping, keys, actions[actionIndex]);
      }
    }
  };

  Controller.prototype = new Component();
  Controller.prototype.constructor = Controller;

  //toMap is either a state or an action, depending on if this method was given
  // this._actionMapping or this._stateMapping
  function _mapKey(keyMapping, keyName, toMap){
    var currentMapping = keyMapping[keyName];
    //if no states are mapped to this key yet then map the toMap to the key
    if (undefined === currentMapping){
      keyMapping[keyName] = toMap;
    //otherwise if there is a toMap mapped then turn the mapping into an array
    // including the already mapped toMap and the new toMap
    }else if (typeof currentMapping === "string"){
      keyMapping[keyName] = [currentMapping, toMap];
    //otherwise we have multiple states mapped already, just add another one onto the array
    }else{
      keyMapping[keyName][currentMapping.length] = toMap;
    }
  }

  function onUpdate( event ) {

  }

  function onKeyDown( event ) {
    var key = event.data;
    if (undefined !== this._stateMapping[key]){
      if (Array.isArray(this._stateMapping[key])){
        var i, l;
        for (i = 0, l = this._stateMapping[key].length; i < l; ++ i){
          this.states[this._stateMapping[key][i]] = true;
        }
        if (this.owner){
          for (i = 0, l = this._stateMapping[key].length; i < l; ++ i){
            this.owner.handleEvent(new Event(this._stateMapping[key][i], true));
          }
        }
      }else{
        this.states[this._stateMapping[key]] = true;
        if (this.owner){
          this.owner.handleEvent(new Event(this._stateMapping[key], true));
        }
      }
    }
    if (undefined !== this._actionMapping[key]){
      if (Array.isArray(this._actionMapping[key])){
        for (var i = 0, l = this._actionMapping[key].length; i < l; ++ i){
          this.owner.handleEvent(new Event(this._actionMapping[key][i]));
        }
      }
      else if (this.owner){
        this.owner.handleEvent(new Event(this._actionMapping[key]));
      }
    }
  }

  function onKeyUp ( event ) {
    var key = event.data;
    if (undefined !== this._stateMapping[key]){
      if (Array.isArray(this._stateMapping[key])){
        var i, l;
        for (i = 0, l = this._stateMapping[key].length; i < l; ++ i){
          this.states[this._stateMapping[key][i]] = false;
        }
        if (this.owner){
          for (i = 0, l = this._stateMapping[key].length; i < l; ++ i){
            this.owner.handleEvent(new Event(this._stateMapping[key][i], false));
          }
        }
      }else{
        this.states[this._stateMapping[key]] = false;
        if (this.owner){
          this.owner.handleEvent(new Event(this._stateMapping[key], false));
        }
      }
    }
  }

  function onEntitySpaceChanged( event ) {
    var data = event.data;
    if( data.previous === null && data.current !== null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
    }

    if( data.previous !== null && data.current === null && this.owner !== null ) {
      this.provider.unregisterComponent( this.owner.id, this );
    }
  }

  function onComponentOwnerChanged( event ) {
    var data = event.data;
    if( data.previous === null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
    }

    if( this.owner === null && data.previous !== null ) {
      this.provider.unregisterComponent( data.previous.id, this );
    }
  }

  function onEntityActivationChanged( event ) {
    var active = event.data;
    if( active ) {
      this.provider.registerComponent( this.owner.id, this );
    } else {
      this.provider.unregisterComponent( this.owner.id, this );
    }
  }

  var prototype = {
    _mapKey: _mapKey,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    onUpdate: onUpdate,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged
  };
  extend( Controller.prototype, prototype );

  return Controller;
});