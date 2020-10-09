'use strict'
var aws = require('aws-sdk');
const { error } = require('console');
var crypto = require('crypto');

exports.handler = (event, context, callback) => {
    //Read the input url
    var body= JSON.parse(event.body);
    var longUrl = body.longUrl;

    //trigger url shortener if longUrl attribute present
    if (longUrl != null) {
        shortenURL(longUrl, event, callback);
    }
    else throw callback("Unexpected request");    
};

const shortenURL = (longUrl, event, callback) => {
    var shortCode = crypto.createHash('md5').update(longUrl).digest('hex').substring(0,8);
    
    var params = {
        Item: {
            "yourUrl": { S: longUrl }, 
            "shortUrl": { S: shortCode }
        },
        //ReturnConsumedCapacity: "TOTAL",
        TableName: process.env.TableName
    };
    
    var ddb = new aws.DynamoDB();
    var request = ddb.putItem(params);
    
    request.on('success', function(response) {
        var respBody = {};
        respBody.shortUrl = "https://" + event.headers.Host + "/" + event.requestContext.stage + "/" + shortCode;
        
        var apiResponse = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-type": "application/json"
            },
            body: JSON.stringify(respBody)
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