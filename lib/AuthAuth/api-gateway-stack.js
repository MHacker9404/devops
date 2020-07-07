"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
class ApiGatewayStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        const account_id = core_1.Aws.ACCOUNT_ID;
        const region = core_1.Aws.REGION;
        // const api_gateway = new LambdaRestApi(this, 'api-gateway', {
        // });
        const api_gateway = new aws_apigateway_1.RestApi(this, 'api-gateway-restapi', {
            endpointTypes: [aws_apigateway_1.EndpointType.REGIONAL],
            restApiName: `${project_name}-service`,
        });
        api_gateway.root.addMethod('ANY');
        new aws_ssm_1.StringParameter(this, 'api-gw', {
            parameterName: `/${environment}/api-gw-url`,
            stringValue: api_gateway.url,
            type: aws_ssm_1.ParameterType.STRING,
        });
        new aws_ssm_1.StringParameter(this, 'api-gw2', {
            parameterName: `/${environment}/api-gw-url-2`,
            stringValue: `http://${api_gateway.restApiId}.execute-api.${region}.amazonaws.com`,
            type: aws_ssm_1.ParameterType.STRING,
        });
        new aws_ssm_1.StringParameter(this, 'api-gw-id', {
            parameterName: `/${environment}/api-gw-id`,
            stringValue: api_gateway.restApiId,
            type: aws_ssm_1.ParameterType.STRING,
        });
    }
}
exports.ApiGatewayStack = ApiGatewayStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWdhdGV3YXktc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGktZ2F0ZXdheS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBa0U7QUFDbEUsNERBQWdFO0FBQ2hFLDhDQUFrRTtBQUVsRSxNQUFhLGVBQWdCLFNBQVEsWUFBSztJQUN0QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3hELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDZDQUE2QztRQUM3QyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUzRCxNQUFNLFVBQVUsR0FBRyxVQUFHLENBQUMsVUFBVSxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLFVBQUcsQ0FBQyxNQUFNLENBQUM7UUFFMUIsK0RBQStEO1FBQy9ELE1BQU07UUFDTixNQUFNLFdBQVcsR0FBRyxJQUFJLHdCQUFPLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3pELGFBQWEsRUFBRSxDQUFDLDZCQUFZLENBQUMsUUFBUSxDQUFDO1lBQ3RDLFdBQVcsRUFBRSxHQUFHLFlBQVksVUFBVTtTQUN6QyxDQUFDLENBQUM7UUFDSCxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsQyxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNoQyxhQUFhLEVBQUUsSUFBSSxXQUFXLGFBQWE7WUFDM0MsV0FBVyxFQUFFLFdBQVcsQ0FBQyxHQUFHO1lBQzVCLElBQUksRUFBRSx1QkFBYSxDQUFDLE1BQU07U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsSUFBSSx5QkFBZSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDakMsYUFBYSxFQUFFLElBQUksV0FBVyxlQUFlO1lBQzdDLFdBQVcsRUFBRSxVQUFVLFdBQVcsQ0FBQyxTQUFTLGdCQUFnQixNQUFNLGdCQUFnQjtZQUNsRixJQUFJLEVBQUUsdUJBQWEsQ0FBQyxNQUFNO1NBQzdCLENBQUMsQ0FBQztRQUNILElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ25DLGFBQWEsRUFBRSxJQUFJLFdBQVcsWUFBWTtZQUMxQyxXQUFXLEVBQUUsV0FBVyxDQUFDLFNBQVM7WUFDbEMsSUFBSSxFQUFFLHVCQUFhLENBQUMsTUFBTTtTQUM3QixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFuQ0QsMENBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXdzLCBTdGFjaywgQ29uc3RydWN0LCBTdGFja1Byb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcbmltcG9ydCB7IFJlc3RBcGksIEVuZHBvaW50VHlwZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcclxuaW1wb3J0IHsgU3RyaW5nUGFyYW1ldGVyLCBQYXJhbWV0ZXJUeXBlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpR2F0ZXdheVN0YWNrIGV4dGVuZHMgU3RhY2sge1xyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxyXG4gICAgICAgIGNvbnN0IHByb2plY3RfbmFtZSA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdwcm9qZWN0X25hbWUnKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdlbnZpcm9ubWVudCcpO1xyXG5cclxuICAgICAgICBjb25zdCBhY2NvdW50X2lkID0gQXdzLkFDQ09VTlRfSUQ7XHJcbiAgICAgICAgY29uc3QgcmVnaW9uID0gQXdzLlJFR0lPTjtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgYXBpX2dhdGV3YXkgPSBuZXcgTGFtYmRhUmVzdEFwaSh0aGlzLCAnYXBpLWdhdGV3YXknLCB7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgY29uc3QgYXBpX2dhdGV3YXkgPSBuZXcgUmVzdEFwaSh0aGlzLCAnYXBpLWdhdGV3YXktcmVzdGFwaScsIHtcclxuICAgICAgICAgICAgZW5kcG9pbnRUeXBlczogW0VuZHBvaW50VHlwZS5SRUdJT05BTF0sXHJcbiAgICAgICAgICAgIHJlc3RBcGlOYW1lOiBgJHtwcm9qZWN0X25hbWV9LXNlcnZpY2VgLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFwaV9nYXRld2F5LnJvb3QuYWRkTWV0aG9kKCdBTlknKTtcclxuXHJcbiAgICAgICAgbmV3IFN0cmluZ1BhcmFtZXRlcih0aGlzLCAnYXBpLWd3Jywge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBgLyR7ZW52aXJvbm1lbnR9L2FwaS1ndy11cmxgLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogYXBpX2dhdGV3YXkudXJsLFxyXG4gICAgICAgICAgICB0eXBlOiBQYXJhbWV0ZXJUeXBlLlNUUklORyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdhcGktZ3cyJywge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBgLyR7ZW52aXJvbm1lbnR9L2FwaS1ndy11cmwtMmAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBgaHR0cDovLyR7YXBpX2dhdGV3YXkucmVzdEFwaUlkfS5leGVjdXRlLWFwaS4ke3JlZ2lvbn0uYW1hem9uYXdzLmNvbWAsXHJcbiAgICAgICAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5ldyBTdHJpbmdQYXJhbWV0ZXIodGhpcywgJ2FwaS1ndy1pZCcsIHtcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogYC8ke2Vudmlyb25tZW50fS9hcGktZ3ctaWRgLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogYXBpX2dhdGV3YXkucmVzdEFwaUlkLFxyXG4gICAgICAgICAgICB0eXBlOiBQYXJhbWV0ZXJUeXBlLlNUUklORyxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=