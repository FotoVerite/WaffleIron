module('WaffleIron');  
test('Iron.data()', function() { 
    elem= $('#succeedTest');
    basicElem = window.document.getElementById('succeedTest')
    equals(Iron.data(elem, "name"), null, "data for an element should be null at the start");  
    Iron.data(elem, "name", "data") ;   
    equals(Iron.data(elem, "name"),"data", "data can be set by the data function");  
    Iron.data(elem, "name", "new-data") ;   
    equals(Iron.data(elem, "name"), "new-data", "data can be overwritten");
    equals(Iron.data(basicElem, "name"), "new-data", "jQuery elements should have data set to the node itself");  
});
test('Iron.createMachine()', function() { 
    equals(Iron.createMachine({'states': ["init", "forward"], 'transitions': {}}), "A machine name must be given", "should return an error message if no machine name is given.");  
    equals(typeof Iron.createMachine({'name': 'aMachine', 'transitions': {}}), "string", "should return an error message if no states are given.");  
    Iron.createMachine({'name': 'aMachine', 'states': ["init", "forward"], 'transitions': {}});
    same(Iron['aMachine'], 
    { 
      "states": [ "init", "forward" ], 
      "transitions": {}, 
      "initialState": "init", 
      "leavingHandler": {}, 
      "transitionHandler": {}, 
      "enteringHandler": {} 
    }, 
    "should create designated machine in the Iron namespace");
    Iron.createMachine({'name': 'aMachine', 'states': ["init", "forward"], 'transitions': {}, "initialState": "forward"});
    same(Iron['aMachine'], 
    { 
      "states": [ "init", "forward" ], 
      "transitions": {}, 
      "initialState": "forward", 
      "leavingHandler": {}, 
      "transitionHandler": {}, 
      "enteringHandler": {} 
    }, 
    "should create designated machine in the Iron namespace with given initial state");  
});
test('Iron.initMachine()', function() { 
  Iron.createMachine({'name': 'aMachine', 'states': ["init", "forward"], 'transitions': {}, "initialState": "forward"});
  Iron.createMachine({'name': 'anotherMachine', 'states': ["plused", "minused"], 'transitions': {}, "initialState": "plused"});
  elem = $('#failTest');
  succeedElem = $('#succeedTest');
  markupElem = $('#markupTest'); 
  mulitElem = $('#multiTest'); 
  badMachineMarkupElm = $("#badMachineMarkupTest");
  badStateMarkupElm = $("#badStateMarkupTest");
  Iron.mechanize(succeedElem, {"machine": "aMachine", "state": "init"});
  equals(typeof Iron.mechanize(elem, {}), "string", "it should throw an error if no machine name is present");
  equals(typeof Iron.mechanize(elem, {"machine": "not-defined"}), "string", "it should throw an error if no machine does not exist");
  equals(typeof Iron.mechanize(elem, {"machine": "aMachine", "state": "undefined"}), "string", "it should throw an error if given a bad state");
  equals(Iron.data(succeedElem, "aMachine"), "init", "it should add a state to the element");
  
  //Testing markup Initialization
  equals(typeof Iron.mechanize(badMachineMarkupElm, {}), "string", "it should throw an error if the machine given in markup is not present");
  equals(typeof Iron.mechanize(badStateMarkupElm, {}), "string", "it should throw an error if the state given in markup is not present");
  Iron.mechanize(markupElem, {"machine": "aMachine"});
  equals(Iron.data(markupElem, "aMachine"), "forward", "it should machinize from data attributes correctly");
  Iron.mechanize(markupElem, {"machine": "aMachine", "state": "init"});
  equals(Iron.data(markupElem, "aMachine"), "init", "it should machinize from data attributes correctly and be able to overwrite the initial sate");
  
  //MultiMechanize
  Iron.mechanize(mulitElem);
  equals(Iron.data(mulitElem, "aMachine"), "forward", "it should machinize from data attributes correctly for the first machine");
  equals(Iron.data(mulitElem, "anotherMachine"), "minused", "it should machinize from data attributes correctly for the second machine");

});