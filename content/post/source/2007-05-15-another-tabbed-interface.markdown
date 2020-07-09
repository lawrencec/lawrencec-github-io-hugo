---
categories:
- Javascript
date: "2007-05-15T21:15:27Z"
slug: another-tabbed-interface
status: publish
tags:
- AOP
- aspect oriented programming
- Javascript
- Tabs
- widget
- yui
title: Another Tabbed Interface
wordpress_id: "50"
---

This is a rather belated post and is sort of a continuation of my last post about [Aspect Oriented Programming](/Javascript/js-fun/). I've made yet another tabbed interface widgety thing (like the 'tubes needs another one) that uses AOP to add additonal features. A tabbed interface widget provided a nice problem for me to experiment with AOP. You can see the [results](/sandbox/moduletabs/standard.html) which allows tabs in a widget to be draggable and closeable too. Built with a dash YUI goodness of course.






The actual 'problem' wasn't actually anything to do with the core behaviour of a tabbed interface. After all, the mechanics of such a problem is pretty simple; hide one element, show another. No, I wanted to make the tabs draggable and closeable, much like an OS tab that can be seen in Firefox or Eclipse. Using the [YUI](http://developer.yahoo.com/yui/) library, making the tab draggable is relatively straight forward but it did result in some duplicated code which I didn't like. That was the 'problem'.







Essentially, it was like this: My original code had two objects, the YAHOO.NT.TabsModule and YAHOO.NT.Tab. The TabsModule was the managing object for each of the Tab objects. If I wanted to make it draggable I need Tab to extend YAHOO.util.DDProxy. No problem there except of course there has to be additonal logic in the Tab object to do so and also manage the dragging 'n' dropping. Subclassing Tab would have worked but again code would be duplicated in those methods that needed the changes. But then you get into the trouble of class trees.  For instance, DraggableTab subclasses Tab and so does Closeable Tab. But what if I wanted a Draggable and Closeable Tab? That'd be a little trickier to do while still maintaining some sense of clean code.






The rather clean solution turns out to be AOP. Quickly, AOP allows us to easily add new code to existing code without editing it. It does this by essentially wrapping the original code so that the new code runs 'before','after' or 'around the original code. These are the so called 'aspects'. So it turns out that to make a Tab draggable I'd need to add new methods (my own as well as YAHOO.util.DDProxy) as well as fiddle with a few existing Tabs methods:






Here I've outlined which methods have been aspected (is that the right term?) and what the new code adds to the original.







  * YAHOO.NT.TabsModule.init is after aspected by both YAHOO.NT.DraggableTabs and YAHOO.NT.CloseableTabs - both adds a new CustomEvent which listens to all existing Tab instances



  * YAHOO.NT.TabsModule.selectTab is before aspected by YAHOO.NT.CloseableTabs - adds logic to detect to close tab.





  * YAHOO.NT.Tabs.initTab is after aspected by both YAHOO.NT.DraggableTabs and YAHOO.NT.CloseableTabs - adds new configuration logic, custom event creation





  * YAHOO.NT.Tabs.activateTab and YAHOO.NT.Tabs.deactivateTab are both after aspected by YAHOO.NT.CloseableTabs - adds logic to show/hide close icon.









Though, AOP in Javascript certainly isn't new, I really like the relatively clean way its allowed me to separate behaviours without duplicating any code.













