---
layout: default
title: History
excerpt: HistoryManager keeps track of the user's changes, allowing for traversal between states.
nav_order: 1
nav_exclude: false
search_exclude: false
---
## Page
In page.js, the history variable is created as a reference to History in HistoryManager.jsx.
```
  useEffect(() => {

    history.current = History({

      // Record the current state of the canvas page

      getState: () => varState.current,

  

      // Apply the current state of the canvas page

      applyState: (recordedState) => {

        setPages(recordedState.pages);

        setSelectedWidgets(recordedState.selectedWidgets);

        setSelectedPageID(recordedState.selectedPageID);

        setNextPageID(recordedState.nextPageID);

        setNextWidgetId(recordedState.nextWidgetId);

      }

    })

  }, []);
```
Importantly, this is inside of a hook to prevent it to be created multiple times.