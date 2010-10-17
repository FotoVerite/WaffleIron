/*!
 * WaffleIron JavaScript Library v0.0.1
 * http://github.com/FotoVerite/WaffleIron
 *
 * Copyright 2010, Matthew Bergman
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 *
 * Date: Sat August 13 22:33:48 2010 -0500
 */
(function( window, undefined ) {
  var expando = "Iron" + (new Date).getTime(), uuid = 0, windowData = {};
  
  if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (obj, fromIndex) {
          if (fromIndex == null) {
              fromIndex = 0;
          } else if (fromIndex < 0) {
              fromIndex = Math.max(0, this.length + fromIndex);
          }
          for (var i = fromIndex, j = this.length; i < j; i++) {
              if (this[i] === obj)
                  return i;
          }
          return -1;
      };
  }
  

  Iron = {
    
    createMachine: function(args) {
      machineName = args.name;
      if(machineName == null) return "A machine name must be given";
      states = args.states;
      if(states == null || states.size <= 1) return "A machine must have at least one state";
      transitions = args.transitions;
      initialState = args.initialState || states[0];
      Iron[machineName] = { 
        'states': states, 
        'transitions': transitions, 
        'initialState': initialState,
        'leavingHandler': {},
        'transitionHandler': {},
        'enteringHandler': {}
      };
      return null;
    },
    
    mechanize: function(elem, args) {
      args = args || {};
      elem = Iron.cleanElem(elem);
      muliteMachines = elem.getAttribute("data-machines");
      machineName = args.machine || elem.getAttribute("data-machine");
      if((machineName == null || machineName == "undefined") && (muliteMachines != null || muliteMachines == "undefined")) {
        Iron.multiMechanize(elem, muliteMachines);
        return;
      }
      if(machineName == null || machineName == "undefined") return "machine name must be given or presented in markup";
      if(Iron[machineName] == null) return "machine does not exist";
      state = args.state || elem.getAttribute("data-" + machineName +"-state") || Iron[machineName].initialState;
      if(Iron[machineName].states.indexOf(state) < 0) return "state does not exist";
      Iron.data(elem, machineName, state);
      return null;
    },
    
    multiMechanize: function(elem, machineNames) {
      elem = Iron.cleanElem(elem);
      machineNamesArray = machineNames.split("#");      
      for (i=0;i<machineNamesArray.length;i++)
      {        
        Iron.mechanize(elem, {"machine": machineNamesArray[i]});
      }
    },
    
    addLeavingHandler: function(machineName, state, handler) {
      machine = Iron[machineName];
      machine['leavingHandler'][state] = handler;
    },
      
    addTransitionHandler: function(machineName, transition, handler) {
      machine = Iron[machineName];
      machine['transitionHandler'][transition] = handler;
    },
    
    addEnteringHandler: function(machineName, state, handler) {
      machine = Iron[machineName];
      machine['enteringHandler'][state] = handler;
    },
    
    queryState: function(elem, name) {
      elem = Iron.cleanElem(elem);
      machineName = name || elem.getAttribute("data-machine");
      Iron.data(elem, machineName);
    },
    
    transition: function(elem, machineName, transition) {
      elem = Iron.cleanElem(elem);

      enteringState = Iron.data(elem, machineName);
      machine = Iron[machineName];
      fromState = machine['transitions']['transition']['from'];
      toState = machine['transitions']['transition']['to'];
      if(fromState.indexOf(enteringState) > -1) {
        machine['leavingHandler'][fromState];
        machine['transitionHandler'][transition];
        machine['enteringHandler'][toState];
        Iron.data(elem, machineName, toState);
      }
      else {
        return "State invalide for this transition";
      }
    },
    
    cleanElem: function(elem) {
      if(jQuery == undefined ) return elem;
      else {
        if(elem instanceof jQuery) return elem[0];
        else return elem;
      }
    },
    
    // Data Methods
    
  cache: {},

  expando:expando,

  // The following elements throw uncatchable exceptions if you
  // attempt to add expando properties to them.
  noData: {
  "embed": true,
  "object": true,
  "applet": true
  },

  data: function( elem, name, data ) {
    elem = Iron.cleanElem(elem);
  if (elem.nodeName && Iron.noData[elem.nodeName.toLowerCase()] ) {
  return;
  }

  elem = elem == window ?
  windowData :
  elem;

  var id = elem[ expando ], cache = Iron.cache, thisCache;

  if ( !id && typeof name === "string" && data === undefined ) {
  return null;
  }

  // Compute a unique ID for the element
  if ( !id ) { 
  id = ++uuid;
  }

  // Avoid generating a new cache unless none exists and we
  // want to manipulate it.
  if ( typeof name === "object" ) {
  elem[ expando ] = id;
  thisCache = cache[ id ] = Iron.extend(true, {}, name);

  } else if ( !cache[ id ] ) {
  elem[ expando ] = id;
  cache[ id ] = {};
  }

  thisCache = cache[ id ];

  // Prevent overriding the named cache with undefined values
  if ( data !== undefined ) {
  thisCache[ name ] = data;
  }

  return typeof name === "string" ? thisCache[ name ] : thisCache;
  },

  removeData: function(elem, name ) {
    elem = Iron.cleanElem(elem);
  if ( elem.nodeName && Iron.noData[nodeName.toLowerCase()] ) {
  return;
  }

  elem = elem == window ?
  windowData :
  elem;

  var id = elem[ expando ], cache = Iron.cache, thisCache = cache[ id ];

  // If we want to remove a specific section of the element's data
  if ( name ) {
  if ( thisCache ) {
  // Remove the section of cache data
  delete thisCache[ name ];

  // If we've removed all the data, remove the element's cache
  if ( Iron.isEmptyObject(thisCache) ) {
  Iron.removeData( elem );
  }
  }

  // Otherwise, we want to remove all of the element's data
  } else {
  if ( true ) {
  delete elem[ Iron.expando ];

  } else if ( elem.removeAttribute ) {
  elem.removeAttribute( Iron.expando );
  }

  // Completely remove the data cache
  delete cache[ id ];
  }
  }
  };
})();