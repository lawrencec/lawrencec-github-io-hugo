YAHOO.namespace("util.EU");
YAHOO.namespace("EU.News");

/**
 * @fileoverview Documentation for the ModuleTabs object
 * @author Lawrence Carvalho lawrence@nodetraveller.com
 * @version 0.3
 */




/**
 * Construct a new ModuleTabs object
 * @class This is the basic ModuleTab class. A ModuleTab is essentially a manager
 * of {@link YAHOO.EU.Tab} objects. It implements the Yahoo <a href="http://developer.yahoo.com/ypatterns/pattern.php?pattern=moduletabs">ModuleTabs</a> 
 * and the <a href="http://developer.yahoo.com/ypatterns/pattern.php?pattern=spotlight">Spotlight</a> design patterns.<br>
 *  
 * @constructor
 * @param {string} sId The id of the container elem
 * @param {object} oConfig A value object = <br>
 {<br>
	bDoHilite	: true,<br>
	oHiliteArgs : {<br>
		from:"A2BCCE",<br>
		to:"ffffff",<br>
		duration:2,<br>
		bTransparent:true,<br>
		fEase:YAHOO.util.Easing.easeOut<br>
	}<br>
	fHilite	: fHilite //defaults to default hiliter<br>
}<br>
 * 
 * @return {object} A reference to the ModuleTab object
 */
 

YAHOO.EU.ModuleTabs = function(sId,oConfig	) {
		/**
	 * The containing element
	 * @type htmlref
	 */
	this.elContainer=null
	
	/**
	 * Flag denoting whether to perform spotlight interaction pattern when 
	 * displaying content
	 * @type boolean
	 */
	 
	 this.bDoHilite=false;
	 
	 /**
	  * Arguments for spotlight pattern
	  * @type object fields={ from=#fff,to:#ff0000}
	  */
	 this.oHiliteArgs=null;
	 
	 /**
	  * Index of current tab
	  * @type integer
	  */
	 this.iCurrTabIndex=-1;
	
	/**
	 * Initialisation function
	 * @param {object} init args
	 */ 
	 
	 /**
	  * Reference to the currently active tab
	  * @type object
	  */
	 this.oActiveTab=null;
	 
	 /**
	  * Unique string denoting the group that a collection of tags belong to. 
	  * Used for drag and drop
	  * @type string
	  */
/*	 sGroup=null,*/
	 
	 /**
	  * Flag denoting whether the tabs have been activated for the first time. 
	  * Used to stop the spotlight when the page is first loaded.
	  * @type boolean 
	  */
	  this.bFirstRun=true;
	  
	  /**
	   * Array of YAHOO.EU.Tabs representing the module's tabs.
	   */
	  this.aTabs=[];
	  this.aEvents=[];
	  this.oConfig=null;
	if (sId) {
		this.init(sId,oConfig);	
	}
};
YAHOO.EU.ModuleTabs.prototype =  {

	  /*evtSwappedTab:null,*/
	 init : function(sId,oConfig) {
		this.oConfig = oConfig;
	   	this.elContainer = YAHOO.util.Dom.get(sId);
		
		for (var sItem in oConfig) {
			if (this[sItem] !== oConfig[sItem]) {
				this[sItem] = oConfig[sItem];
			}
			
		}

	   	if(this.elContainer) {

		
		   	this.aEvents['TabActivated'] = new YAHOO.util.CustomEvent('onTabActivated',this);
		   	this.aEvents['TabDeactivated'] = new YAHOO.util.CustomEvent('onTabDeactivated',this);
		   	this.aEvents['TabAdded'] = new YAHOO.util.CustomEvent('onTabAdded',this);
			this.aEvents['TabRemoved'] = new YAHOO.util.CustomEvent('onTabRemoved',this);
					   	
		   	
		   	//var aTriggers = YAHOO.util.Dom.getElementsByClassName(YAHOO.EU.ModuleTabs.CSS_TAB_HOOK,null,this.elContainer);
		    var aTriggers = this.elContainer.getElementsByTagName('li');
//			var aPanes = YAHOO.util.Dom.getElementsByClassName(YAHOO.EU.ModuleTabs.CSS_PANE_HOOK,null,this.elContainer);
			var elUl = this.elContainer.getElementsByTagName('ul')[0];
//		    var sShowCSSClass  = YAHOO.EU.ModuleTabs.SHOW_PANE_CLASS_NAME;
		    for(var i=0,oTrgr;oTrgr = aTriggers[i];i++) {	    
			   	if (oTrgr.parentNode==elUl) {

			   	oTrgr.id = YAHOO.util.Event.generateId(oTrgr);
//				this.addTab(oTrgr,aPanes[i]);
				this.addTab(oTrgr);
			   	}
		   }


		   this.iCurrTabIndex = (this.iCurrTabIndex==-1) ? 0  : this.iCurrTabIndex;
		
		   aTriggers = aPanes = sShowCSSClass = null;
		   this.activateTab(this.aTabs[this.iCurrTabIndex])
	   	}
	},
	addTab :function(elTab) {
		var oConfig = this.oConfig;
		oConfig.elTab = elTab;
//		oConfig.elPane = elPane;
	   	var oTab = new YAHOO.EU.Tab(oConfig)
	   	oTab.addListener('TabActivated',this.onTabActivated,this,true);
	   	this.aTabs.push(oTab);
	   	if ((this.iCurrTabIndex==-1) && (YAHOO.util.Dom.hasClass(elTab.getElementsByTagName('div')[0],YAHOO.EU.ModuleTabs.SHOW_PANE_CLASS_NAME))) {
	    	oTab.activate();
	    	this.iCurrTabIndex=this.aTabs.length-1;
	    }
	    
	    if (window.location.hash.substring(1).toLowerCase() == oTab.toString().toLowerCase()) {
			this.deactivateTab();
			this.bFirstRun=true;
	    	oTab.activate();
			this.iCurrTabIndex=this.aTabs.length-1;
		}
					
		if (this.aEvents['TabAdded']) {
			this.aEvents['TabAdded'].fire(this.aTabs.length);
		}
		return oTab;	
	},
	removeTab : function(oTab) {
		var iTabIndex = -1;
		for (var i=0,tab;tab=this.aTabs[i];i++) {
			if (oTab.id  == tab.id) {
				iTabIndex = i;
				break;
			}
		}
		if (iTabIndex != -1) {
//			if (this.iCurrTabIndex == iTabIndex) {
//			this.activateTab(this.aTabs[Math.min(this.iCurrTabIndex+1,this.aTabs.length-1)]);
//			}
			elTab = this.aTabs[iTabIndex].elTab;
//			YAHOO.util.Event.purgeElement(elTab);
			elTab.parentNode.removeChild(elTab);
			oTab = this.aTabs.splice(iTabIndex,1);
			if (this.aTabs.length>0) {
				this.aTabs[Math.min(iTabIndex,(this.aTabs.length==0)? 0 : this.aTabs.length-1)].activate();
			}
			
		}
		if (this.aEvents['TabRemoved']) {
			this.aEvents['TabRemoved'].fire();
		}
		return false;
		
	},
	/**
	 * Deactivates Tab and fire deactivate event
	 * @param {string} type The event type
	 * @param {array}  aArgs Argument array.
	 */
	deactivateTab :function() {
		if (this.oActiveTab) {
			this.oActiveTab.deactivate();
			this.oActiveTab == null;
			this.iCurrTabIndex = -1;
			if (this.aEvents['TabDeactivated']) {
				this.aEvents['TabDeactivated'].fire();
			}
			return true;
		}
		else return false;	
	
	},	
	/**
	 * Activates Tab within Moduletab context. Actual Tab has already been activated
	 * but ModuleTab's internal state is updated here. Deactivates current tab and 
	 * executes activate callback
	 * @param {string} type The event type
	 * @param {array}  aArgs Argument array.
	 */
	activateTab : function(oTab) {
		if (oTab && (this.oActiveTab!=oTab)) {
			this.deactivateTab();
		   	this.oActiveTab = oTab;
			//calc index
			for (var i=0,tab;tab=this.aTabs[i];i++) {
				if (oTab.id  == tab.id) {
					this.iCurrTabIndex=i;
					//oTab.activate();
					break;
				}
			}
			if ((this.bFirstRun ==false) && this.bDoHilite) {
		      	this.hilite();
		    }
			this.bFirstRun = false;
			this.manageHeight();
			if (this.aEvents['TabActivated']) {
				this.aEvents['TabActivated'].fire();
			}
		}
	},
	manageHeight : function() {
		var elPane = this.oActiveTab.elPane;
		//get Height of last child
		var oYngest = elPane.lastChild;
		while(oYngest.nodeType!=1) {
			oYngest = oYngest.previousSibling;
		}
		//get difference between last child height and elem height
		var iDelta =  (YAHOO.util.Dom.getXY(elPane)[1] + elPane.offsetHeight) - (YAHOO.util.Dom.getXY(oYngest)[1] + oYngest.offsetHeight);
	
		//new height must be in ems so we convert
		var iNewHeight = YAHOO.util.EU.convertPxToEm(elPane,parseInt(elPane.offsetHeight)-(iDelta*2)); 

		//Direct replacement of height
		YAHOO.util.Dom.setStyle(this.elContainer,'height',iNewHeight+"em");
		
	},
	/**
	 * Callback function, fired when a Tab has been activated (clicked)
	 * @param {string} type The event type
	 * @param {array}  aArgs Argument array. Args contains Tab that has been 
	 * activated
	 */
	onTabActivated : function(type,aArgs) {
		this.activateTab(aArgs[0]);
	},
	
	onTabClosed : function(type,aArgs) {
		this.removeTab(aArgs[0]);		

	},
	
	
	
	/**
	 * Fades background color as a means of highlighting that a change has occured.
	 * any specified callbacks.
	 * @param {int} iIndex The index of the container to display
	 */
	
	hilite : function() {
		if (!YAHOO.util.ColorAnim) {
			return;
		}
		//stop anim and reset bg if another anim is started before the previous has finished
		if (this.oConfig.oHiliteArgs.bTransparent && this.hiliteAnim!=null) {
			this.hiliteAnim.stop(true);
			YAHOO.util.Dom.setStyle(this.hiliteAnim.getEl(),'backgroundColor','');
		}
			this.hiliteAnim = new YAHOO.util.ColorAnim([this.oActiveTab.elTabLnk,this.oActiveTab.elPane],{  
								backgroundColor : 	{ 
									from:this.oHiliteArgs.from,
									to:this.oHiliteArgs.to
								} 
						},this.oHiliteArgs.duration,this.oHiliteArgs.fEase || YAHOO.util.Easing.easeOut);
			this.hiliteAnim.animate();
		
	},
	
	addListener : function(sEvt,fCallback,oObj,bScope) {
		if (this.aEvents[sEvt]) {
			this.aEvents[sEvt].subscribe(fCallback,oObj || window, bScope || false);
		}

	}
};




/**
 * Value to represent the class name that is used as a hook to identify elements
 * that should trigger behaviour
 * @type string
 * @final
 */
YAHOO.EU.ModuleTabs.CSS_TAB_HOOK	=	"tgglr";

/**
 * Value to represent the class name that is used as a hook to identify container
 * elements that are to be hidden/shown
 * @type string
 * @final
 */
YAHOO.EU.ModuleTabs.CSS_PANE_HOOK	=	"tgglt";
/**
 * Value to represent the class name that is used as a hook to identify default 
 * container elements that are to be shown as default. Also applied to current 
 * container that is being shown
 * @type string
 * @final
 */
YAHOO.EU.ModuleTabs.SHOW_PANE_CLASS_NAME	=	"tggltShow";
/**
 * Value to represent the class name that is used as a hook to identify default 
 * container elements that are to be hidden as default. Also applied to current 
 * container that is to be hidden
 * @type string
 * @final
 */
YAHOO.EU.ModuleTabs.HIDE_PANE_CLASS_NAME	=	"tggltHide";

YAHOO.EU.ModuleTabs.ACTIVE_TAB_CLASS_NAME = 'on';

YAHOO.EU.ModuleTabs.CSS_CLOSE_ICON = 'mTabCloseIcon';


