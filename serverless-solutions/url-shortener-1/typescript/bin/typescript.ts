#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { URLShortenerStack } from '../lib/url-shortener-stack';

const app = new cdk.App();
new URLShortenerStack(app, 'URLShortener');
