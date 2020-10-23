import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';

export class TypescriptStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let api = new apigw.RestApi(this, 'mock-api', {
      restApiName : 'mock-api'
    }); 
    let apiResource = api.root.addResource('test');
    let methodIntegration = new apigw.MockIntegration({
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      },
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': '{"response": "output from mock integration"}'
        }
      }]
    });
    apiResource.addMethod('GET', methodIntegration, {
      methodResponses: [{
        statusCode: '200'  
      }]
    });
  }
}