import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway';

export class URLShortenerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const table = new dynamodb.Table(this, 'myTable', {
      partitionKey: { name: 'shortUrl', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Lambda function - URL generator
    const urlGenerator = new lambda.Function(this, 'urlGenerator', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'url-generator.handler',
      code: lambda.Code.fromAsset("./lambda"),
      environment: {
        'TableName': table.tableName
      }
    });

    // Lambda function - URL redirector
    const urlRedirector = new lambda.Function(this, 'urlRedirector', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'url-redirector.handler',
      code: lambda.Code.fromAsset("./lambda"),
      environment: {
        'TableName': table.tableName
      }
    });

    table.grantReadWriteData(urlGenerator);
    table.grantReadData(urlRedirector);

    //API endpoint
    const api = new apigw.LambdaRestApi(this, 'restAPI', {
      handler: urlGenerator,
      restApiName: 'urlShortenerAPI',
      proxy: false
    });

    //POST method
    const postPath = api.root.addResource('url-shortener');
    postPath.addMethod('POST', new LambdaIntegration(urlGenerator), {});

    //GET method
    const getPath = api.root.addProxy();
    getPath.addMethod('GET', new LambdaIntegration(urlRedirector), {})

    //Add environment variable
    //urlGenerator.addEnvironment("APIid", api.restApiId);
  }
}