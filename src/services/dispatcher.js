if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  var codes = require( "src/services/keyboard/key-codes" );
  var getKeyCode = require( "src/services/keyboard/get-key-code" );
  var getKeyName = require( "src/services/keyboard/get-key-name" );
  var Event = require( "core/event" );

  var extend = require( "common/extend" );

  function handleKey( state, event ) {
    var key = getKeyName( event.which || event.keyCode );
    if( "UNKNOWN" === key ) {
      // We don't know about this key, so just ignore it for now
      console.log( "unknown key" );
      return;
    }

    this.keyboard[key] = state;

    var eventName = state ? "KeyDown" : "KeyUp";
    this.queue.push( new Event( eventName, key ) );
  }

  function dispatch() {
    var registeredComponents = this._registeredComponents;
    var component, componentType, entityId;

    // Dispatch input events to all controllers
    var controllerComponents = [];
    if( registeredComponents.hasOwnProperty( "Controller" ) ) {
      for( entityId in registeredComponents["Controller"] ) {
        controllerComponents.push( registeredComponents["Controller"][entityId] );
      }
      while( this.queue.length ) {
        this.queue.shift().dispatch.call( this, controllerComponents );
      }
    }

    // Update all input components
    var updateEvent = new Event( 'Update', false );
    for( componentType in registeredComponents ) {
      for( entityId in registeredComponents[componentType] ) {
        component = registeredComponents[componentType][entityId]; 
        while( component.handleQueuedEvent() ) {}
        updateEvent.dispatch( component );
      }
    }
  }

  var Keyboard = function() {
    var that = this;
    codes.forEach( function( arr ) {
      var keyName = arr[0];
      that[keyName] = false;
    });
  };

  var Dispatcher = function( scheduler, options ) {
    options = options || {};

    var schedules = {
      "dispatch": {
        tags: ["@input", "input"],
        dependsOn: []
      }
    };
    Service.call( this, scheduler, schedules );
    var that = this;

    this.queue = []; // Queue for input events that we haven't dispatched yet

    this.inputDefaults = {};
    // Add default values for keyboard inputs
    codes.forEach( function( arr ) {
      var keyName = arr[0];
      that.inputDefaults[keyName] = false;
    });

    // Stores the current keyboard state
    this.keyboard = new Keyboard();

    this.element = options.element;
    this.element.addEventListener( "keydown", handleKey.bind( this, true ), false );
    this.element.addEventListener( "keyup", handleKey.bind( this, false ), false );
  };

  Dispatcher.prototype = new Service();
  Dispatcher.prototype.constructor = Dispatcher;

  var prototype = {
    dispatch: dispatch
  };
  extend( Dispatcher.prototype, prototype );

  return Dispatcher;

});