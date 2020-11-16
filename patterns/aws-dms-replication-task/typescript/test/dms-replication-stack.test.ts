import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as DMSReplicationStack from '../lib/dms-replication-stack';

test('Check the existance of replication task', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new DMSReplicationStack.DMSReplicationStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource('AWS::DMS::ReplicationTask'));
});
