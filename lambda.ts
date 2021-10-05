"use strict"
// Load the AWS SDK
import * as AWS from "aws-sdk";
/**
 * @param  {any} event
 */
exports.handler = async(event:any) => {
  // Create the DynamoDB object
  const docClient = new AWS.DynamoDB.DocumentClient();
  //search is used as queryparameters
  let { search } = event.queryStringParameters || {};

  let responseBody = "";
  let statusCode = 200;

  const params :any= {
    TableName: process.env.TABLE_NAME, 
    IndexName:'SearchByOrderId',//GSI (Global Secondary Index) Name
    KeyConditionExpression: "order_id = :order_id", //Secondary partition key name
    ExpressionAttributeValues: {
      ":order_id": search, 
    }
  };
  try {
    // Call DynamoDB to query from the table 
    const customers = await docClient.query(params).promise(); //Get customers by order_id
    responseBody = JSON.stringify(customers); 
    statusCode = 200
  }
  catch (err) {
    responseBody = `Unable to get info: ${err}`;
    statusCode = 403;
  }
//response object 
  const response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Headers": "APIkey, Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: responseBody
  };
  return response;

};
