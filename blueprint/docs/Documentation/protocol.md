---
layout: default
title: Documentation Protocol
nav_order: 2
nav_exclude: false
search_exclude: false
---
# Documentation Protocol

The Documentation for Blueprint will be split into multiple subsections compromising 3 core ideas:

1. Readability
2. Functionality
3. Accountability

The following explain how exactly to fit into these core ideas.

## Readability

Making readable comments are a core aspect of documentation, not just making write ups here on the documentation site. Making a write up should be reserved for more complex features and processes that can't easily be explained in a comment. How we enforce this readability standards is by following these principles.

### Readability Standards

- A comment should be no longer than 1 paragraph long. If your comment exceeds 4-5 sentences, you should write a write-up on the documentation site and link it in the comment.
- A comment should be concise, explain exactly what the function does, its inputs, and expected outputs.
- A comment should follow basic English grammar, and should be free of slang and other confusing language that can waste the time of people trying to read it.
- A comment should always be before the code it is referencing.

Examples:

**BAD COMMENT**
`/* I have no idea what this function does, just that it works */`

**GOOD COMMENT**
`/* This function processes the cookies recieved from the browser using userCookie, which then is assigned to a User class object. You can then pull the individual data from the this user by using the access modifier's of the User class.*/`

If you do not follow these commenting rules, your upload may be rejected from being merged going forward.

## Functionality

A comment should serve a purpose to the reader, either describing a given function or behavior. So you comment should accurately describe the intended functionality of the following piece of code. You should also describe any technical specifics for the function to work.

Example:
```
/*
function: setUser()
inputs: 
	userCookie: JSONObject  
	encrypt: Boolean
outputs:
	newUser: User

This function processes the cookies recieved from the browser using userCookie, which then is assigned to a User class object. You can then pull the individual data from the this user by using the access modifier's of the User class. The encrypt modifier determines whether or not to encrypt the user information, by default its set to false.
*/
```

This is an example of how to structure the code for a function, and it complexity is based on the necessity of the comment. One-line comments (or one-liners) should only be used when the describe is so easy to explain, it doesn't need anything more. 

Example:

`/* This variable serves as a global value showcasing ping between the admin client and the server */`

## Accountability

Every comment should be given a stamp by a person, and a timestamp of when the comment was written. I.E, when the last part of that particular code was written. This is to insure accountability between the commenter and the quality of the comment, and also who to reach out to if there is confusion or if there is any issue with the code. It also gives a more in-time metric of when that section of code was last touched by any programmer.

Example:
```
/* Conner Childers, 3/30/2025
function: setUser()
inputs: 
	userCookie: JSONObject  
	encrypt: Boolean
outputs:
	newUser: User

This function processes the cookies recieved from the browser using userCookie, which then is assigned to a User class object. You can then pull the individual data from the this user by using the access modifier's of the User class. The encrypt modifier determines whether or not to encrypt the user information, by default its set to false.
*/
```

