YAHOO.namespace('YAHOO.Abstract.Aspect');

/**
 * @author Lawrence Carvalho (03-Jan-2007)
 * @version 0.1
 */

/**
 * @classDescription Decorates specified methods with aspect methods - before,after,around 
 * @constructor Sets up default aspects (before,after,around)
 * @param {Object} oTarget - target object to decorate
 * @param {String} sAspect - name of aspect method 
 * @param {String} sMethod - name of method to apply aspect to
 * @param {Function} fAspect - aspect method to apply
 * 
 * Usage notes : 
 * YAHOO.Abstract.Aspect.aspect(oTarget,'after','methodName',function() { this.var = null; });
 */
 
YAHOO.Abstract.Aspect = function() {
	aAspects = [];
	aAspects["before"]=function(oTarget,sMethodName,fn) {
		var fOrigMethod = oTarget[sMethodName];
	    
		oTarget[sMethodName] = function() {
	      fn.apply(oTarget, arguments);
		  return fOrigMethod.apply(oTarget, arguments);
	    }; 
	};	
	//after
	aAspects["after"]=function(oTarget,sMethodName,fn){
		var fOrigMethod = oTarget[sMethodName];
	    oTarget[sMethodName] = function() {
			var rv = fOrigMethod.apply(oTarget, arguments);
	      	return fn.apply(oTarget, [rv]);
	    };
	};	
	//around
	aAspects["around"]=function(oTarget,sMethodName,aFn){
		var fOrigMethod = oTarget[sMethodName];
		oTarget[sMethodName] = function() {
			  if (aFn && aFn.length==2) {
				aFn[0].apply(oTarget, arguments);
				var rv = fOrigMethod.apply(oTarget, arguments); 
				return aFn[1].apply(oTarget, [rv]);
			  }
			  else {
				return fOrigMethod.apply(oTarget, arguments);
			  }
			  
			};
    };
	return {		
		advise : function(oTarget,sAspect,sMethod,fAdvice) { 
			if (oTarget && sAspect && sMethod && fAdvice && aAspects[sAspect]) {
				//decorate specified method
				aAspects[sAspect](oTarget,sMethod,fAdvice); 
			}
			return oTarget;
		}
	}
}();