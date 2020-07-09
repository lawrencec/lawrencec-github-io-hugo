YAHOO.namespace('Acts.as.Undoable');
/**
 * Adds Undoable functionality to your objects.
 * 
 * 
 */
YAHOO.Acts.as.Undoable = function() {}
YAHOO.Acts.as.Undoable.prototype = {
	sCareTakerGroup :null,
	/**
	 * redo changes
	 */
	undo : function() {
		YAHOO.NT.CaretakerRegistry.loadState(this.sCareTakerGroup);
	},
	
	/**
	 * Redo changes
	 */
	redo : function() {
		YAHOO.NT.CaretakerRegistry.loadState(this.sCareTakerGroup,-1);
	},
	
	/**
	 * Revert to initial text value
	 * 
	 */
	revert : function() {
		YAHOO.NT.CaretakerRegistry.loadState(this.sCareTakerGroup,0);
	},
	
	/**
	 * 
	 * 
	 * @param {Object} oState Object containing callback to call with specified 
	 * arguments and scope. Fields are :
	 * 
	 * {Array} 	oState.args Array of arguments to call callback with
	 * {fn}  		oState.execute Calblack function
	 * {Object}	oState.oScope Object to use as scope for callback
	 */
	restore : function(oState) {
	 if (oState.execute) {
	 		oState.execute.apply(oState.oScope,oState.args);	
	 }
	}
}