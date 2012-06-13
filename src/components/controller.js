if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var Map = require("src/resources/map");
  var Event = require( "core/event" );

  var Controller = function(map){
    Component.call( this, "Controller", {}, [""] );
    var that = this;
    var stateIndex, stateLength, keyIndex, keyLength;
    var actionIndex, actionLength;

    //TODO: add comments explaining, make this work for the case where a key triggers more than one action
    //and make a test to make sure that a key bound to more than one thing works properly

    this.map = (undefined !== map ) ? map: new Map();
    this.states = {};
    this._stateMapping = {};
    //The following code segment reverses the mapping of states to keys that is
    // in map into a mapping of keys to states. This is useful in keyDown and
    // keyUp when we want to find out what keys correspond to what states.
    var states = Object.keys(this.map.States);
    for (stateIndex = 0, stateLength = states.length; stateIndex < stateLength; ++ stateIndex){
      var keys = this.map.States[states[stateIndex]];
      if (Array.isArray(keys)){
        for ( keyIndex = 0, keyLength = keys.length; keyIndex < keyLength; ++ keyIndex){
          this._stateMapping[keys[keyIndex]] = states[stateIndex];
        }
      }else{
        this._stateMapping[keys] = states[stateIndex];
      }
      this.states[states[stateIndex]] = false;
    }

    this._actionMapping = {};
    //See above comment but for actions
    var actions = Object.keys(this.map.Actions);
    for (actionIndex = 0, actionLength = actions.length; actionIndex < actionLength; ++ actionIndex){
      var keys = this.map.Actions[actions[actionIndex]];
      if (Array.isArray(keys)){
        for ( keyIndex = 0, keyLength = keys.length; keyIndex < keyLength; ++ keyIndex){
          this._actionMapping[keys[keyIndex]] = actions[actionIndex];
        }
      }else{
        this._actionMapping[keys] = actions[actionIndex];
      }
    }


    //Loop through all keys in the object. Take values of each key and assign
    // them to new data structure under that name with the key as a value
  };
  Controller.prototype = new Component();
  Controller.prototype.constructor = Controller;

  function onUpdate( event ) {

  }

  function onKeyDown( event ) {
    var key = event.data;
    if (undefined !== this._stateMapping[key]){
      this.states[this._stateMapping[key]] = true;
      this.owner.handleEvent(new Event(this._stateMapping[key], true));
    }
    if (undefined !== this._actionMapping[key]){
      if (this.owner){
        this.owner.handleEvent(new Event(this._actionMapping[key]));
      }
    }
  }

  function onKeyUp ( event ) {
    var key = event.data;
    if (undefined !== this._stateMapping[key]){
      this.states[this._stateMapping[key]] = false;
      this.owner.handleEvent(new Event(this._stateMapping[key], false));
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