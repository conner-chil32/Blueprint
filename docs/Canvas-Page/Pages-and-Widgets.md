---
layout: default
title: Pages and Widgets
excerpt: Detailed description of the internals of pages and widgets.
nav_order: 1
nav_exclude: false
search_exclude: false
---
## Pages
Pages are stored in an array in /src/app/canvas/page.js:
```
const [pages, setPages] = useState([{ id: 0, name: "Page 0", width: 800, height: 600, backgroundColor: '#ffffff', widgets: [] }]);
```
Here, 'pages' is the name of the storage array, while setPages is a setter for React that sets 'pages' to a new value. Every object in React has a "state" that useState hooks into and sets initial values for.

Each page contains the attributes id, name, dimensions, color, and a widgets array. The widgets array stores all the widgets relative to that page. In this way widgets are sorted by what page they are inside of rather than all in one variable.

#### Page Creation and Manipulation
##### ```createPage```
The createPage function sets the old pages variable to be the same variable, but with a new page with a default function. It then increments nextPageID by one, so that no two pages have the same ID.

##### ```deletePage```
The deletePage function removes a page from the array by setting the pages array to itself minus the inputted page.

##### ```updatePageName```
Updates the name of a page to a new name.

##### ```changePageProperty```
Changes an incoming attribute of a page.

## Widgets
Widgets are declared as a conditional variable, setting themselves to the widget variable of the currently selected variable. This is for simplicity.
```const widgets = currentPage ? currentPage.widgets : [];```

#### Widget.js
This functions as the central component of all widgets. React isn't necessarily Object-Oriented, it is a component-based framework. Each widget, if it is being rendered in React, returns as a RND component surrounding a div. React-RND allows for a widget to be dragged and resized, while the div component is what the widget looks like and stores its data.

The RND component has functions like onDragStart and Stop, and onResize to ensure the widget updates in real time when being moved and resized. The position and size keep track of the widget's dimensions, while bounds keeps it within its parent component, the canvas. Scale keeps the widget in line with react-zoom-pan-pinch, ensuring that the component moves with the cursor

#### Page.js
##### ```createWidget```
When the button to create a widget is pressed, it triggers this function with a pre-determined type. This takes a new widget and assigns properties based on its type through a switch case, and assigns the new widget to be placed on the canvas. It will follow the cursor until the user clicks on the canvas page through handleCanvasClick.

##### ```handleCanvasClick```
If the canvas is in 'placement mode' (when isPlacing is true and widgetToPlace is not null) then the widget following the cursor is placed on the canvas. If placement mode is not active, all widgets are deselected.

##### ```updateWidget```
This is used to keep widgets updated within their page.

##### ```setWidgets```
Used to create and manipulate new widgets.