---
categories:
- Flash
date: "2003-09-01T18:10:42Z"
slug: webservices-in-flash-2004
status: publish
tags:
- Flash
- tvguide
title: Webservices in Flash 2004
wordpress_id: "15"
---

I've been playing about with the webservice connector in flash mx 2004. What I've discovered is that connecting to a webservice and using the data returned is **really** easy.

I'm using the tvGuide webservice (http://www.nodetraveller.com/webservices/tvGuide/tvGuideService.php?wsdl here at nodetraveller.com as one of the operations it provides is a list of channels which would look ideal in a listbox.

Here's a quick guide to using a webservice:

Create a new document from a Query-Error-Response template. (This helps us with our simple example as it already sets up a webservice connector and a submit button in the form.

Click on the Webservice Connector (picture of a globe).

In the Properties panel, paste the url of the webservice WSDL in the WSDLURL parameter,and press return. Flash will now access the wsdl and find out what operations are available.

Click on the operations parameter and use the drop down to view the available operations. There should be two (getChannels and getChannelListings).

Select **getChannels**. For this simple example, theres no real need to use the other parameters though you can if you want. it won't make any difference to our example.

Drag a Listbox and a TextInput component into the query Form. Name the Listbox **channels_lb**. Call the TextInput **date**. Enter todays date into the TextInput (make sure its in DD/MM/YYYY format). (strictly we should we using the response form as well but this is only an example)

Now select the webservice connector (you may have to select the application form first) and look in the component inspector (bottom right). Select the Binding tab. This is where you tell the webservice connector what to send to the webservice (and from what component) and what component to send the data to when received.

Press the + sign icon to add a binding. In the dialog that opens up, select the
**date : String** child of the **params : Object**.

Now we have to tell Flash what value to send. Select the bound to parameter and select the TextInput **date **in the dialog that appears. Finally change the direction parameter to "**in**". What we've done is told Flash to get the value of the **date **TextInput (bound to parameter) and send it as a request to the webservice (direction parameter).

To populate the listbox with our returned data, create another binding and select
the **results** Array. Bind this to the listbox by configuring the bound to parameter. by selecting** ListBox**,**** and **dataprovider : Array** in the right hand column of the Bound To dialog . Make sure that the direction is set to "out". We've just told Flash to pass the results Array received from the webservice to the dataprovider Array of the listbox. Doing so populates the Listbox.

And that's it! And without writing any code. Test your movie and press the submit button...

You can download it here (you'll need flash mx 2004 to view it)

This is a very simple example but I think for more complex ones, you would bind the WSConnector to a DataHolder and use the DataHolder events to notify UI components of the data change...

I feel the need for more experimentation....
