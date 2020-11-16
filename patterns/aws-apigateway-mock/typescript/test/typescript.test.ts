import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Typescript from '../lib/typescript-stack';

test('Check the existance of API method', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Typescript.TypescriptStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource('AWS::ApiGateway::Method', {
    HttpMethod: 'GET'
  }));
});
