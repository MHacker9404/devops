import { Aws, Stack, Construct, StackProps } from '@aws-cdk/core';
import { RestApi, EndpointType } from '@aws-cdk/aws-apigateway';
import { StringParameter, ParameterType } from '@aws-cdk/aws-ssm';

export class ApiGatewayStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        const account_id = Aws.ACCOUNT_ID;
        const region = Aws.REGION;

        // const api_gateway = new LambdaRestApi(this, 'api-gateway', {
        // });
        const api_gateway = new RestApi(this, 'api-gateway-restapi', {
            endpointTypes: [EndpointType.REGIONAL],
            restApiName: `${project_name}-service`,
        });
        api_gateway.root.addMethod('ANY');

        new StringParameter(this, 'api-gw', {
            parameterName: `/${environment}/api-gw-url`,
            stringValue: api_gateway.url,
            type: ParameterType.STRING,
        });
        new StringParameter(this, 'api-gw2', {
            parameterName: `/${environment}/api-gw-url-2`,
            stringValue: `http://${api_gateway.restApiId}.execute-api.${region}.amazonaws.com`,
            type: ParameterType.STRING,
        });
        new StringParameter(this, 'api-gw-id', {
            parameterName: `/${environment}/api-gw-id`,
            stringValue: api_gateway.restApiId,
            type: ParameterType.STRING,
        });
    }
}
