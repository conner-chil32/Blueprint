/*
 * provides API calls to Wordpress
 * Scrum-245: Function calls to WordPress REST API
 * added to its own file so multiple files have potential access
*/

//https://adityan150.medium.com/3-ways-to-fetch-data-from-an-api-endpoint-in-javascript-638fc4ec0ad6
//Lydell suggested Fetch API

class WPCalls{          //make the JSON and send it to wherever it's supposed to go. Might not need to be a class, could be a single function 
    constructor(endpoint){ this.url = endpoint; }   //URI for server endpoint
/*    
    GET(data){ }//access resources at the URL
    POST(data){ }//send data to the URL
    PUT(data){ }//update data at the URL
    DELETE(data){ }//remove data at the URL
*/
    sendData(method, data){ //originally const sendData = (method, url, data) => {
        // fetch() returns a Promise object
        return fetch(this.url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((response) => {
            console.log(response); // response is stream data
            // Handle HTTP errors
            if (!response.ok) { //status >= 400
            // convert stream data to JSON
                return response.json().then((errorResponseData) => {
                    const error = new Error();
                    error.message = "Something went wrong!";
                    error.data = errorResponseData;
                    throw error;
                });
            }
            return response.json();
        });
    }

    test(){ //Test POST, GET, PUT, and DELETE with expected result
        //post a value
        //get that value
        //change the value
        //get the new value
        //delete the value
        //get the value
    }
    testCheck(json, expectedResult){ //https://www.w3schools.com/nodejs/met_assert_equal.asp
        var assert = require('assert');
        
        //extract piece from 

        //if there's a premade 'failed call' object
        assert.equal(json,expectedResult);        
    }
}