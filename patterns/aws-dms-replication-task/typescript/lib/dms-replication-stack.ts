import * as cdk from '@aws-cdk/core';
import * as dms from '@aws-cdk/aws-dms';

export class DMSReplicationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const internalProps = {
      replicationInstanceProps: {
        vpcId: 'vpc-################',
        subnetIds: ['subnet-########', 'subnet-########', 'subnet-########'],
        replicationInstanceClass: 'dms.t2.small',
        securityGroups: ['sg-################']
      },
      replicationTaskProps: {
        migrationType: 'full-load',
        tableMappings: {
          "rules": [{
            "rule-type": "selection",
            "rule-id": "1",
            "rule-name": "1",
            "object-locator": {
              "schema-name": "dms_sample",
              "table-name": "%"
            },
            "rule-action": "include"
          }]
        }
      }

    };

    // Create a subnet group that allows DMS to access your data
    const subnet = new dms.CfnReplicationSubnetGroup(this, 'SubnetGroup', {
      //replicationSubnetGroupIdentifier: 'cdk-subnetgroup',
      replicationSubnetGroupDescription: 'Subnets that have access to my data source and target.',
      subnetIds: internalProps.replicationInstanceProps.subnetIds,
    });

    // Launch an instance in the subnet group
    const instance = new dms.CfnReplicationInstance(this, 'Instance', {
      replicationInstanceIdentifier: 'cdk-instance',

      // Use the appropriate instance class
      replicationInstanceClass: internalProps.replicationInstanceProps.replicationInstanceClass,

      // Setup networking
      replicationSubnetGroupIdentifier: subnet.replicationSubnetGroupIdentifier,
      vpcSecurityGroupIds: internalProps.replicationInstanceProps.securityGroups,
    });

    // Create endpoints for your data, see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html
    const source = new dms.CfnEndpoint(this, 'Source', {
      endpointIdentifier: 'cdk-source',
      endpointType: 'source',
      engineName: 'mysql',

      serverName: '################',
      port: 3306,
      databaseName: '################',
      username: '################',
      password: '################',
    });

    //s3 target
    /* const target = new dms.CfnEndpoint(this, 'Target', {
      endpointIdentifier: 'cdk-target',
      endpointType: 'target',
      engineName: 's3',

      s3Settings: {
        bucketName: 'target-bucket'
      },
    }); */

    //aurora target
    const target = new dms.CfnEndpoint(this, 'Target', {
      endpointIdentifier: 'cdk-target',
      endpointType: 'target',
      engineName: 'aurora',

      serverName: '################',
      port: 3306,
      databaseName: '################',
      username: '################',
      password: '################',
    });

    // Define the replication task
    const task = new dms.CfnReplicationTask(this, 'Task', {
      replicationInstanceArn: instance.ref,

      migrationType: internalProps.replicationTaskProps.migrationType,
      sourceEndpointArn: source.ref,
      targetEndpointArn: target.ref,
      tableMappings: JSON.stringify(internalProps.replicationTaskProps.tableMappings)
    });

    cdk.Tag.add(this, 'Project', 'DMS-Demo-via-CDK');
  }
}
