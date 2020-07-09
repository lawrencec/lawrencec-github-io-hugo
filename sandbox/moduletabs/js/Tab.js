//this won't work as any YAHOO.extend() replaces the protoype by the new superclass unless its in the code
// before the prototype functions are set
/**
 * @class Draggable Tabs
 *
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {HtmlElRef} elTab linked element of the tab
 * @param {HtmlElRef} elPane content element of the tab
 * @param {String} sGroup the group of related Tab objects
 * @param {Boolean} bDraggable denote whether the tab can be dragged
 */
YAHOO.EU.Tab = function(oConfig) {
	this.initTab(oConfig);
}

YAHOO.EU.Tab.prototype.initTab = function(oConfig) {
	/**
	 * @type {HtmlElRef}
	 */
	this.elTab = oConfig.elTab;
	/**
	 * @type {HtmlElRef}
	 */
//	this.elPane = oConfig.elPane;
	this.elPane = this.elTab.getElementsByTagName('div')[0];
	this.elTabLnk = this.elTab.getElementsByTagName('a')[0];
/**
 * @type {String}
 */
	this.id = this.elTab.id;

/**
 * @type {YAHOO.util.CustomEvent}
 */
	
	this.aEvents = [];
	this.aEvents['TabActivated'] = new YAHOO.util.CustomEvent("onActivate");
	this.aEvents['TabDeactivated'] = new YAHOO.util.CustomEvent("onDeactivate");
	
	//add listener
	YAHOO.util.Event.addListener(this.elTabLnk,'click', function(e) { this.activate(); YAHOO.util.Event.stopEvent(e); }, this,true);
	
};




/**
 * Deactivates Tab. Assigns appropiates CSS class and removes 'title' attribute
 * of linked element.
 *
 */
    YAHOO.EU.Tab.prototype.deactivate = function() {
	if (YAHOO.util.Dom.hasClass(this.elPane,YAHOO.EU.ModuleTabs.SHOW_PANE_CLASS_NAME)) {
		YAHOO.util.Dom.replaceClass(this.elPane,YAHOO.EU.ModuleTabs.SHOW_PANE_CLASS_NAME,YAHOO.EU.ModuleTabs.HIDE_PANE_CLASS_NAME);   
  	}
  	else  { 
		YAHOO.util.Dom.addClass(this.elPane,YAHOO.EU.ModuleTabs.HIDE_PANE_CLASS_NAME);
  	}
 	  
	//deactivate tab
	YAHOO.util.Dom.removeClass(this.elTab,YAHOO.EU.ModuleTabs.ACTIVE_TAB_CLASS_NAME);
  	this.elTabLnk.setAttribute('title','');
	//fire event
	if (this.aEvents['TabDeactivated']) {
		this.aEvents['TabDeactivated'].fire(this);
	}
	this.bActive =false;
  };
/**
 * Activates Tab. Assigns appropiates CSS class and sets 'title' attribute
 * of linked element. TODO : i18n
 */
   YAHOO.EU.Tab.prototype.activate = function() {
	if (YAHOO.util.Dom.hasClass(this.elPane,YAHOO.EU.ModuleTabs.HIDE_PANE_CLASS_NAME)) {
		YAHOO.util.Dom.replaceClass(this.elPane,YAHOO.EU.ModuleTabs.HIDE_PANE_CLASS_NAME,YAHOO.EU.ModuleTabs.SHOW_PANE_CLASS_NAME);
	} 
 	else  { 
 		YAHOO.util.Dom.addClass(this.elPane,YAHOO.EU.ModuleTabs.SHOW_PANE_CLASS_NAME);
 	}
	//activate tab
	YAHOO.util.Dom.addClass(this.elTab,YAHOO.EU.ModuleTabs.ACTIVE_TAB_CLASS_NAME);
	this.elTabLnk.setAttribute('title',YAHOO.EU.Tab.ACTIVE_TITLE_TEXT);
	
	//fire event
	if (this.aEvents['TabActivated']) {
		this.aEvents['TabActivated'].fire(this);
	}
	
	
	this.bActive =true;
	
    };

/**
 * Add Listeners to Tab's custom events
 */

YAHOO.EU.Tab.prototype.addListener = function(sEvt,fCallback,oObj,bScope) {
	if (this.aEvents[sEvt]) {
		this.aEvents[sEvt].subscribe(fCallback,oObj || window, bScope || false);
	}
	
	/*if(sEvt == "activated") {
		this.tabActivatedEvent.subscribe(fCallback,oObj,bScope);
	}*/
	
	};
	
	
	YAHOO.EU.Tab.prototype.getTab = function() {
		return this.elTab;
	}
	YAHOO.EU.Tab.prototype.getPane = function() {
		return this.elPane;
	}
	YAHOO.EU.Tab.prototype.toString = function() {
		var elText = this.elTabLnk.firstChild;
		while (elText.nodeType!=3) {
			elText=elText.firstChild;
		}
		return elText.nodeValue;
	}
/**
 * text to set into the active attribute of the tab link of an active tab
 * 
 */
YAHOO.EU.Tab.ACTIVE_TITLE_TEXT	=	"active";