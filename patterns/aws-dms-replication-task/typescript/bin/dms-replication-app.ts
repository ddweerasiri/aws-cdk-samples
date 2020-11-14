#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DMSReplicationStack } from '../lib/dms-replication-stack';

const app = new cdk.App();
new DMSReplicationStack(app, 'DMSReplicationStack');
