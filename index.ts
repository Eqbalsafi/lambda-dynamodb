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
/*  11/23/2021
    Author: mallikarjuna11421
    Description:  Code has been modified in the IndexName by "SearchByVinlocityId" instead of "SearchByOrderId".
    Code has been modified in the ExpressionAttributeValues by "order_id" instead of "order_id"
    Code has been modified in the KeyConditionExpression by "order_id" instead of "order_id" */
  const params :any= {
    TableName: process.env.TABLE_NAME, 
    IndexName:'SearchByOrderId',//GSI (Global Secondary Index) Name  //  Modified for CR 1.6
    KeyConditionExpression: "order_id = :order_id", //Secondary partition key name // Modified for CR 1.6
    ExpressionAttributeValues: {
      ":order_id": search,  // Modified for CR 1.6
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