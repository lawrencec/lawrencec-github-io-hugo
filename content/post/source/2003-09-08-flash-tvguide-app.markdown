---
categories:
- Flash
date: "2003-09-08T14:53:37Z"
slug: flash-tvguide-app
status: publish
tags:
- Flash
- tvguide
- webservice
- Webservices
title: ' Flash TvGuide App'
wordpress_id: "19"
---

Okay, heres the [flash client](http://www.nodetraveller.com/flash/tvGuide/tvGuide.html) (only 47k!) for the TVguide webservice posted recently.

It's quite a fairly simple movie using flash remoting and [amfphp](http://www.amfphp.org/). I used amf to call my tvguide [webservice](http://www.nodetraveller.com/archives/000005.html) via SOAP. Instead of having your swf call a specifc flash service, you call a special service which acts like a proxy to SOAP webservices. This service looks like this..

{{< highlight php "linenos=inline" >}}
// AMFPHP uses by default the PEAR::SOAP
// library, so you need to define in the
// gateway not to use that. In this case
// NuSOAP will be used

// change this based on your amfphp installation
include_once($_SERVER['DOCUMENT_ROOT'] . '/flashservices/app/Gateway.php');
$gateway = new Gateway();
$gateway->usePearSOAP(false);
$gateway->service();
{{< / highlight >}}

You connect to this via NetServices..

{{< highlight php "linenos=inline" >}}
this.netConn = NetServices.createGatewayConnection("http://www.nodetraveller.com/flashservices/services/WSProxy.php");
{{< / highlight >}}

Then you specify the webservice you want by providing the endpoint to the getService method..

{{< highlight php "linenos=inline" >}}
this.service = this.netConn.getService("http://www.nodetraveller.com/webservices/tvGuide/tvGuideService.php?wsdl",this);
{{< / highlight >}}

and then call the webservice method you want...

{{< highlight php "linenos=inline" >}}
this.service.getChannels(paramsObj);
{{< / highlight >}}

The paramsObj is a value object holding any parameters the webservice method expects. When the data comes back you handle it the normal way..

Oh, and I had lots of fun playing about with the datagrid and creating a custom cell for it for the channel logo graphics.

Based on the Model View Architecture which works basically like this for those of you who don't know yet:
The **Model** is an object that handles the remoting stuff and nothing else. It just connects to remote services and handles the data when it comes in. When the data does come in, it fires of an event to the **View**. The **View** is a listener of the **Model** so when the **Mode**l shouts, the **View** jumps. Now when the user interacts with the app, its the **Controller** that decides what to do; call a method on the **Model** or the **View**. Nice and easy...MVC ain't completely perfect but its very useful...

You can see the actionscript files for the **[Model](http://www.nodetraveller.com/flash/tvGuide/tvGuideModel.as.txt)**, **[View](http://www.nodetraveller.com/flash/tvGuide/tvGuideView.as.txt)** or **[Controller](http://www.nodetraveller.com/flash/tvGuide/tvGuideController.as.txt)** or download [here ](http://www.nodetraveller.com/downloads/tvGuide.zip)
