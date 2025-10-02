/*
 * provides API calls to Wordpress
 * Scrum-245: Function calls to WordPress REST API
 * added to its own file so multiple files have potential access
*/

//https://adityan150.medium.com/3-ways-to-fetch-data-from-an-api-endpoint-in-javascript-638fc4ec0ad6
//Lydell suggested Fetch API

class WPCalls{          //make the JSON and send it to wherever it's supposed to go. Might not need to be a class, could be a single function 
    
    constructor(){ 
        this.token = sessionStorage.getItem("WPTOKEN");
    }
/*    
    GET(data){ }//access resources at the URL
    POST(data){ }//send data to the URL
    PUT(data){ }//update data at the URL
    DELETE(data){ }//remove data at the URL
*/
    /**
     * @return
     */
    async wpRequest(method, url, data){ //originally const sendData = (method, url, data) => {
        
        if (!this.token) { //if there's no token from the session variable, cant make a request
            throw false;
        }
        
        const response = await fetch(`http://${process.env.WP_DOMAIN}:${process.env.WP_PORT}${url}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Authorization ${this.token}`
            },
            body: JSON.stringify(data)
        });

        if (!response) throw false;

        switch (response.status) {
            case 200:
                console.log("[WP] Request Successful")
                return {
                    headers: response.headers,
                    data: await response.json()
                }
            case 401:
                console.log("[WP] Bad Credentials")
                throw {
                    headers: response.headers,
                    data: await response.text()
                }
            case 405:
                console.log("[WP] Serverside Error")
                throw {
                    headers: response.headers,
                    data: await response.text()
                }
            default:
                console.log("[WP] Error: Either undefined or unsupported status code");
                //dangerous to print the result
        }

    }

    clearToken() {
        delete this.token;
    }

    setToken() {
        this.token = sessionStorage.getItem("WPTOKEN");
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