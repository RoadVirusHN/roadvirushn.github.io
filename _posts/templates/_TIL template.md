---
title: <% tp.file.title.replaceAll("\ ", "-") %>
date: <% tp.file.creation_date("YYYY-MM-DD HH:mm:ss ZZ") %>
tags: HIDE <% tp.file.cursor(1) %>
layout: obsidian
is_Finished: false
last_Reviewed: <% tp.file.last_modified_date("YYYY-MM-DD HH:mm:ss ZZ") %>
use_Mathjax: true
---
```toc

```

# <% tp.file.title %>

<% tp.file.rename(tp.file.creation_date("YYYY-MM-DD-")+tp.file.title.replaceAll("\ ", "-")) %>