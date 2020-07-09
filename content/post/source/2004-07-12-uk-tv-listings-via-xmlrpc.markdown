---
categories:
- Webservices
date: "2004-07-12T20:58:58Z"
slug: uk-tv-listings-via-xmlrpc
status: publish
tags:
- tvguide
- Webservices
- xmlrpc
title: UK TV Listings via XMLRPC
wordpress_id: "2"
---

The UK TV Guide for Mambo component is basically a XML RPC client thats talks to the XML RPC server here at nodetraveller.com and renders the data it gets back in a nice way. The component has been released for a few weeks now and I've actually been using the service for a long time before that too so its probably a good time to let people know how to access it....

Because the UK TV Listings webservice is implemented using [XML RPC](http://www.xmlrpc.com/) it means anyone can access it via a XML RPC client. XMLRPC is the technology on which SOAP is based on. This [page](http://www.xmlrpc.com/directory/1568/implementations) shows all the available implementations (servers and clients) using several different technologies so if you haven't dabbled with this kind of thing before, thats a good page to start..

Before we gone on, I'd like to say thanks because service uses the wonderful data provided by Andrew Flegg over at [www.bleb.org](http://www.bleb.org/), without which I'd have no fun working on this project and I'd probably be working on something quite boring...

Anyway, if you want to use it, you're gonna need to know  what it takes and what it gives...

The URI is :** http://www.nodetraveller.com/webservices/tvGuide/tvGuideRPCService.php**


#### Methods :


**ukTvGuide.nodetraveller.com.getChannels(String date)**

- Returns an array of strings, each of which is a name of a channel, for the specified date. The date format is as always dd/MM/YYYY eg . Xmas day is 25/12/2004.

**ukTvGuide.nodetraveller.com.getCategories() **- Returns an array of strings, each of which is a name of a category

**ukTvGuide.nodetraveller.com.getChannelListingsByCategory(String category,String date, String timeslot, Int time)** -  The category parameter should be a value returned by getCategories. Returns an array for each channel requested. Each element within the array represents a listing. The actual structure is shown below.

**ukTvGuide.nodetraveller.com.getChannelListings(Array channels,String date, String timeslot, Int time)**  - The channels array that is passed  should be an array of Strings, each of which is a value returned by getChannels. Returns an array for
each channel requested. Each element within the array represents a listing. The actual structure is shown below.

The valid timeslot values are as follows: **MORN**, **AFTER**, **EVEN**, **LATE **AND **WHATSONNOW. Each timeslot, except for ****WHATSONNOW**, represents a 6 hour timeslot; MORN - 6am - noon, AFTER - noon - 6pm, EVEN - 6pm - midnight and LATE - midnight - 6am.

The **WHATSONNOW **value specifies that only the programme that is currently showing should be returned.

The **time **parameter should pass the time in 24 hour format. If the WHATSONNOW value is not used, then the time parameter is ignored.


#### TV Listing structure


The service returns an array of channels and for each channel requested, there are an array of listings within.

The structure of each listing is as follows :

channel - String - channel name
date - String - date format dd/mm/YYYY
title - String the title of the programme
description - String - the description of the programme
subtitle - String - the subtitle, if any
type - String - some programmes are classified eg Film, Childrens
start - String - start time
end - String- end time
imgUrl - String - the url for the channel img

And that's it.  You can see the actual RPC messages [here.](http://www.nodetraveller.com/webservices/tvGuide/tvRPC_Msgs.php)

If you do make use of it, please let me know as I'd like to know if its been used and how. Some of the projects that I'd like to see would be a flash client to replace my [soap version](http://www.nodetraveller.com/flash/tvGuide/tvGuide.html) and an XUL based client for Mozilla (please!).  A version for mobile phones would be great too. If I had the time I'd start work on these myself because 1) I always like to try new tech and 2) I find experimenting with different UIs fun.
