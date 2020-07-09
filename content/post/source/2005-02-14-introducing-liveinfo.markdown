---
categories:
- Javascript
date: "2005-02-14T15:46:41Z"
slug: introducing-liveinfo
status: publish
tags:
- Javascript
- liveinfo
- php
- Webservices
title: Introducing LiveInfo..
wordpress_id: "31"
---

Directly evolved from [liveSearch](http://blog.bitflux.ch/wiki/LiveSearch), is a updated version which I'm calling **liveInfo**. As can be seen at [chregu's blog](http://blog.bitflux.ch/) LiveSearch displays live search results _while_ a user enters the search text. You've probably seen [Google Suggest](http://www.google.com/webhp?complete=1&hl=en) which uses the same technology (XMLHTTPRequest).

One of the coolest things about liveSearch is the keyboard navigation where users, when the input field has the focus, the user can navigate through the results using the up and down keys on the keyboard. Because of the [pageSet script](http://www.nodetraveller.com/blog/?p=12) I've done in the past I initally implemented paging functionality into the original liveSearch script including navigating through the pages with the left and right arrow keys.

I then thought about making it easier to implement something like this on various blogging and CMS systems. This led me to using XML to load config data. As a result, liveInfo has a skinnable, plug-in architecture and as its completely object oriented, more than one liveInfo element can be used on a page. The small PHP framework fully supports XMLRPC (using [incutio' XMLRPC library](http://scripts.incutio.com/xmlrpc/)) and SOAP (using [nusoap](http://sourceforge.net/projects/nusoap/) )webservices and should be easily portable to other languages for use in CMS or blogging systems written in that language.

I've also enabled it to work with opera 7+ as well as IE 5+ and Gecko based browsers. It should also work on Safari and other browsers though I haven't been able to test this. Please report any problems and I'll try and fix it. For browsers that support it, it uses document.importNode to display the data so it should also work on those documents that are _true_ XHTML documents.

You can see it running on this blog. The wordpress search liveInfo element is a simple database based system, while the SynTV Search Listings LiveInfo element is a XMLRPC based service which retrieves search result from [SynTV](http://www.syntv.com). The [download ](http://www.nodetraveller.com/downloads/liveInfo.zip)comes with a [demo page](http://www.nodetraveller.com/liveInfo/liveInfoDemo.php) which also includes a Google the search element which uses Google SOAP API.

The complete feature set can be seen in the following list.




  * Support for more browsers


    * Internet Explorer 5+ (Win)


    * Gecko based browsers


    * Opera 7+


    * Should work with IE Mac, Konqueror etc. Needs testing





  * Multiple LiveInfo elements on one page


  * Pageable results (Keyboard navigation via left, right, up and down keys)


  * Support for forms with multiple elements


  * Cacheable Results


  * Dynamic forms


  * Skinnable Results


  * Plugin support (services)


  * Webservices support (via plugins)


I've also put up a [page describing how liveInfo works](http://www.nodetraveller.com/blog/index.php?page_id=34)  but in short all a plugin writer has to do is write a class extending the liveInfo class or subclass and implement two methods. Then write an XML file denoting config values, cache time, form HTML and results HTML . If needed, the writer can provide a css file too. All the user has to do is extract the plugin into the plugins directory and add a few lines in their page.


Technorati Tags: [xmlhttprequest](http://technorati.com/tag/xmlhttprequest) | [liveInfo](http://technorati.com/tag/liveInfo) |
