YAHOO.namespace("YAHOO.NT");
/**
 * Generic Undo
 * Memento (saves states)
 * CaretakerRegistry (create memento objects. Allows reuse of existing objects so different aspects of UI can have use same Memento.
 * Example : Photoshop : Main Doc stores state into memento. History module needs access too so it can read and display states in list and also fire off Doc.restore();
 */
/**
 * Singleton Factory class for Caretaker objects. Provides clients access to 
 * Caretaker objects. 
 * 
 * @author Lawrence Carvalho
 * @version 1.0
 */

YAHOO.NT.CaretakerRegistry = function() {
	aCaretaker = [];
	/**
	 * Utility function to parse function arguments for use with Caretaker methods
	 * 
	 * @param {Array} aArgs
	 */
	_getArgs= function (aArgs) {
		aArgs.shift = Array.prototype.shift;
		return aArgs.shift();
	};
	/**
	 * Retrieves an existing Caretaker object or creates a new one if specified 
	 * group doesn't already exist
	 * 
	 * @param {String} sGroup The name of the group to retreive (or create) the Caretaker in
	 * @return {Object} Caretaker object 
	 */
	get = function(sGroup) {
			 if (aCaretaker[sGroup]){
		           return aCaretaker[sGroup];
		   }
		   else {
		       return aCaretaker[sGroup] = new YAHOO.NT.Caretaker();
		   }
		};
	return {
		
	  /**
	   * Loads the state using the specified caretaker group and the optional state 
	   * id
	   * 
	   * @param {String} sCId Caretaker group id
	   * @param {String} sSId (optional) State id
	   * 
	   * @return {Object} A state
	   */
		loadState : function(sCId,sSId) {
			var args = Array.prototype.slice.call(arguments);
			var oCareTaker = get(args.shift()); //sCId
			if (oCareTaker) {
				 return oCareTaker.loadState.apply(oCareTaker,args)
			}
			return null;
		},
		/**
		 * Saves the state into the specified caretaker group with the optional state 
		 * id. 
		 * 
		 * @param {String} sCId Caretaker group id
	   * @param {String} sSId (optional) State id
	   * @param {Object} oState The state to save
		 */
		saveState : function(sCId,sSId,oState) {
			var args = Array.prototype.slice.call(arguments);
			var oCareTaker = get(args.shift()); //sCId
			if (oCareTaker) {
				 return oCareTaker.saveState.apply(oCareTaker,args)
			}
			return null;
		},
		/**
		 * Retrieves the status of the specified caretaker. The status denotes
		 * whether the caretaker is undoable or redoable, both or neither.
		 * 
		 * @param {String} sCId Caretaker group id
		 * @return {Integer} Caretaker Status
		 */
		getStatus : function(sClId) {
			var oCareTaker = get(sClId); //sCId
			if (oCareTaker) {
				 return oCareTaker.getStatus();
			}
			return null;
		},
		/**
		 * Retrieves all the states of the specified caretaker group
		 * 
		 * @param {String} sCId Caretaker group id
		 */
		getStates : function(sClId) {
			
			var oCareTaker = get(sClId); //sCId
			if (oCareTaker) {
				 return oCareTaker.getStates();
			}
			return null;
		},
		/**
		 * Subscriber method for the caretaker's custom events.
		 * 
		 * @param {String} sCId Caretaker group id
		 * @param {String} sEventName Event to subscribe to
		 * @param {fn} fn callback function
		 * @param {Object} oScope Object to use as scope for callback
		 * @param {Boolean} bScope Set to true to use oScope for scope
		 */
		subscribe : function(sCId,sEventName,fn,oScope,bScope) { 
			var args = Array.prototype.slice.call(arguments);
			var oCareTaker = get(args.shift()); //sCId
			if (oCareTaker) {
				 return oCareTaker.subscribe.apply(oCareTaker,args);
			}
			return null;
		}
	}
}();


/**
 * Caretaker object manages the states of an object
 * 
 * @constructor
 * 
 * @implements YAHOO.util.EventProvider
 * @author Lawrence Carvalho
 * @version 1.0
 */
YAHOO.NT.Caretaker = function() {
   this.aStates = [];
	 this.aHash = [];
   this.iNumStates = this.iCurrentStateIndex = this.iUniqueId = 1;// do we need? yes in case no id is given, we need to increment default id eg 'History';	 
	 this.aEvts=[];
	 
	 this.createEvent('stateSaved');
	 this.createEvent('stateLoaded');
}

/**
 * Loads the state using the optional state id
 * 
 * If no stateid is specified then the last state is returned (undo)
 * If a stateid is specified and is a string then the state with that id is 
 * returned .
 * If a stateid is specified and is equal to 0 then the first state is returned 
 * (revert)
 * If a stateid is specified and is equal to -1 then the next state is returned 
 * (redo) 
 *
 * @param {String} id (optional) State id
 * 
 * @return {Object} A state
 */	   
YAHOO.NT.Caretaker.prototype.loadState = function(id) {
	 var oState = null
	 if (arguments.length==0) { 
			this.iCurrentStateIndex=Math.max(0,this.iCurrentStateIndex-1);
			oState = this.aStates[this.iCurrentStateIndex].state;
	 }
	 else if (id!=null && isNaN(id)) { //string 
			 if (this.aHash[id]>=0) { 
			 		 this.iCurrentStateIndex = Math.max(0,this.aHash[id]-1);
					 oState = this.aStates[this.iCurrentStateIndex].state;
       }
       else {return false; }
   }
   else if (id==0) { //revert
	 		this.iCurrentStateIndex=0;
			this.aStates = [this.aStates[this.iCurrentStateIndex]];	
			oState = this.aStates[this.iCurrentStateIndex].state;
	 }
	 else if (id==-1){ //redo
			 this.iCurrentStateIndex=Math.min(this.iCurrentStateIndex+1,this.aStates.length-1);
			 oState = this.aStates[this.iCurrentStateIndex].state;       
	}
	oState._iIndex = this.iCurrentStateIndex;
	//oState._allStates = this.aStates;
	oState._sStatus = this.getStatus();
	this.fireEvent('stateLoaded',oState);
	return oState;
}
/**
 * Saves the specified state with the optional state id. If no id is specified,
 * then a unique id is given.
 * 
 * @param {String} id
 * @param {Object} oState
 */
YAHOO.NT.Caretaker.prototype.saveState = function(id,oState) {
	 id = (id) || 'History'+ (this.iUniqueId++);
	 if (this.iNumStates>1 && (this.iCurrentStateIndex!=(this.iNumStates-2))) { //then a change has happened while within history list ie not at end
		this.aStates.splice((this.iCurrentStateIndex+1),this.aStates.length-this.iCurrentStateIndex)
		this.iNumStates = this.aStates.length+1;
		this.aHash=[];
		//rebuild Hash
		for (var i=0,o;o=this.aStates[i];i++) {
			this.aHash[o.id] = (i+1);
		}
	 } 
	 this.aStates.push({'id':id,'state' : oState});
	 this.aHash[id] = this.iNumStates;
	 this.iCurrentStateIndex=this.iNumStates-1;
	 this.iNumStates++;
	 oState={};
	 oState._iIndex = this.iCurrentStateIndex;
	 //oState._allStates = this.aStates;
	 oState._sStatus = this.getStatus();
	 this.fireEvent('stateSaved',oState);
}
/**
 * Retrieves the status of the caretaker. The status denotes
 * whether the caretaker is undoable or redoable, both or neither.
 * 
 * @return {Integer} Caretaker status
 */
YAHOO.NT.Caretaker.prototype.getStatus = function() {
	var iNumStates = this.aStates.length;
	if (this.iCurrentStateIndex==0 && (iNumStates==1)){ //NOT UNDOABLE OR REDOABLE
	 	return YAHOO.NT.Caretaker.STATUS_NOT_UNDOABLE_OR_REDOABLE;
	 }
	else if ((this.iCurrentStateIndex==(iNumStates-1))){ //ONLY UNDOABLE
	 	return YAHOO.NT.Caretaker.STATUS_UNDOABLE;
	 }
	 else if (this.iCurrentStateIndex==0 && (iNumStates > 1)){ //ONLY REDOABLE
	 	return YAHOO.NT.Caretaker.STATUS_REDOABLE;
	 }
	 else { //UNDOABLE AND REDOABLE
	 	return YAHOO.NT.Caretaker.STATUS_UNDOABLE_AND_REDOABLE;
	 }
}
/**
 * Retrieves all the saved states of the caretakee object 
 * 
 * @return {Array} All the saved states 
 */
YAHOO.NT.Caretaker.prototype.getStates = function() {
	return this.aStates;
}

YAHOO.NT.Caretaker.STATUS_REDOABLE = 1;
YAHOO.NT.Caretaker.STATUS_UNDOABLE = 2;
YAHOO.NT.Caretaker.STATUS_NOT_UNDOABLE_OR_REDOABLE = 3;
YAHOO.NT.Caretaker.STATUS_UNDOABLE_AND_REDOABLE = 4;

YAHOO.augment(YAHOO.NT.Caretaker,YAHOO.util.EventProvider);
