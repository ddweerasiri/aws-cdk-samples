#!/usr/bin/env node
import 'source-map-support/register';
//import * as cdk from '@aws-cdk/core';
import * as cdk from 'monocdk-experiment';
import { PipelineStack } from '../lib/cdk-pipeline-stack';

const app = new cdk.App();
new PipelineStack(app, 'CICD-Pipeline-Stack');
