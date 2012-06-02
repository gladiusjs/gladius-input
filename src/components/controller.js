if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var Event = require( "core/event" );

  var Controller = function( service, inputMap ) {
    Component.call( this, "Controller", service );

    this._inputMap = inputMap || {};
    this._inputStates = {};
    this._updateRequired = false;
    this.states = {};

    // Populate input states from the input map
    var i, l;
    var inputs;
    var that = this;
    var types = [ "actions", "states" ];
    for( var type in types ) {
      if( this._inputMap.hasOwnProperty( type ) ) {
        this._inputStates[type] = {};
        var names = Object.keys( this._inputMap[type] );
        for( i = 0, l = names.length; i < l; ++ i ) {
          var name = names[i];
          inputs = this._inputMap[type][name];
          inputs.forEach( function( input ) {
            that._inputStates[type][input] = service.inputDefaults[input];
          });
          if( "states" === type ) {
            this.states[name] = false;
          }
        }
      }
    }
  };
  Controller.prototype = new Component();
  Controller.prototype.constructor = Controller;

  function checkInputs( inputList ) {
    var i, l;
    for( i = 0, l = inputList.length; i < l; ++ i ) {
      if( !this._inputStates[inputList[i]] ) {
        return false;
      }
    }
    return true;
  }

  function onUpdate( event ) {
    var that = this;
    var i, l;
    var inputs;
    if( this._updateRequired ) {
      if( this._inputMap.hasOwnProperty( "actions" ) ) {
        var actionNames = Object.keys( this._inputMap["actions"] );
        for( i = 0, l = actionNames.length; i < l; ++ i ) {
          var actionName = actionNames[i];
          inputs = this._inputMap["actions"][actionName];
          if( checkInputs.call( this, inputs ) ) {
            var actionEvent = new Event( actionName );
            actionEvent.dispatch( this.owner );
          }
        }
      }
      if( this._inputMap.hasOwnProperty( "states" ) ) {
        var stateNames = Object.keys( this._inputMap["states"] );
        for( i = 0, l = stateNames.length; i < l; ++ i ) {
          var stateName = stateNames[i];
          inputs = this._inputMap["states"][stateName];
          if( checkInputs.call( this, inputs ) ) {
            this.states[stateName] = true;
            var stateEvent = new Event( stateName );
            stateEvent.dispatch( this.owner );
          } else {
            this.states[stateName] = false;
          }
        }
      }
      this._updateRequired = false;
    }
  }

  function hasInput( input ) {
    if( (this._inputStates.hasOwnProperty( "actions" ) && 
         this._inputStates["actions"].hasOwnProperty( input )) ||
        (this._inputStates.hasOwnProperty( "states" ) && 
         this._inputStates["states"].hasOwnProperty( input )) ) {
      return true;
    } else {
      return false;
    }
  }

  function onKeyDown( event ) {
    if( hasInput.call( this, event.data ) ) {
      this._inputStates[event.data] = true;
      this._updateRequired = true;
    }
  }

  function onKeyUp( event ) {
    if( hasInput.call( this, event.data ) ) {
      this._inputStates[event.data] = false;
      this._updateRequired = true;
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
    onUpdate: onUpdate,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged
  };
  extend( Controller.prototype, prototype );

  return Controller;

});