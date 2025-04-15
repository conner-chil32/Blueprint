---
layout: default
title: How To Make New Documentation
nav_order: 1
nav_exclude: false
search_exclude: false
---
# How To Make New Documentation

This document describes the process to create a new piece of documentation

## Prerequisites

-[Obsidian](https://obsidian.md/) (or any other markdown editor)

## Step By Step

1. Install Obsidian
2. Navigate to "Open folder as vault" and click "Open"
3. Navigate to the "/docs" folder inside the repository directory
4. Click on the "Settings" icon on the bottom left
5. Navigate to `Setting > Templates`
6. Set the "Template folder location" to "templates"
7. Click the "New Note" button:
8. Click the "Insert template" button:
9. Fill out the template
	1. "layout" should always be default
	2. "title" makes it the title of the page in the finder section at the top of the page
	3. "excerpt" handles SEO tags and other stuff, you can remove this if you wish
	4. "nav_order" displays the order the document is shown top of the page
		1. For this to be properly displayed follow this formula
		2. `1+Current Subfolder count` 
		3. So if you are in `notes/routing` your nav_order will be 3
		4. Everything on the top of the page should be 1
	5. "nav_exclude" removes your post from the finder on the left sidebar
	6. "search_exclude" removes your post from being able to be search in the search bar

## Folder structure

Adding a folder creatures a topic folder on the left-sidebar, this should be used to separate topics.

### References

- [Theme Guide](https://github.com/JV-conseil/jekyll-theme-read-the-docs) (Read the .md file as code to see how they are formatted with markdown)
- [Visual examples](https://jv-conseil.github.io/jekyll-theme-read-the-docs/)
- [Basic Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)