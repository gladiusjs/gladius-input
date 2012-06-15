if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  var Event = require( "core/event" );

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

    this._queue = [];

    var self = this;
    function dispatcherKeyHandler(event) {
      self._queue.push(event);
    }

    this.element.addEventListener("keydown", dispatcherKeyHandler, false);
    this.element.addEventListener("keyup", dispatcherKeyHandler, false);

  };

  function dispatch(){

    //return;
    // XXX for each DOM event in the array
    this._queue.forEach( (function ( domEvent ) {

      // XXX create Event from DOM event
      if (domEvent.type === "keydown"){
        var gladiusEvent = new Event(domEvent.type, domEvent.which);
      }else if (domEvent.type === "keyup"){
        var gladiusEvent = new Event(domEvent.type, domEvent.keyCode);
      }

      // dispatch each event to every controller we have that will handle it
      var controllers = this._registeredComponents["Controller"];
      var controllerIds = Object.keys( controllers );
      controllerIds.forEach( function ( id ) {
        controllers[id].handleEvent(gladiusEvent);
      });


    }).bind(this));
  }

  Dispatcher.prototype = new Service();
  Dispatcher.prototype.constructor = Dispatcher;
  Dispatcher.prototype.dispatch = dispatch;
  return Dispatcher;

});