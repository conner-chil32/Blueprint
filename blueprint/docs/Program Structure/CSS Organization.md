---
layout: default
title: CSS Organization
excerpt: Short description to include as an opening and SEO metatags.
nav_order: 3
nav_exclude: false
search_exclude: false
---
# CSS Organization

This document shows how to structure CSS files within the program.

# Global CSS Files

- The CSS page globals.css is referenced in every file by default. Other files should be kept in a /styles folder kept in the same file as globals.css (which is not within said directory).

- This is where styles and code that is used over and over everywhere will go.

# Local CSS Files

- Every web page has its own directory under the /src/app directory. Each page will have its own CSS file, and if it doesn't, add one when you go to add CSS to it.

- This is where *unique* files will go. Global variables should be kept into account to make it easier to change the files where needed.

# Importing CSS Files

- For the most part we are using [CSS Modules](https://nextjs.org/docs/app/getting-started/css#css-modules), noted by file names like Example.module.css. Note the .module in the name. Mixing and matching other styles of CSS is fine as well, so long as you confirm they can function together with no issues.

- Importing is done like this:
import styles from './styles.module.css'

- Do this at the *top* of the JavaScript file you want to add. Follow the CSS Modules link if you want to learn more.