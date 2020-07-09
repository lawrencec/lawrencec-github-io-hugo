---
categories:
- Javascript
date: "2007-11-13T23:41:59Z"
slug: creating-js-files-with-rhino-from-json
status: publish
tags:
- Javascript
- json
- rhino
title: Creating js files with Rhino (from JSON)
wordpress_id: "53"
---

(This is primarily a note to myself)





I've been playing with Rhino. Specifically, reading in json objects, turning that into normal, runnable objects and saving that to a file so browsers can run it. More specifically, the code that transforms the JSON to an object in the browser should be exactly the same as the one that runs in Rhino. That way I don't have to maintain two different versions.






I'm working on an idea that requires reading in JSON objects and creating objects with methods and properties based on that JSON and could be normally done per request of the page. Obviously, if the JSON is pretty much static, it would be best if we could save the resulting object to a file and reference that file in our pages instead. It would save 1) the request for the JSON file and 2) processing to create the final object. There are two steps to do this.







  1. Transform the JSON


  2. Saving the object





## Transform the JSON





Easy, enough. Iterate through the JSON object, create new object and add methods and properties to it as you see fit. To save it though you need a String representation of the object. Gecko's toSource() method helps there.






## Saving the object





In Rhino, make use of Java's FileWriter object and save it to the filesystem. If your object is really simple then that's probably it and you'll be able to run the object in your browser. If your final object makes use of closures then you'll get errors, obviously, as the variables the closures have reference to, aren't being created at all when the code is run in the browser. Solution (when run in Rhino) is to turn those methods that use closures into strings and add the variables in via regexp or whatever and then eval it!! Remember, it's only done in Rhino, so it's only done once. One thing to note, you don't have to replace every occurence of that variable name, only the first one (or add a initialisation statement for that variable to the function). Now when the code is written out to file (and read back in by the browser) the variables will have a valid value.





For simple types, like String or numbers, this will work fine. For objects or arrays, you could use toSource() but that just dumps out a object literal of the object at that time and not a reference which is what you really need. The other thing is you'll have a large object dump in the final code which makes the final code much much larger than you need. The solution then is store these objects in an Array or manager object (outside this system) and retrieve them as needed within your final code.






Here's an example:


{{< highlight js "linenos=inline" >}}
.
.
o[sMethodName] = function(varA,varB){
var f = function(var1){
//Use of an objManager to retrieve object we need
//varA and varB have no value in Rhino
objManager.getObj(var1).method(varA,varB);
};
//so for rhino
if ((typeof this["load"] == "function") && (typeof this["Packages"] == "function")) {
//so get string version of function
var fString = f.toString();
//replace variable names with actual variable value.          
fString = fString.replace('varA', '"' + varA + '"');
fString = fString.replace('varB', '"' + varB + '"');
return eval(fString);
}
 
return f;
 
}(a,b);
.
.
.
{{< / highlight >}}

There you go. Ugly, more than probably not robust but it's the only way I've found to do what I need to do for my use case; admittedly probably not a common usage scenario.





Is there a better way?
