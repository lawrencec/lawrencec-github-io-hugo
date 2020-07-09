---
date: "2005-02-14T15:42:03Z"
slug: liveinfo-how-it-works
status: publish
tags:
- Javascript
- liveinfo
title: LiveInfo - How it works
wordpress_id: "34"
---

LiveInfo is directly evolved from [Livesearch](http://blog.bitflux.ch/wiki/LiveSearch). If you don’t know what liveSearch is, liveSearch allowed users to search a website while still viewing the current page. The original can be seen [here](http://blog.bitflux.ch/wiki/LiveSearch). Wanting to make use of liveSearch for one of my own projects, I proceeded to make some changes from which evolved LiveInfo. LiveInfo is a framework for multiple, real time, skinnable updatable elements within a web page. You can see LiveInfo in action on my blog where there are two LiveInfo elements. One is the blog search and the other is the UK TV listings (SynTV) search on the side.

From the client side, LiveInfo improves upon the original in the following areas:

* Support for more browsers
	* Internet Explorer 5+ (Win)
	* Gecko based browsers
	* Opera 7+
* Should work with IE Mac, Konqueror etc. Needs testing
* Multiple LiveInfo elements on one page
* Pageable results (Keyboard navigation via left, right, up and down keys)
* Support for multiple element forms

Utilising a small backend framework, LiveInfo also provides the following functionality

* Cacheable Results
* Dynamic forms
* Skinnable Results
* Plugin support (services)
* Webservices support (via plugins)

LiveInfo comes with four services. These are as follows:

* Wordpress search - Searches a wordpress blog
* Google Search - A simple Google search. Uses Googles SOAP API.
* SynTV Search - Search UK TV listings using the syntv.com XMLRPC webservice
* SynTV Listings - Displays UK TV listings using the syntv.com XMLRPC webservice

The latest version of liveInfo can be found on my [downloads](http://www.nodetraveller.com/blog/index.php?page_id=24) page.

## Installation

Extract the zip and upload the liveInfo directory to your server. I recommend uploading it to the root directory. Wherever you upload it, edit the liveInfoDir node in the liveInfo/liveInfo.xml file to point to it. The value should be a relative path and must not have an ending /. Any new services should be copied into the services directory and any css files into the css directory. Lastly make sure the cache directory is writable. You’ll need to edit the xml file for each service to suit your install but instructions are given

## How it works
When a user interacts with a form, using either the XMLHttpRequest object or an iframe depending on browser capability, a request is made to the server.
Whatever the results the server returns some XML from which the relevant elements are extracted and displayed.

The xml document that is returned by the server is actually an XML document with a html namespace. The reason for this is that the normal method of using innerHTML to rewrite elements won' work on some browsers that support true XHTML documents (xml files sent with the correct application/xhtml+xml header). The workaround for this is to use the document.importNode method to import nodes from one document into another. Note this compatibilty with true XHTML documents was one of the last features to be put in and hasn’t yet been tested fully on true XHTML documents. I will update when I test more fully.

## Javascript
The javascript for LiveInfo is object-oriented. The liveInfo object is responsible for extracting the form details, showing and navigating through the results. The liveInfo object utilises the xmlClient object which is responsible for contacting the server and returning the results to the liveInfo object.

## The XMLClient object
For browsers that can make use of the XMLHttpRequest object, the xmlClient simply instantiates the XMLHttpRequest object and sends the request through. For those browers that don' have have XMLHttpRequest capability, it uses iframes. Unfortunately, its not easy to detect when a page has finished loading within an iframe so we check for a close tag for a specifed tagName which we call a closureNode (also the root node). When we encounter this, we extract and return the results.

The LiveInfo Object
The LiveInfo object is really quite customisable. There a few other elements besides the actual results to display. There is a title element, a status element to display information, the page controls and other UI elements. The methods available to customise different aspects of the liveInfo page element.

The constructor for the object takes four parameters. The first is the url for the liveinfo.php. The second and third are the service name and operation name respectively. The last parameter is the name or id of the nominated form element that is to trigger the liveInfo display. There can be more than one element that triggers liveInfo but only one can be the nominated element. The nominated element is also checked for text input if it is an text field or that a choice is selected if a select element.

The status text that is displayed on various events (search, error, progress,result) is fully customisable and is based on using a token within a string which is replaced with the required value. This allows a degree of support for other languages. The default token is "?" but this can be changed with the **setStatementToken** method. There are four statements and these can be changed via the **setSearchStatement**, **setErrorStatement**, **setProgressStatement** and **setResultStatement** methods.

Like the original, the results are navigable via the keyboard but this can be turned of via the **setActivateKeys** method.

The amount of time (in secs) the results are shown before automatically disappearing can be changed from the default of 5 seconds using the **setDisplayTimeout** method.

Debugging can be turned on or off via the **setDebug** method

When a user hits the return key, the form defaults to submitting the form to the required page. This behaviour can be turned off with the **setSubmit** method.

We can also add a custom method that is called whenever the liveInfo is triggered but before the request is sent. An example of why we might want to do this is to sent the field of a hidden value to something depending on the value of others form elements. To add this custom method we use the **addOnTriggerMethod** which takes a function as a parameter.

The default validation method in liveInfo simply checks that text is entered in text field elements and that at least one option is selected for select elements. You can replace this with a custom validation method using the **replaceValidateMethod** method. Like addOnTriggerMethod, this takes a function as a parameter.

Examples of calling these methods can be seen below:


{{< highlight js "linenos=inline" >}}
setStatementToken("|");
setSearchStatement("custom searching for msg |");
setErrorStatement("Custom error msg: |");
setProgressStatement("Streaming data...|");
setResultStatement("Displaying items | to | out of |");
setActivateKeys(false);
setDisplayTimeout(10);
setDebug(true);
setSubmit(false);
addOnTriggerMethod(function()  {
			if (document.getElementById("synTVgetSearch_timeslot").value!="WHATSONNOW")
				document.getElementById("synTVgetSearch_time").value=0;
			else {
				date = new Date();
				var hours = date.getHours();
				var mins = date.getMinutes();
				hours = (hours < 10) ? '0' + hours : hours;
				mins = (mins < 10) ? '0' + mins : mins;
				document.getElementById("synTVgetSearch_time").value=hours+""+mins;
			}
		});
replaceValidateMethod(function() {
  //validation js here
});
{{< / highlight >}}

## Framework
The framework is currently coded in PHP but it should be easily ported to other languages.

The plugin architecture is based on an abstract class called liveInfo. This class and all plugins (services) have an associated xml file which defines configuration values. The liveInfo.xml file contains default configuration values for the system. The xml files for services can override the values in the default xml file. For instance, the liveInfoContainer node contains the html (div container) that displays the results and pagecontrols. This can be used by all services or a service can have a liveInfoContainer node in its xml file which is used instead. This is what makes liveInfo skinnable. Every service also has an associated class which is a subclass of the liveInfo class.

The best way to describe how liveInfo is to use an example. The next two sections describe how to put a liveInfo element on a page and how to write a service.

## Putting liveInfo on your page
We'll use the google service as an example. The google service displays results from [Google](http://www.google.com).

Inside the head section of your page or template, put the following bit of php

{{< highlight php "linenos=inline" >}}
include_once('<path>liveInfo.php');
$liveInfoMan = liveInfoManager::getLiveInfoManager();
$liveInfoMan->addService('google','Search');
//output a string of all the css link tags for all the services
echo $liveInfoMan->getClientsCode("css");
//output a string of all the js for all the services
$jsCode  = $liveInfoMan->getClientsCode("js");
{{< / highlight >}}

Replace &lt;path&gt; with the install path of LiveInfo in line 2. Line 3 instantiates the LiveInfoManager object. This object is responsible for managing the liveInfo elements that are on the page. Remember, its possible to have more than one. We add the service that we want via the addService method in line 4. The addService method takes two parameters; serviceName and opName. In this case the serviceName is "google" and the opName is "Search". If you have other services, you would add them here. Each service has a associated css file and line 6 outputs the css link tag for each service. Line 7 stores the javascript object creation code into the $jsCode variable.

Also in the head section we need to load the js files and create the function that is called when the document has loaded. This function creates all the liveInfo objects for each of the services on the page

{{< highlight html "linenos=inline" >}}
<script type="text/javascript" src="[path]js/xmlclient.js"></script>
<script type="text/javascript" src="[path]js/liveinfo.js"></script>
<script type="text/javascript" src="[path]js/onload.js"></script>
<script type="text/javascript"><!--//-->< ![CDATA[//><!--
	function liveInfoServices() {
	     <?php echo $jsCode;	?>
	}
//-->< !]]>
</script>
{{< / highlight >}}

Replace [path] with the path of your liveinfo install. The $jsCode is the javascript that inits the liveInfo objects for each element on the page. It would look like this :

{{< highlight js "linenos=inline" >}}
wordpressSearch = new liveInfo("http://www.nodetraveller.com/liveInfo/liveInfo.php","wordpress","Search","s");
wordpressSearch.init();
wordpressSearch.setSubmit(true);
{{< / highlight >}}

Now within your page or template, wherever you want, you can output the form and result HTML with the following:

{{< highlight php "linenos=inline" >}}
echo $liveInfoMan->getClientCode("google","Search","form");
echo $liveInfoMan->getClientCode("google","Search","resultsHTML");
{{< / highlight >}}

And that's it. The actual form and html is actually defined in the service xml, which is what we'll look at next.

## A Service
Default values are stored in liveInfo.xml

{{< highlight xml "linenos=inline" >}}
<liveInfo>
        <liveInfoDir>/liveInfo</liveInfoDir>
	<cssLink>http://yourdomain.com/liveInfo/css/liveInfo.css</cssLink>
        <cacheTTL>3600</cacheTTL>
	<liveInfoContainer>
	<![CDATA[
	<div id="[<infoName>][<opName>]_liveInfo" class="liveInfo" >
	<div id="[<infoName>][<opName>]_liveInfoStatus" class="liveInfoStatus">
		<a href="javascript:void(0)" id="[<infoName>][<opName>]_liveInfoClose" class="liveInfoClose" onclick="[<infoName>][<opName>].hideLiveInfo();" title="Close">X</a>
		<div id="[<infoName>][<opName>]_liveInfoPageControls" class="liveInfoPageControls">
			<a id="[<infoName>][<opName>]_liveInfoNext"  class="liveInfoNext" onclick="[<infoName>][<opName>].next()" title="Next results" >&raquo;</a>
			<a id="[<infoName>][<opName>]_liveInfoPrev" class="liveInfoPrev" onclick="[<infoName>][<opName>].previous();" title="Previous results" >&laquo;</a>
		</div>
		<div id="[<infoName>][<opName>]_liveInfoTitle" class="liveInfoTitle">[<infoName>]</div><div id="[<infoName>][<opName>]_liveInfoStatusText" class="liveInfoStatusText"></div>
	</div>
	<div id="[<infoName>][<opName>]_liveInfoResults" class="liveInfoResults"></div>
</div>]]>
	</liveInfoContainer>
</liveInfo>
{{< / highlight >}}

The liveInfoDir points to the install directory of liveInfo. This is used by the js liveInfo object. The cacheTTL node defines the default time in seconds to cache the service. This can be overridden by a service. The cssLink points to the location of the default css stylesheet. This can also be overridden by a service. Also overrideable by a service is the liveInfoContainer node. This defines the HTML that is displayed when results are shown. The [&lt;infoname&gt;][&lt;opname&gt;] is used as placeholders and is replaced by the serviceName and opName in the final output on a page eg googleSearch. The structure of this node can change but note that the event handlers, id and class names should be the same. You should be able to add new elements also.

The google service xml looks like this:

{{< highlight xml "linenos=inline" >}}
<liveInfoProvider>
	<name>Google</name>
	<description>you need a description?!</description>
	<link>http://www.google.com</link>
	<cacheTTL>3600</cacheTTL>
	<key>Use your own google key</key>
	<q></q>
	<start></start>
	<maxResults>10</maxResults>
	<filter>true</filter>
	<safeSearch>false</safeSearch>
	<restrict></restrict>
	<lr></lr>
	<liveInfoOperations>
		<liveInfoOperation>
			<liveInfoOperationName>Search</liveInfoOperationName>
			<liveInfoDescription>Get Search Results</liveInfoDescription>
			<client>
				<liveInfoForm>
					<![CDATA[<form onsubmit="return [<infoName>][<opName>].submit()"  id="[<infoName>][<opName>]_liveInfoForm" class="[<infoName>][<opName>]_liveInfoForm" method="get" action="./">
<input type="text" id="googlesearch" size="15" onkeypress="[<infoName>][<opName>].execute()" />
</form>]]>
				</liveInfoForm>
				<liveInfoJS>
				<![CDATA[
		[<infoName>][<opName>]= new liveInfo("[<liveInfoURL>]","[<infoName>]","[<opName>]","googlesearch");
[<infoName>][<opName>].init();
]]>
				</liveInfoJS>
				<cssLink>http://yourdomain.com/css/googleLiveInfo.css</cssLink>
			</client>
		</liveInfoOperation>
	</liveInfoOperations>
</liveInfoProvider>
{{< / highlight >}}

The name, description and link nodes are there for informational purposes about the service. On line 6 we can see that this service is set to cache for only 15 mins. The **key**, **q**, **lr**, **start**, **maxresults**, **filter**, **safesearch** and **restrict** nodes are google webservice parameters. If a service needs service specific config values, they can be defined here in the xml and the service will pick it up.

Now every service has at least one operation. Here we define one called search. Google's webservice also provides a spelling operation. If we wanted to, we would have another **liveOperation** node which defines the information needed for that operation. The important nodes here are the **liveInfoOperationName** and the **client** nodes. The **liveInfoOperationName** identifies the operation and is used by the **liveInfoManager** to load up the correct service operation. The **client** node has a **liveInfoForm** node which is where the form for the service is defined. To note here is the keypress event handler event for the element that is to trigger the liveInfo. This event can be used on other elements if the form has more than one element. The **liveInfoJS** node contains the javascript code to create the liveInfo js object. Any parameters or customisation is set here. See the Javascript section for more information. Finally the **cssLink** node defines the link to the stylesheet for this service.

It's possible that a form element is dynamic. For instance, a select element's options are loaded from the database. In this case, we can specify a method to call which will output the element. To do this we put the following in the relevant place. An example

{{< highlight xml "linenos=inline" >}}
<opCall>getDays</opCall>
{{< / highlight >}}

When the service encounters the node, it calls the getDays method and inserts the return value in the form

## The PHP
An abstract class called liveInfo defines the interface which any service must implement. It also provides some helper methods for outputting xml, debug info and caching methods. The constructor looks like this.

{{< highlight php "linenos=inline" >}}
class googleLiveInfo extends soapLiveInfo {
	var $serviceName = "google";

	function googleLiveInfo($opName=null) {
		parent::soapLiveInfo();
		$this->opName = $opName;
		parent::initialise();
	}
{{< / highlight >}}

The Google webservice is a soap service. Besides the liveInfo abstract class, the liveInfo framework is supplied with two subclasses called rpcLiveInfo and soapLiveInfo. These subclasses include the required library for using XMLRPC or SOAP. So if your service uses XMLRPC or SOAP you should subclass one of these methods. If not, then you should just subclass the liveInfo class. Its important that you do this and call the parent constuctor (see line 5). Calling the parent constructor, loads the default liveInfo.xml then calling the initialise() method, loads the service's xml file initialising the object with the data in the xml file

{{< highlight php "linenos=inline" >}}
function getLiveInfo($query) {
		if ($this->debug)
			$this->dumpVariable('RECEIVED QUERY PARAMS: ',$query);
		# Set google parameters
		$parameters = array(
		  'key'=>$this->key,
		  'q' => $query['googlesearch'],
		  'start' => '0',
		  'maxResults' => '10',
		  'filter' => $this->filter,

		  'restrict' => $this->restrict,
		  'safeSearch' => $this->safeSearch,
		  'lr' => $this->lr,
		);
		$cache = $this->getCache($this->serviceName.$this->opName);
		switch($this->opName) {
			case "Search":
				//if not using a cache use this line
                                // $result = $this->getSearch($parameters);
                                $result = $cache->call(array(&$this,'getSearch'),$parameters);
				break;
		}
		if ($this->debug) {
			$this->dumpVariable('LIVEINFO RESULT (XML) : ',$result);
		}
		if($this->debug)
			return $this->packageResult($this->packageDebug($this->debugStr).$result);
		else return $this->packageResult($result);
}
{{< / highlight >}}

When a request from a liveInfo page element, its the getLiveInfo that is called. If cache is needed we get a cache object by calling the getCache method, then we call the getSearch method via the cache object' call method. If a cache is not needed, then we would just call the getSearch method directly. Then the results are packaged for return. Note also debug data is also added if debug mode is on. The getSearch method sets up the SOAP call, contacts the webservice and passes the results to the renderResults method which returns them nicely formated into an unordered list.

{{< highlight php "linenos=inline" >}}
function renderResults($results) {
		if ($this->debug)
			$this->dumpVariable('LIVEINFO RESULTS (RAW) : ',$results);
		$channels = $results;
		$html ='<ul class="liveResults">';
	foreach ( $results['resultElements'] as $result ) {
	    $title = $result['title'] ? $result['title'] : 'no title';
	    //opera 7 has problems with brs in snippet field (??)
	    $snippet = str_replace("<br>","",$result['snippet']);
	    $url = str_replace('&','&amp;',$result['URL']);
	    $html .='<li class="liveInfoItem"><a href="'.$result["URL"].'" target="_blank" title="'.$url.'"><strong>'.$title.'</strong><br />'.$snippet.'</a></li>';
  	}
	$html.="</ul>";
	return $html;
	}
{{< / highlight >}}

The resulting document for a search for "news" looks like this : (debug mode turned off)

{{< highlight xml "linenos=inline" >}}
html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<liveInfo>
	<liveInfoResult id="liveInfoResult">
		<ul class="liveResults"><li class="liveInfoItem"><a href="http://www.cnn.com/" target="_blank" title="http://www.cnn.com/"><strong>CNN.com</strong><br /><b>...</b> MORE <b>NEWS</b>, Most Popular. <b>...</b> BUSINESS at CNN/Money, Business <b>News</b>. STOCK/FUND QUOTES: enter symbol. MARKETS: 5:16pm ET, 02/03. DJIA, -3.69, 10,593.10, -0.03. <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://news.bbc.co.uk/" target="_blank" title="http://news.bbc.co.uk/"><strong>BBC <b>NEWS</b> | <b>News</b> Front Page</strong><br />Visit BBC <b>News</b> for up-to-the-minute <b>news</b>, breaking <b>news</b>, video, audio and feature stories. BBC <b>News</b> provides trusted World and UK <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://www.foxnews.com/" target="_blank" title="http://www.foxnews.com/"><strong>FOXNews.com</strong><br /><b>...</b> Jacko Talks Neverland. Michael Jackson tells FOX <b>News</b> about the &#39;bliss&#39; of his home, says he&#39;s a target. LATEST HEADLINES. ONLY ON FOX. <b>...</b> FOX <b>NEWS</b> 24/7. <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://abcnews.go.com/" target="_blank" title="http://abcnews.go.com/"><strong>ABC <b>News</b>: Online <b>news</b>, breaking <b>news</b>, feature stories and more</strong><br />ABC <b>News</b> HomeABC <b>News</b> Home. February 3, 2005 | Get Your Local <b>News</b> and Weather. Search ABC <b>News</b> Search the Web. <b>...</b> ABC <b>News</b> Now. View Schedule. Subscribe Now <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://news.google.com/" target="_blank" title="http://news.google.com/"><strong>Google <b>News</b></strong><br />Google <b>News</b>. <b>...</b> Rudy T Runs Himself Out of LA WOAI Los Angeles Daily <b>News</b> - Xinhua - WTNH - People&#39;s Daily Online - all 1,228 related ? BBC Sport. <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://www.cbsnews.com/" target="_blank" title="http://www.cbsnews.com/"><strong>CBSNews.com</strong><br />Home US Iraq World Politics SciTech HealthWatch Entertainment New: Business Opinion FREE CBS <b>News</b> Video. CBSNews.com, <b>...</b> All Evening <b>News</b>, All Early Show. <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://news.yahoo.com/" target="_blank" title="http://news.yahoo.com/"><strong>Yahoo! <b>News</b> - Front Page</strong><br />Personalize <b>News</b> Home Page. Yahoo! <b>News</b> Thu, Feb 03, 2005, <b>...</b> Reuters Video, Stocks Edge Lower; Amazon Weighs (Reuters Video). <b>News</b> via RSS. Top <b>News</b>. Top Stories. <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://www.wired.com/" target="_blank" title="http://www.wired.com/"><strong>Wired <b>News</b></strong><br />Read our design notes for details. Welcome to Wired <b>News</b>. Skip <b>...</b> Advertisement. updated 2:00 am Feb. 3, 2005 PT <b>News</b> Archive. Peekaboo <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://www.msnbc.msn.com/" target="_blank" title="http://www.msnbc.msn.com/"><strong>MSNBC - MSNBC Front Page</strong><br /><b>...</b> MSNBC <b>News</b>, Alerts | Newsletters | RSS | Help, MSNBC Home. MSNBC TV. <b>News</b>. Business. Sports. Entertainment. Tech / Science. Weather. Health. Travel. Blogs Etc. <b>...</b>  </a></li>
			<li class="liveInfoItem"><a href="http://www.usnews.com/usnews/home.htm" target="_blank" title="http://www.usnews.com/usnews/home.htm"><strong>USNews.com: Home</strong><br /><b>...</b> dietary guidelines Best Hospitals: Top medical centers Honor Roll: 14 excellent hospitals Find a hospital: Comprehensive directory Heart Guide: <b>News</b> and tools <b>...</b>  </a></li>
		</ul>
	</liveInfoResult>
</liveInfo>
</html>
{{< / highlight >}}

If there were no results, the liveInfoResult would be replaced by a liveInfoNoResult node. If there was a fault of some sort, then the liveInfoResult node would be replaced by a liveInfoFault node.

## Debugging
If debugging is turned on, then liveInfo outputs the debug output that is received form the server to an element that is identified by the id of serviceName+opName+_liveInfoDebug giving (for wordpress search) wordpressSearch_liveInfoDebug. You can also do some direct checking by inserting the liveInfo url into your browser with the required parameters. For example, for wordpress, the url would be [path to liveInfo]/liveInfo/liveInfo.php?liveInfo=wordpress&opName=Search&s=rpc

## Todo:
Streamline debug

Make install easier with less or ideally no editing of xml files needed
