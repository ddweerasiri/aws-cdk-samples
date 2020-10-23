"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLShortenerStack = void 0;
const cdk = require("@aws-cdk/core");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
class URLShortenerStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const table = new dynamodb.Table(this, 'myTable', {
            partitionKey: { name: 'shortUrl', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        // Lambda function - URL generator
        const urlGenerator = new lambda.Function(this, 'urlGenerator', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'url-generator.handler',
            code: lambda.Code.fromAsset("./lambda"),
            environment: {
                'TableName': table.tableName
            }
        });
        // Lambda function - URL redirector
        const urlRedirector = new lambda.Function(this, 'urlRedirector', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'url-redirector.handler',
            code: lambda.Code.fromAsset("./lambda"),
            environment: {
                'TableName': table.tableName
            }
        });
        table.grantReadWriteData(urlGenerator);
        table.grantReadData(urlRedirector);
        //API endpoint
        const api = new apigw.LambdaRestApi(this, 'restAPI', {
            handler: urlGenerator,
            restApiName: 'urlShortenerAPI',
            proxy: false
        });
        //POST method
        const postPath = api.root.addResource('url-shortener');
        postPath.addMethod('POST', new aws_apigateway_1.LambdaIntegration(urlGenerator), {});
        //GET method
        const getPath = api.root.addProxy();
        getPath.addMethod('GET', new aws_apigateway_1.LambdaIntegration(urlRedirector), {});
        //Add environment variable
        //urlGenerator.addEnvironment("APIid", api.restApiId);
    }
}
exports.URLShortenerStack = URLShortenerStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLXNob3J0ZW5lci1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVybC1zaG9ydGVuZXItc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLGtEQUFrRDtBQUNsRCw4Q0FBOEM7QUFDOUMsaURBQWlEO0FBQ2pELDREQUE0RDtBQUU1RCxNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ2hELFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3ZFLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDekMsQ0FBQyxDQUFDO1FBRUgsa0NBQWtDO1FBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLHVCQUF1QjtZQUNoQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVM7YUFDN0I7U0FDRixDQUFDLENBQUM7UUFFSCxtQ0FBbUM7UUFDbkMsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDL0QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsd0JBQXdCO1lBQ2pDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDdkMsV0FBVyxFQUFFO2dCQUNYLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUzthQUM3QjtTQUNGLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2QyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRW5DLGNBQWM7UUFDZCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUNuRCxPQUFPLEVBQUUsWUFBWTtZQUNyQixXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsYUFBYTtRQUNiLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZELFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksa0NBQWlCLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFcEUsWUFBWTtRQUNaLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxrQ0FBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVsRSwwQkFBMEI7UUFDMUIsc0RBQXNEO0lBQ3hELENBQUM7Q0FDRjtBQW5ERCw4Q0FtREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0IHsgTGFtYmRhSW50ZWdyYXRpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheSc7XG5cbmV4cG9ydCBjbGFzcyBVUkxTaG9ydGVuZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcbiAgICBjb25zdCB0YWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCAnbXlUYWJsZScsIHtcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAnc2hvcnRVcmwnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgIH0pO1xuXG4gICAgLy8gTGFtYmRhIGZ1bmN0aW9uIC0gVVJMIGdlbmVyYXRvclxuICAgIGNvbnN0IHVybEdlbmVyYXRvciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ3VybEdlbmVyYXRvcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgaGFuZGxlcjogJ3VybC1nZW5lcmF0b3IuaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoXCIuL2xhbWJkYVwiKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICdUYWJsZU5hbWUnOiB0YWJsZS50YWJsZU5hbWVcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExhbWJkYSBmdW5jdGlvbiAtIFVSTCByZWRpcmVjdG9yXG4gICAgY29uc3QgdXJsUmVkaXJlY3RvciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ3VybFJlZGlyZWN0b3InLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgIGhhbmRsZXI6ICd1cmwtcmVkaXJlY3Rvci5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChcIi4vbGFtYmRhXCIpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgJ1RhYmxlTmFtZSc6IHRhYmxlLnRhYmxlTmFtZVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHVybEdlbmVyYXRvcik7XG4gICAgdGFibGUuZ3JhbnRSZWFkRGF0YSh1cmxSZWRpcmVjdG9yKTtcblxuICAgIC8vQVBJIGVuZHBvaW50XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkodGhpcywgJ3Jlc3RBUEknLCB7XG4gICAgICBoYW5kbGVyOiB1cmxHZW5lcmF0b3IsXG4gICAgICByZXN0QXBpTmFtZTogJ3VybFNob3J0ZW5lckFQSScsXG4gICAgICBwcm94eTogZmFsc2VcbiAgICB9KTtcblxuICAgIC8vUE9TVCBtZXRob2RcbiAgICBjb25zdCBwb3N0UGF0aCA9IGFwaS5yb290LmFkZFJlc291cmNlKCd1cmwtc2hvcnRlbmVyJyk7XG4gICAgcG9zdFBhdGguYWRkTWV0aG9kKCdQT1NUJywgbmV3IExhbWJkYUludGVncmF0aW9uKHVybEdlbmVyYXRvciksIHt9KTtcblxuICAgIC8vR0VUIG1ldGhvZFxuICAgIGNvbnN0IGdldFBhdGggPSBhcGkucm9vdC5hZGRQcm94eSgpO1xuICAgIGdldFBhdGguYWRkTWV0aG9kKCdHRVQnLCBuZXcgTGFtYmRhSW50ZWdyYXRpb24odXJsUmVkaXJlY3RvciksIHt9KVxuXG4gICAgLy9BZGQgZW52aXJvbm1lbnQgdmFyaWFibGVcbiAgICAvL3VybEdlbmVyYXRvci5hZGRFbnZpcm9ubWVudChcIkFQSWlkXCIsIGFwaS5yZXN0QXBpSWQpO1xuICB9XG59Il19