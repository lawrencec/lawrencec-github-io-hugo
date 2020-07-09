YAHOO.namespace("YAHOO.NT.UI");
/**
 * History List - renders an interactive panel with which to control interaction
 * history of users
 * 
 * @param {String} elId Id of container to render history list into
 * @param {Object} sGroup Group to monitor
 * 
 * @author Lawrence Carvalho
 * @version 0.1
 */
YAHOO.NT.UI.HistoryList = function (elId,sGroup) {
	this.elCont = document.getElementById(elId);
	this.el = document.createElement('UL');
	this.el.id='hlist';
	this.el.className = 'hlist';
	this.elCont.appendChild(this.el);
	this.sCareTakerGroup = sGroup;
	YAHOO.NT.CaretakerRegistry.subscribe(this.sCareTakerGroup,'stateSaved',this.render,this,true);
	YAHOO.NT.CaretakerRegistry.subscribe(this.sCareTakerGroup,'stateLoaded',this.render,this,true);
	this.elCurrent = null;
	YAHOO.util.Event.on(this.el,'click',this.update,this,true)
	YAHOO.util.Event.on(this.el,'keypress',this.update,this,true)
}

YAHOO.NT.UI.HistoryList.prototype.render = function(oState) {
	var aStates = YAHOO.NT.CaretakerRegistry.getStates(this.sCareTakerGroup);
	while(this.el.hasChildNodes()) {
		this.el.removeChild(this.el.lastChild);
	}
	var sHtml = '';
	for(var i=0,o;o=aStates[i];i++) {
		if (oState!=null && oState._iIndex>=0) {
			var iIndex = oState._iIndex;
			var sClassName = 'class=""';
			if (i>iIndex) {
				sClassName = 'class="'+  YAHOO.NT.UI.HistoryList.CSS_LATER + '"';				
			}
			else if (iIndex == i) {
				sClassName = 'class="'+ YAHOO.NT.UI.HistoryList.CSS_SELECTED +'"';
			}
		}
		sHtml+='<li '+ sClassName +'><a id="' + o.id +'" name="' + o.id +'" href="#'+o.id+'">'+ o.id +'</a></li>';
	}
	this.el.innerHTML = sHtml;
}

YAHOO.NT.UI.HistoryList.prototype.update = function(e) {
	//if not return key
	if ((e.type=="keypress") && (YAHOO.util.Event.getCharCode(e)!=13)) {
		return false;
	}
	var elTarget = YAHOO.util.Event.getTarget(e);
	while(elTarget.nodeName!="A") {
		elTarget = elTarget.firstChild;
	}
	if (elTarget) { 
		if (this.elCurrent && YAHOO.util.Dom.hasClass(this.elCurrent,'sel')) {
			YAHOO.util.Dom.removeClass(this.elCurrent,'sel');
		}
		this.elCurrent = elTarget;
		YAHOO.util.Dom.addClass(this.elCurrent,'sel');
		var sStateId = this.elCurrent.firstChild.nodeValue;
		YAHOO.NT.CaretakerRegistry.loadState(this.sCareTakerGroup,sStateId);
		YAHOO.util.Event.stopEvent(e);
	}		
}

YAHOO.NT.UI.HistoryList.CSS_LATER = 'ghost';
YAHOO.NT.UI.HistoryList.CSS_SELECTED = 'sel';