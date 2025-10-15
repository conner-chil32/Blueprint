---
layout: default
title: Canvas Structure
excerpt: General description of the canvas page's structure.
nav_order: 1
nav_exclude: false
search_exclude: false
---
## Left Panel
The left panel is where all widget creation options are located. Buttons are organized by widget type, and clicking on one places a widget on the mouse cursor. That widget is set to follow the mouse until the user clicks on the page, after which the widget will be placed on the page.

## Page Container
The central portion of the canvas page is where the user places widgets and designs their webpage. It uses react-zoom-pan-pinch for dynamic camera movement through the page and react-rnd for widget dragging and resizing.

##### Structure
The page container is made up of three parts, named after their CSS containers:
- canvasArea
	- This is the dotted white outline around the center of the page. This prevents components within from overflowing and clipping with other panels.
- canvasView
	- This window is for react-zoom-pan-pinch. It allows the user to pan around the page and zoom in. It must fill the entire canvasArea, otherwise the window to view the page will not be correctly sized.
	- If the edge of the viewport for the page is not correctly lining up or fitting with the white dotted outline, it is likely that canvasView is not filling the canvasArea correctly. Uncomment the red dotted outline in the CSS for debugging.
- page
	- .page is the container for the page itself. It functions as an identifier for React to tell what is page and what isn't, as well as a container for what the background and size of the page should be.

## Right Panel
This panel is for editing existing widgets as well as pages. The "Switch" button allows the user to swap between a panel for manipulating selected widgets and a panel dedicated to pages.

##### Widget Panel
When a widget panel is selected, a switch statement determines what kind of widget it is and displays options depending on the widget type. In general, options include rotation, color, and a deletion option. A video or image widget may have a file upload, or a textbox may have options for font and color.

##### Page Panel
The current page is the page on display. This panel allows for a user to manipulate the page's background color and size. It also allows one to download a JSON or HTML file based off of the current page.