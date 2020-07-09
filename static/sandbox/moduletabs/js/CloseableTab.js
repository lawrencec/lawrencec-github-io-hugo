YAHOO.EU.ModuleTabs.prototype.onTabClosed = function(type,aArgs) {
		this.removeTab(aArgs[0]);		
	};
YAHOO.EU.ModuleTabs.prototype.addTab =function(elTab) {
	var origAddTab = YAHOO.EU.ModuleTabs.prototype.addTab;

	return function(elTab) {
		var oTab = origAddTab.apply(this,[elTab]);
		var closableAddTab=function(elTab) {
				if (this.bCloseable) {
	   				oTab.addListener('TabClosed',this.onTabClosed,this,true);
	   			}
		}
		closableAddTab.apply(this,[elTab]);	
	};
}();
	  	
YAHOO.EU.CloseableTab={};
YAHOO.EU.CloseableTab.prototype = {
	bCloseableTab : false,

	
	isCloseable : function() {
		return this.bCloseable;
	},
	
	setCloseable : function(bCloseable) {
		this.bCloseable = bCloseable;
	},
	close : function() {
		if (this.aEvents['TabClosed']) {
			this.aEvents['TabClosed'].fire(this);
		}	
	},
	
};


YAHOO.augment(YAHOO.EU.Tab,YAHOO.EU.CloseableTab);
YAHOO.EU.Tab.prototype.initTab =function() {
		var origInit = YAHOO.EU.Tab.prototype.initTab;
		return function(oConfig) {

			origInit.apply(this,[oConfig]);
			
			if (oConfig.bCloseable!=null && oConfig.bCloseable == true) {
				var closableInit = function (oConfig) {
					this.bCloseable = oConfig.bCloseable;

					if 	(this.bCloseable) {
						this.elCloseIcon = document.createElement('span');
						YAHOO.util.Dom.addClass(this.elCloseIcon,oConfig.sCloseIconClass);
						YAHOO.util.Dom.setStyle(this.elCloseIcon,'display','none');
						
						this.aEvents['TabClosed'] = new YAHOO.util.CustomEvent("onClosed");
						YAHOO.util.Event.addListener(this.elCloseIcon,'click', function(e) { this.close(); YAHOO.util.Event.stopEvent(e); }, this,true);
						
						this.elTabLnk.appendChild(this.elCloseIcon,this.elPane);
					}
				}
			closableInit.apply(this,[oConfig]);
			}
		};		
	}();

YAHOO.EU.Tab.prototype.activate =function() {
		var origActivate = YAHOO.EU.Tab.prototype.activate;
		
		return function() {

			origActivate.apply(this);
			
				var closableActivate = function () {
						if 	(this.bCloseable) {
							YAHOO.util.Dom.setStyle(this.elCloseIcon,'display','block');

						}
					}
			closableActivate.apply(this);
			}
		}();

YAHOO.EU.Tab.prototype.deactivate =function() {
		var origDeactivate = YAHOO.EU.Tab.prototype.deactivate;
		
		return function() {

			origDeactivate.apply(this);
			
				var closableDeactivate = function () {
						if 	(this.bCloseable) {
							YAHOO.util.Dom.setStyle(this.elCloseIcon,'display','none');
						}
					}
			closableDeactivate.apply(this);
			}
		}();

YAHOO.EU.CloseableTab=YAHOO.EU.CloseableTab.prototype = null;
	




