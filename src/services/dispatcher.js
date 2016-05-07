if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  var Event = require( "core/event" );
  var DOMKeyMapper = require( "src/services/DOMKeyMapper" );

  var Dispatcher = function( scheduler, options ) {
    options = options || {};

    var schedules = {
      "dispatch": {
        tags: ["@input"],
        dependsOn: []
      }
    };
    Service.call( this, scheduler, schedules );

    if ( 'element' in options ) {
      this.element = options.element;
    } else {
      this.element = document;
    }

    this.DOMKeyMapper = new DOMKeyMapper();

    this._queue = [];

    var self = this;
    function dispatcherKeyHandler(event) {
      self._queue.push(event);
    }

    this.element.addEventListener("keydown", dispatcherKeyHandler, false);
    this.element.addEventListener("keyup", dispatcherKeyHandler, false);

  };

  function dispatch(){

    var controllers = this._registeredComponents["Controller"];
    if (!controllers){
      controllers = [];
    }
    var controllerIds = Object.keys( controllers );
    var domEvent, keyCodeString, domCode, gladiusEvent;
    var i, l, controllerIndex, controllerLimit;
    for (i = 0, l = this._queue.length; i < l; ++ i){
      // get the event code from the DOM
      domEvent = this._queue[i];
      domCode = domEvent.which ? domEvent.which : domEvent.keyCode;

      // translate it into keyCode string
      keyCodeString = this.DOMKeyMapper.getKeyName(domCode);

      // create Event from DOM event
      if (domEvent.type === "keydown"){
        gladiusEvent = new Event("KeyDown", keyCodeString);
      }else if (domEvent.type === "keyup"){
        gladiusEvent = new Event("KeyUp", keyCodeString);
      }else{
        throw new Error("A DOM event type was encountered which was not keydown or keyup in dispatcher");
      }

      // dispatch each event to every controller we have that will handle it

      for (controllerIndex = 0, controllerLimit = controllerIds.length;
           controllerIndex < controllerLimit;
           ++ controllerIndex){
        gladiusEvent.dispatch(controllers[controllerIds[controllerIndex]]);
      }
    }
    this._queue = [];

    var component, entityId;
    var registeredComponents = this._registeredComponents;

    var updateEvent = new Event( 'Update', undefined, false);
    for( var componentType in registeredComponents ) {
      for( entityId in registeredComponents[componentType] ) {
        component = registeredComponents[componentType][entityId];
        while( component.handleQueuedEvent() ) {}
        updateEvent.dispatch( component );
      }
    }
  }

  Dispatcher.prototype = new Service();
  Dispatcher.prototype.constructor = Dispatcher;
  Dispatcher.prototype.dispatch = dispatch;
  return Dispatcher;

});