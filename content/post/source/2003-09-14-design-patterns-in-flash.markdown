---
categories:
- Flash
date: "2003-09-14T17:20:14Z"
slug: design-patterns-in-flash
status: publish
tags:
- actionscript
- design patterns
- Flash
- undo
title: Design Patterns in Flash
wordpress_id: "14"
---

Now Actionscript is OO, I thought it would be useful to try out implementing a design pattern in Flash. The pattern I chose is the Memento pattern, which is mainly used to implement "undo" functionality in applications. The reason I chose Memento is because its a pattern that uses interfaces and I wanted to explore this in AS 2.0. An interface is an object that defines methods but has no implementation.


The Memento pattern consists of three objects, Originator, Memento and Caretaker. The Originator is the object of which all or some properties need to 'saved'. These properties are saved in a Memento object. Finally the caretaker object is in charge of any saving or 'undoing'.

Any object that wants its state to be stored for possible retreival later (Originator) must have two methods defined. These are setMemento() and createMemento(). An interface for this would look like this:

{{< highlight actionscript "linenos=inline" >}}
interface com.nodetraveller.patterns.Memento.iOriginator {
	function setMemento(m:iMemento):Void;
	function createMemento():iMemento;
}
{{< / highlight >}}

The setMemento has one parameter (Memento) and its job is to extract the properties from it and revert the Originators own state using those properties. So this is used after its state has been saved. To save a state, the createMemento method is used. This returns a memento object which has all the properties that the originator wants saved. To implement the originator interface we would write something like this:

{{< highlight actionscript "linenos=inline" >}}
import com.nodetraveller.patterns.Memento.*;

class com.nodetraveller.patterns.Memento.Originator implements com.nodetraveller.patterns.Memento.iOriginator{
	private var _text:String = "";
	private var _isChecked:Boolean = false;

	public function setMemento(m:Memento):Void {
		this._text = m.getText();
		this._isChecked = m.getChecked();
	}

	public function createMemento():Memento {
		return new Memento(_text,_isChecked);
	}
}
{{< / highlight >}}

This class has two properties (a string and a boolean type) that is saved using a memento object. This memento then only needs the same properties that the originator wants saved and relevant getters and setters.

{{< highlight actionscript "linenos=inline" >}}
import com.nodetraveller.patterns.Memento.*;

class com.nodetraveller.patterns.Memento.Memento {
	private var _text:String;
	private var _isChecked:Boolean;

	function Memento(text:String,checked:Boolean) {
		this._text = text
		this._isChecked =checked;
	}

	public function getText():String {
		return this._text
	}

	public function getChecked():Boolean {
		return _isChecked;
	};
}
{{< / highlight >}}

Now that we have the originator and the memento, all thats left is the caretaker.

{{< highlight actionscript "linenos=inline" >}}
import com.nodetraveller.patterns.Memento.*;

class com.nodetraveller.patterns.Memento.Caretaker {
	private var _orig:Originator
	private var _memento:Memento;

	function Caretaker() {
	_orig = new Originator();
	};

	function saveState(){
	this._memento = _orig.createMemento();
	}

	function revertState(){
	this._orig.setMemento(_memento);
	}
}
{{< / highlight >}}

The saveState method calls the createMemento method on the Originator which returns a memento which the caretaker keeps. When the originator needs to be reverted, the caretaker set the originators memento to the one it saved.

Ideally, the getter and setters for the Memento shouldn't be public as only the Originator should have access. In Java, this would be implemented using inner classes.

I've created a fla using these classes [here](http://www.nodetraveller.com/downloads/mementoDP.zip). Its a simple demo showing a textArea and a checkbox which you can save and revert

**Note: **In the Caretaker class of the zip, I've put the eventhandlers for the GUI. In a real app these would probably be in another object.
Also you may have to add the path where you saved the files to Flash's classpath. This can be done in Edit->Preferences.
