//YAHOO.augment(YAHOO.EU.ModuleTabs, YAHOO.EU.ModuleTabs);
YAHOO.EU.ModuleTabs.prototype.onTabSwapped = function(type,aArgs) { 
	
		var sSourceTabId = aArgs[0].source.id;//tab that is being dragged
		var sTargetTabId = aArgs[0].target.id;//tab that is being dragged onto
		 
		var iSourceIndex = -1;
		var iTargetIndex = -1;

		for(var i=0,oTab;oTab = this.aTabs[i];i++) {
			if (oTab.id == sSourceTabId) {
				iSourceIndex = i;
			}
			if (oTab.id == sTargetTabId) {
				iTargetIndex = i;
			}
		}
		if (iSourceIndex<0) {
			return false;
		}
		var oTmpTab = this.aTabs[iSourceIndex];
		this.aTabs[iSourceIndex] = this.aTabs[iTargetIndex];
		this.aTabs[iTargetIndex] = oTmpTab;
		oTmpTab = null;
		
		
		if(this.aTabs[iSourceIndex]) {	
			if(YAHOO.util.Dom.hasClass(this.aTabs[iSourceIndex].elTab,'last')){
				YAHOO.util.Dom.removeClass(this.aTabs[iSourceIndex].elTab,'last')		
			}
		}	
		if ((this.aTabs[iTargetIndex]==this.aTabs[this.aTabs.length-1])){
			YAHOO.util.Dom.addClass(this.aTabs[iTargetIndex].elTab,'last');
		}
		
		//only activate if not currently active
		if (this.oActiveTab != this.aTabs[iTargetIndex]) {
			this.aTabs[iTargetIndex].activate();
		}
		if (this.aEvents["TabSwapped"]) {
			this.aEvents["TabSwapped"].fire();
		}	
	
};	
YAHOO.EU.ModuleTabs.prototype.init =function() {
	var origInit = YAHOO.EU.ModuleTabs.prototype.init;
	return function(sId,oConfig) {
		origInit.apply(this,[sId,oConfig]);
		var draggableInit=function(sId,oConfig) {
			if (oConfig.bDraggable!=null && oConfig.bDraggable==true) {
				this.aEvents["TabSwapped"] = new YAHOO.util.CustomEvent('TabSwapped',this)
				for (var i=0,aTab;aTab = this.aTabs[i];i++){
					aTab.addListener('TabSwapped',this.onTabSwapped,this,true);
				};
			};
		}
		draggableInit.apply(this,[sId,oConfig]);	
	};
}();	
  	
YAHOO.EU.DraggableTab={};
YAHOO.EU.DraggableTab.prototype = {
	sGroup : '',
	bDraggable : false,

	
	/**
	 * initialises the DragDrop behaviour
	 * 
	 */
	initDD : function() {
		if (this.id) {
			this.init(this.id, this.sGroup,	{ useAbsMath :true,resizeFrame :true,centerFrame : true});
			this.removeInvalidHandleType('A');
			this.initFrame();
			this.setYConstraint(0, 0);	
		}
	
	},
	
	/**
	 * onDrapDrop event handler. Swaps the tab and content elements. Also fires 
	 * tabSwapped event
	 * @param {object} e The event
	 * @param {string}  id id of element.
	 */
	onDragDrop : function(e, id) {
	    var el;
	    if ("string" == typeof id) {
	        el = YAHOO.util.DDM.getElement(id);
	    } else {
	        el = YAHOO.util.DDM.getBestMatch(id).getEl();
	    }

		var n1 = this.getEl().nextSibling || this.getEl();
		while (n1.nodeType !=1 && n1.nextSibling) {
			n1=n1.nextSibling;
		}
	
		var n2 = this.getEl().nextSibling || this.getEl();
		while (n2.nodeType !=1 && n2.nextSibling) {
			n2=n2.nextSibling;
		}
		//swap LI els
		YAHOO.util.DDM.swapNode(this.getEl(), el);
		this.aEvents['TabSwapped'].fire({source:this.getEl(),target:el});
		this.removeDropInvitation(id);
	},

	
	/**
	 * endDrag handler. Executed when drag has ended. Overrides standard endDrag to 
	 * do nothing
	 * @param {object} e The event
	 */
	endDrag : function(e) {
	
	},
	
	
	/**
	 * dragEnter handler. Initiates the drop invitation interaction pattern
	 * @param {object} e The event
	 * @param {string}  id id of element.
	 */
	onDragEnter : function(e, id) {

		var rNode = YAHOO.util.Dom.get(id);
		if (!(YAHOO.util.Dom.hasClass(rNode,'on')))
			this.addDropInvitation(rNode);
	},
	
	/**
	 * dragOut handler. Terminates the drop invitation interaction pattern
	 * @param {object} e The event
	 * @param {string}  id id of element.
	 */
	onDragOut : function(e, id) {
	 	 this.removeDropInvitation(YAHOO.util.Dom.get(id));
	},
	
	/**
	 * Performs the drop invitation interaction pattern. Default is to add a 
	 * paddingTop of 2px but can be overridden.
	 * @param {string}  id id of element.
	 */
	addDropInvitation : function(rNode) {
	 	 YAHOO.util.Dom.addClass(rNode,'drpInvte');
	},
	
	/**
	 * Terminates the drop invitation interaction pattern. Default is to remove  
	 * paddingTop of 2px but can be overridden.
	 * @param {string}  id id of element.
	 */
	removeDropInvitation : function(rNode) {
	  	 YAHOO.util.Dom.removeClass(rNode,'drpInvte');
	}
}

YAHOO.augment(YAHOO.EU.Tab,YAHOO.EU.DraggableTab);

YAHOO.EU.Tab.prototype.initTab =function() {
		var origInit = YAHOO.EU.Tab.prototype.initTab;
		return function(oConfig) {

			origInit.apply(this,[oConfig]);
			
			if (oConfig.bDraggable!=null && oConfig.bDraggable == true) {
				var draggableInit = function (oConfig) {
					//this.id = this.oTab.id;
					this.sGroup = oConfig.sGroup;
					this.bDraggable = oConfig.bDraggable;
					this.aEvents["TabSwapped"] = new YAHOO.util.CustomEvent('onSwapped',this);
					//this.tabSwappedEvent	= new YAHOO.util.CustomEvent("onSwapped");
					if (this.bDraggable && YAHOO.util.DDProxy){
						this.initDD();	
					}
				}
			draggableInit.apply(this,[oConfig]);
			}
		};		
	}();
	

if (YAHOO.util.DDProxy) {
	YAHOO.augment(YAHOO.EU.Tab,YAHOO.util.DDProxy);
}


YAHOO.EU.DraggableTab=YAHOO.EU.DraggableTab.prototype = null;

