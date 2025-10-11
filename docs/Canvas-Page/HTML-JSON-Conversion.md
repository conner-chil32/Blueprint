---
layout: default
title: HTML JSON Conversion
excerpt: Short description to include as an opening and SEO metatags.
nav_order: 1
nav_exclude: false
search_exclude: false
---
### JSON
JSON conversion is very simple. The returnJSON function inside of RightPagePanel takes a page input and exports a String containing the page in the style of a JSON file. It uses JSON.stringify like this:
```
const jsonFile = JSON.stringify(page, null, 2);
```

This string can easily be changed into a proper JSON file or otherwise.

### HTML
The returnHTML function calls a function in the HTMLExport.jsx function.

##### ```HTMLExport.jsx```
Takes an imported page and uses renderToStaticMarkup to convert the page into HTML. Adds a head and body to ensure that the pages are a little better organized.

The PageRenderer component is used to render the page.

##### ```PageRenderer.jsx```
PageRenderer uses the WidgetRenderer to return the widget components but with everything disabled, ensuring its just a normal HTML widget.