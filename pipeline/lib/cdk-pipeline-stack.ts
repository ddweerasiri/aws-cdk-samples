//import * as cdk from '@aws-cdk/core';
import * as cdk from 'monocdk-experiment';
import codebuild = require('@aws-cdk/aws-codebuild');
import delivlib = require('aws-delivlib');

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const github = new delivlib.GitHubRepo ({
      repository: 'ddweerasiri/aws-cdk-samples',
      tokenSecretArn: 'arn:aws:secretsmanager:ap-southeast-2:123456789012:secret:npm-key-QtU7aC',
      tokenSecretOptions: {
        jsonField: 'github-key'
      }
    });

    /*const pipeline = new delivlib.Pipeline(this, 'MyPipeline', {
      // Build, Test, Lint and package your libarary here
    });*/
    const pipeline = new delivlib.Pipeline(this, 'GitHubPipeline', {
      title: 'CDK Constructs',
      repo: github,
      branch: 'main',
      pipelineName: 'cdkconstructs-main',
      notificationEmail: 'ddweerasiri+cdkconstructs-main@gmail.com',
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'commands': [
              'npm install -g aws-cdk && cdk --version',
              'cd ./patterns/aws-apigateway-mock/typescript' 
            ],
          },
          pre_build: {
            'commands': [
              'npm install' 
            ]
          },
          build: {
            'commands': [
              'npm run build',       // Run build, tests, linter and package
            ],
          },
        }
      })
    }); 

    // Publish artifacts to NPM (or maven, nuget), if they don't exist already
    /*pipeline.publishToNpm({
      npmTokenSecret: { secretArn: 'arn:aws:secretsmanager:eu-west-1:1234567890:secret:npm-xyz' },
    });*/
  }
}