//import * as cdk from '@aws-cdk/core';
import * as cdk from 'monocdk-experiment';
import codebuild = require('@aws-cdk/aws-codebuild');
import delivlib = require('aws-delivlib');

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const github = new delivlib.GitHubRepo({
      repository: 'ddweerasiri/aws-cdk-samples',
      tokenSecretArn: 'arn:aws:secretsmanager:ap-southeast-2:123456789012:secret:secret1-key',
      tokenSecretOptions: {
        jsonField: 'github-key'
      }
    });

    /**
     * Build and Test projects
     */
    const samplePipeline = new delivlib.Pipeline(this, 'GitHubConstructsPipeline', {
      title: 'CDK Samples',
      repo: github,
      branch: 'main',
      pipelineName: 'cdk-samples-main',
      notificationEmail: 'ddweerasiri+cdkconstructs-main@gmail.com',
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'commands': [
              'npm install lerna -g',
              'npm install',
              'lerna bootstrap --reject-cycles'
            ],
          },
          build: {
            'commands': [
              'lerna run build --stream',
              'lerna run test --stream'
            ],
          }
        }
      })
    });

    // Publish artifacts to NPM (or maven, nuget), if they don't exist already
    /*pipeline.publishToNpm({
      npmTokenSecret: { secretArn: 'arn:aws:secretsmanager:eu-west-1:1234567890:secret:npm-xyz' },
    });*/
  }
}