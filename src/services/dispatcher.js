if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  var Event = require( "core/event" );
  var math = require( "_math" );

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

    this.queue = [];
        
    this.element.addEventListener("keydown", "dispatcherKeyDown", false);
    this.element.addEventListener("keyup", "dispatcherKeyUp", false);

  };

  function dispatcherKeyDown() {}
  function dispatcherKeyUp() {}
  
  function dispatch(){
  
  }

  Dispatcher.prototype = new Service();
  Dispatcher.prototype.constructor = Dispatcher;
  Dispatcher.prototype.dispatch = dispatch;
  return Dispatcher;

});