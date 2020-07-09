YAHOO.namespace("YAHOO.NT.UI");
/**
 * A simple wrapper object around the textarea field.
 * 
 * @constructor
 * 
 * @param {String} elId
 * @param {String} sGroup
 * 
 * @author Lawrence Carvalho
 * @version 0.1
 */

YAHOO.NT.UI.TextUpdate = function(elId,sGroup) {
	this.el = document.getElementById(elId);
	this.sValue = this.el.value;
	//subscribe to caretaker registry
	this.sCareTakerGroup = sGroup;
	YAHOO.NT.CaretakerRegistry.subscribe(this.sCareTakerGroup,'stateLoaded',this.restore,this,true);
	YAHOO.NT.CaretakerRegistry.saveState(this.sCareTakerGroup,'New',{'args':[this.sValue],'execute':this.setText,'oScope':this});
}


/**
 * Updates internal property to the entered text value
 * 
 * @param {String} sValue The new text value
 * 
 */
YAHOO.NT.UI.TextUpdate.prototype.setText = function(sValue) {
		this.sValue = this.el.value = sValue;
}

/**
 * Saves the new text value internally and saves state to caretaker
 */
YAHOO.NT.UI.TextUpdate.prototype.snapshotText = function() {
	if (this.sValue != this.el.value) {
		this.setText(this.el.value);
		//saves value to caretaker
		YAHOO.NT.CaretakerRegistry.saveState(this.sCareTakerGroup,null,{'args':[this.sValue],'execute':this.setText,'oScope':this});
	}
}

//make undoable
YAHOO.augment(YAHOO.NT.UI.TextUpdate,YAHOO.Acts.as.Undoable);