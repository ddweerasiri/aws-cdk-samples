import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import * as api from '@aws-cdk/aws-apigateway';
import * as sns from '@aws-cdk/aws-sns';
import * as iam from '@aws-cdk/aws-iam';

/**
 * @summary The properties for the ApiGatewayToSqs class.
 */
export interface AwsApigatewaySnsProps {
  /**
   * User-provided API resource where the SNS integration be configured.
   *
   * @default - none
   */
  readonly apiResource: api.IResource;
  /**
   * User-provided HTTP method where the SNS integration be configured.
   *
   * @default - PUT
   */
  readonly httpMethod: string;
  /**
   * Existing instance of SNS topic object, if this is set then the topicProps and deployDeadLetterQueue are ignored.
   *
   * @default - None
   */
  readonly existingToipcObj?: sns.Topic;
  /**
   * User provided props to override the default props for the SQS queue.
   *
   * @default - Default props are used
   */
  readonly topicProps?: sns.TopicProps;
  /**
   * Optional IAM role that is trusted by API Gateway and grants SNS API operations
   * 
   * @default - None
   */
  readonly existingIamRole?: iam.Role;
}

export class AwsApigatewaySns extends Construct {
  public readonly apiResource: api.IResource;
  public readonly httpMethod: string;
  public readonly apiGatewayRole: iam.Role;
  public readonly snsTopic: sns.Topic;

  /**
   * @summary Constructs a new instance of AwsApigatewaySns class
   * @param {cdk.App} scope - represents the scope for all the resources.
   * @param {string} id - this is a a scope-unique id.
   * @param {AwsApigatewaySnsProps} props - user provided props for the construct.
   * @access public
   */
  constructor(scope: Construct, id: string, props: AwsApigatewaySnsProps) {
    super(scope, id);

    //Setup the SNS topic, if applicable
    if(!props.existingToipcObj) {
      this.snsTopic = new sns.Topic(this, 'snsTopic', props.topicProps);
    }
    
    //initialize resource method
    if (!props.httpMethod) {this.httpMethod = 'PUT';} else {this.httpMethod = props.httpMethod;}

    //initialize IAM role
    if (!props.existingIamRole) {
      this.apiGatewayRole = new iam.Role(this, 'apigw-invoke-sns-role', {
        assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        inlinePolicies: {
          'sns-access': new iam.PolicyDocument({
            assignSids: true,
            statements: [
              new iam.PolicyStatement({
                actions: ['sns:Publish'],
                resources: [this.snsTopic.topicArn],
                effect: iam.Effect.ALLOW
              })
            ]
          })
        }
      })
    } else {
      this.apiGatewayRole = props.existingIamRole;
    }

    // Configure the API resource
    this.apiResource = props.apiResource;
    let snsIntegration = new api.AwsIntegration({
      service: 'sns',
      action: 'Publish',
      integrationHttpMethod: 'POST',
      options: {
        credentialsRole: this.apiGatewayRole,
        requestParameters: {
          "integration.request.querystring.Message": "method.request.body",
          "integration.request.querystring.TopicArn": '\'' + this.snsTopic.topicArn + '\''
        },
        integrationResponses: [{
          statusCode: '200'
        }]
      }
    });
    this.apiResource.addMethod(props.httpMethod, snsIntegration, {
      methodResponses: [{
        statusCode: '200'  
      }]
    });
    
  }
}
