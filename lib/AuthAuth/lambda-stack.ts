import { Aws, Stack, Construct, StackProps } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { StringParameter, ParameterType } from '@aws-cdk/aws-ssm';

export class LambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        const account_id = Aws.ACCOUNT_ID;
        const region = Aws.REGION;

        const lambda = new Function(this, 'hello-world', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset('lambda', {}),
            handler: 'hello.handler',
        });

        const api_gateway = new LambdaRestApi(this, 'api-gateway-lambda-api', {
            handler: lambda,
            restApiName: `${environment}-lambda-api`,
            proxy: false,
        });
        api_gateway.root.addMethod('ANY');

        new StringParameter(this, 'api-gw-lambda', {
            parameterName: `/${environment}/api-gw-lambda-url`,
            stringValue: api_gateway.url,
            type: ParameterType.STRING,
        });
        new StringParameter(this, 'api-gw2-lambda', {
            parameterName: `/${environment}/api-gw-lambda-url-2`,
            stringValue: `http://${api_gateway.restApiId}.execute-api.${region}.amazonaws.com`,
            type: ParameterType.STRING,
        });
        new StringParameter(this, 'api-gw-lambda-id', {
            parameterName: `/${environment}/api-gw-lambda-id`,
            stringValue: api_gateway.restApiId,
            type: ParameterType.STRING,
        });
    }
}
