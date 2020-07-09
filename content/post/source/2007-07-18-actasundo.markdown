---
categories:
- Javascript
date: "2007-07-18T09:04:36Z"
slug: actasundo
status: publish
tags:
- actsasundo
- Javascript
- memento
- UI
- undo
- undoable
title: ActsAsUndoable
wordpress_id: "51"
---

With web apps becoming more and more like Desktop apps, it seems like user interfaces need be more like desktop user interfaces too. Some of these web apps can have a complex UI and their users need to be able to feel comfortable with it. Of course, making the UI as simple as possible is key, but if a task is relatively complex then the UI will also be relatively complex. With more complex tasks, users can make mistakes or want to change things and if they do, they'd appreciate a way of doing so. One way to do that is to provide the user a way of undoing their actions; a way to retreat over their history. Just to make clear, this is something along the lines of a user interaction history, not a browser navigation history. Hence ActsAsUndoable, one way of adding undo functionality to your interactive widgets. (Incidentally while I was writing this post, Aza Raskin posted an [article](http://www.alistapart.com/articles/neveruseawarning) on [A List Apart](http://www.alistapart.com) about using undo functionality in interaction design, which seems to dovetail well with this post.)




## Design Patterns




Whenever I code a widget, there's two resources I look to. One is Yahoo!'s [Design Pattern library](http://developer.yahoo.com/ypatterns/) and the other is Jennifer Tidwell's [Designing Interfaces](http://designinginterfaces.com/) book. It's from this book and more specifically the explanation of the [Multi-Level Undo pattern](http://designinginterfaces.com/Multi-Level_Undo) that ActsAsUndo is based on.

Basically the Multi-Level Undo pattern says that if users can navigate through their action history and undo their actions, then they can explore their own work paths quickly and safely. The most obvious desktop example of a navigable history is Photoshop's history panel.

The pattern states that these kind of actions should be undoable:




  * Text entry for documents or spreadsheets

  * Database transactions

  * Modifications to images or painting canvases

  * Layout changes -- position, size, stacking order, or grouping in graphic applications

  * File operations, such as deleting or modifying files

  * Creation, deletion or rearrangement of objects such as email messages or spreadsheet columns

  * Any cut, copy, or paste operation


There are apps like these available on the web and some do have some simple undo/history functionality. These do tend to be only a single step undo and then, only for actions that change and save a new state eg move to trash. But also other actions that users make but perhaps don't yet want (or need) to save should also be undoable and at a multiple level too. So, how do we as implement something like the Multi Level Undo **interaction pattern**? We use the [Memento](http://en.wikipedia.org/wiki/Memento_pattern) **software design pattern**.





## Demos




Two of Jennifer's examples are text entry and stacking order changes. I thought these would be relatively simple examples to use for demo purposes. Here's the [text entry](/sandbox/actsasundoable/memento.html) demo and also the [stacking order](/sandbox/actsasundoable/undo-list.html) demo. I used the demo of the YUI's sortable list which I hope they don't mind. If you want, take a look at these to see whats going on before reading on.




## Text entry




The first example I'll cover is the text entry one. It's a simple example of a textarea in which users can enter text and save snaphots. The original class has two properties **el** and **sValue**. **el** represents the textarea and **sValue**, the textarea's value. It has a method called **setText()** whichs sets **sValue** to the value of the textarea.



Finally we have a **snapshotText()** method which calls **setText()**. We wire a button element to this method.

{{< highlight js "linenos=inline" >}}
YAHOO.NT.UI.TextUpdate = function(elId,sGroup,sPreviewId) { 
  this.el = document.getElementById(elId); 
  this.sValue = this.el.value; 
} 
YAHOO.NT.UI.TextUpdate.prototype.setText = function(sValue) { 
  this.sValue = this.el.value = sValue; 
} 
YAHOO.NT.UI.TextUpdate.prototype.snapshotText = function() { 
  if (this.sValue != this.el.value) {
    this.setText(this.el.value); 
  } 
}
{{< / highlight >}}

We can add undoable functionality by augmenting it with **YAHOO.Acts.as.Undoable**. This adds a **sCaretakerGroup** property and **undo()**,**redo()**,**revert()** and **restore()** methods. All we need to do is subscribe to the 'stateLoaded' event and make a call to **saveState()** of the Caretaker to record the initial state. We can do this in the constructor of out TextUpdate object or a **init()** method if we choose to use one.


{{< highlight js "linenos=inline" >}}
this.sCareTakerGroup = sGroup; 
YAHOO.NT.CaretakerRegistry.subscribe(this.sCareTakerGroup,'stateLoaded',this.restore,this,true);
YAHOO.NT.CaretakerRegistry.saveState(this.sCareTakerGroup,'New',{'args':[this.sValue],'execute':this.setText,'oScope':this});
{{< / highlight >}}

The first line just sets up a property that allows us to identify a caretaker to manage our states (more on this later).

The second line subscribes to an event called 'stateLoaded' and sets the callback to our **restore()** method.

Then, the third line saves our initial state. We need to do this so the **revert()** method can revert to the initial state. The callback we specify here   depends on your object





So now our TextUpdate class looks like this :

{{< highlight js "linenos=inline" >}}
YAHOO.NT.UI.TextUpdate  = function(elId,sGroup,sPreviewId) { 
  this.el = document.getElementById(elId); 
  this.sValue = this.el.value; 

  //Interact with caretaker 
  this.sCareTakerGroup = sGroup; 
  YAHOO.NT.CaretakerRegistry.subscribe(this.sCareTakerGroup,'stateLoaded',this.restore,this,true);
  YAHOO.NT.CaretakerRegistry.saveState(this.sCareTakerGroup,'New',{'args':[this.sValue],'execute':this.setText,'oScope':this}); 
}

YAHOO.NT.UI.TextUpdate.prototype.setText = function(sValue) { 
  this.sValue = this.el.value = sValue; 
} 

YAHOO.NT.UI.TextUpdate.prototype.snapshotText = function() { 
  if (this.sValue != this.el.value) { 
     this.setText(this.el.value); 
    //saves value to caretaker 
    YAHOO.NT.CaretakerRegistry.saveState(this.sCareTakerGroup,null,{'args':[this.sValue],'execute':this.setText,'oScope':this}); 
  } 
}
//make undoable
YAHOO.augment(YAHOO.NT.UI.TextUpdate,YAHOO.Acts.as.Undoable);
{{< / highlight >}}

The last line adds the undoable functionality to the TextUpdate object. (see next code snippet)





But what's all this caretaker stuff? Well, the Memento software design pattern is an established pattern that helps to implement undo functionality. I touched on the Memento pattern in an [earlier post](/Flash/design-patterns-in-flash.html) about object-oriented Actionscript.





The Memento pattern has three classes; Originator, Caretaker and Memento. Basically using these three classes, the Memento pattern works likes this:





If an Originator wants its state or some of its state to be undoable or redoable, then it must save its state to a Caretaker. This Caretaker will manage the various states (Mementos) of our Originator. (isn't it lovely terminology?)





Using this as a premise, we can devise a simple 'framework' for adding multi level undo functionality to our apps. We don't need (or want) to create lots of class hierarchy for our apps but the only classes we need to create revolve around the Caretaker object. Each object that we need undo functionality for, we have a corresponding caretaker. To manage multiple Caretaker objects (since perhaps multiple objects need a separate history), we use a CaretakerRegistry singleton object to do so. This allows Caretaker objects to be registered and created, if not done so already. It also acts as proxy to caretaker objects as all calls to Caretakers are made via the CaretakerRegistry. A registry also allows multiple objects to monitor state changes of an Originator. See the HistoryList section for an example of such an object





Interaction is achieved using CustomEvents. Caretaker objects fire 'stateLoaded' and 'stateSaved' events. Originator objects subscribe to the 'stateLoaded event. Any other object that is interested in the state of our Originator will subscribe to both 'stateLoaded' and 'stateSaved' events. Each event passes the Memento object to each listening object.





Everytime the state of our object has changed and needs to be saved, we call the **saveState** method (see line 19) of our object's Caretaker which makes a note of the new state and fires off a 'stateSaved' event.





Here are the methods that ActsAsUndoable adds.

{{< highlight js "linenos=inline" >}}
/**
 * redo changes
 */
 undo : function() {
	YAHOO.NT.CaretakerRegistry.loadState(this.sCareTakerGroup);
 },

/**
 * Redo changes
 */
 redo : function() {
	YAHOO.NT.CaretakerRegistry.loadState(this.sCareTakerGroup,-1);
 },
	
/**
 * Revert to initial text value
 * 
 */
revert : function() {
	YAHOO.NT.CaretakerRegistry.loadState(this.sCareTakerGroup,0);
},
	
/**
 * 
 * 
 * @param {Object} oState Object containing callback to call with specified 
 * arguments and scope. Fields are :
 * 
 * {Array} 	oState.args Array of arguments to call callback with
 * {fn}  		oState.execute Calblack function
 * {Object}	oState.oScope Object to use as scope for callback
 */
restore : function(oState) {
  if (oState.execute) {
	oState.execute.apply(oState.oScope,oState.args);	
  }
}
{{< / highlight >}}

Our object also has **undo()**,**redo()**,**revert()** methods, all of which call the **loadState()** method of the Caretaker. This, in turn, fires off a 'stateLoaded' event. Because our originating object subscribes to the 'stateLoaded' event it is passed the Memento object, which represents the state of the object that it needs to be undone, redone or reverted to. The listening method of our object that the custom event fires to is called **restore()**. This is the method that sets the state of our object. The **restore()** method is passed an object with three properties. These are **args**,**execute**, and **oScope** and are defined when we save the state via the **saveState()** method. Our **restore()** simply calls the method specified in **execute** passing as args those specified in **args** using **oScope** as the scope for the method.. I restore the state of the object like this (via a method call) rather than simply overwriting some properties with older properties as often some logic needs to be run as well; just resetting the properties probably won't suffice in anything other than a very simple widget). The best way to do that is via existing methods on our originating object. For the pattern heads out there, this way is similar to the [command pattern](http://en.wikipedia.org/wiki/Command_pattern) without actually creating Command objects - the existing methods are the Commands.





## Stacking Order




The [stacking order demo](/sandbox/actsasundoable/undo-list.html) is similar. I rewrote the example to reflect the changes needed to make the reordering done by single method (orderLi). Also I haven't augmented it with ActsAsUndoable as I don't use the undo, redo or revert functionality in the UI. The source for YAHOO.example.DDApp is probably a good example to view if you want to see how to add undoable functionality without using augmentation.





## History List




The History List object is one that listens to state changes of a given object and renders them in a list. It shows how other objects besides the Originator can monitor changes of state. Clicking on each item in the list, rolls back the state of that object to the state. You just initialise it with the id of the container and the CaretakerGroup that the object you're providing a history for is using.

Each link in the history list is a named anchor. However in the update() method, we stop the Event so the browser doesn't actually add it to its own history. We don't want the act of navigating through the history of our own actions within our task to interfere with the history of our browser.





We can create a new HistoryList object that monitors changes to our object by this :


{{< highlight js "linenos=inline" >}}
hl = new YAHOO.NT.UI.HistoryList('hlistCont','textArea'); 
{{< / highlight >}}

The first is the id of an element in which to render the history list. The second is the name of the caretaker group to monitor. The list is rendered to the document and any saves, reverts, undo etc are shown in this list.





## Resources and notes :






  * The ActsAsUndoable was an interim tongue-in-cheek working name but I kinda like it. The Acts.as namespace is a bit overkill but it fits pretty well and will work out nicely in future things I want to post about.


  * Accessibility - we should set the tabindex of our textarea or list to -1 and focus() them when a history list item is clicked or pressed. See this [making ajax work with screen readers article](http://juicystudio.com/article/making-ajax-work-with-screen-readers.php) from [Juicystudio](http://juicystudio.com/)
  *

  * For the textUpdate example I've used the word 'snapshot' rather than 'save' as 'save' would probably mean save permanently to most people. Another button called save could easily be added that would do a true save via normal form functionality. It could even be done using AJAX and the [Browser History manager](http://developer.yahoo.com/yui/history/) from the YUI library, which would add an item to the history list. Having said that, we don't want to confuse user with two histories; browser history and what I call User Interaction History.





  * I used the terms as specified as in the Memento Design Pattern. These aren't the clearest names and I was in two minds of calling Caretaker and CaretakerRegistry, UserActionManager and UserActionManagerRegistry. But I suppose these objects can be used for things other than user actions so I kept the design pattern language.





You can download the [examples and js files.](http://www.nodetraveller.com/downloads/ActsAsUndoable.zip) One of these days I'll make my subversion repo public but for now old fashioned zip files will have to do.





Finally, thanks to Tony Kabalan for being a sound board and inputting some useful ideas.




