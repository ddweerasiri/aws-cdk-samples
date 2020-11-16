import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as URLShortenerStack from '../lib/url-shortener-stack';

test('Test API GET Method', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new URLShortenerStack.URLShortenerStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource('AWS::ApiGateway::Method', {
    HttpMethod: 'GET'
  }));
});