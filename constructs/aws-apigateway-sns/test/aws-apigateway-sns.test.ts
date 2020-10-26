import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as AwsApigatewaySns from '../lib/index';

/*
 * Example test 
 */
test('API created with SNS integration', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  let api = new apigw.RestApi(stack, 'test-api', {
    restApiName : 'mock-api'
  }); 
  let apiResource = api.root.addResource('test');
  let props : AwsApigatewaySns.AwsApigatewaySnsProps = {
    apiResource: apiResource,
    httpMethod: 'POST'
  };
  new AwsApigatewaySns.AwsApigatewaySns(stack, 'MyTestConstruct', props);
  // THEN
  expectCDK(stack).to(countResources("AWS::SNS::Topic",1));
});
