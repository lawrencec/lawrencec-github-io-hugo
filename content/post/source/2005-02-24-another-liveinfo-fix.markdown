---
categories:
- Javascript
date: "2005-02-24T20:57:01Z"
slug: another-liveinfo-fix
status: publish
tags:
- Javascript
- liveinfo
title: 'Another LiveInfo fix '
wordpress_id: "37"
---

[Andrew Gregory](http://www.scss.com.au/family/andrew/opera/) reported some bugs in Opera 7.54u2. The bug in Opera 7.54u2 turned out to be rather strange. Any opera browser below 7.6 uses an iframe and I check the html within the frame to see if it is loaded. I use the text </liveInfo> as that is the root node. In 7.54u2, there is no </liveInfo>, only <liveInfo/>. Strange. Anyway I introduced a check for that and it works okay now.

Andrew also reported a bug in Opera 8.0 beta 1but I couldn't reproduce it. As usual, the updated zip is now available from the [downloads](http://www.nodetraveller.com/blog/?page_id=24) section or you can download it [direct](http://www.nodetraveller.com/downloads/liveInfo1.03.zip).

I'm still looking for reports on usage on mac and linux browsers.  Please take the time to comment below if you're using a mac or linux and say if it works or not.  Thanks...
