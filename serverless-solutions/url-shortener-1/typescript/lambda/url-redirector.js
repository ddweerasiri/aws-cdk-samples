'use strict'
var aws = require('aws-sdk');
const { error } = require('console');

exports.handler = (event, context, callback) => {
    var shortCode = event.path.substring(1);

    //trigger url redirector if shortCode attribute present
    if (shortCode != null) {
        generateRedirectURL(shortCode, event, callback);
    }
    else throw callback("Unexpected request");    
};

const generateRedirectURL = (shortCode, event, callback) => {
    var params = {
        Key: {
            "shortUrl": { S: shortCode }
        },
        TableName: process.env.TableName
    };
    var ddb = new aws.DynamoDB();
    var request = ddb.getItem(params);

    request.on('success', function(response) {
        const longUrl = response.data.Item.yourUrl.S;
        
        var apiResponse = {
            statusCode: 301,
            headers: {
                "Location": longUrl
            }
        };
        callback(null, apiResponse);
    }).
    on('error', function(response){
        console.log(response);
        var apiResponse = {
            statusCode: 500,
            headers: {},
            body: "There was an error processing your request " + JSON.stringify(response.data)
        };
        callback(null, apiResponse);
    }).send();
}