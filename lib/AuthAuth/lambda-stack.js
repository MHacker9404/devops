"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
class LambdaStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        const account_id = core_1.Aws.ACCOUNT_ID;
        const region = core_1.Aws.REGION;
        const lambda = new aws_lambda_1.Function(this, 'hello-world', {
            runtime: aws_lambda_1.Runtime.NODEJS_12_X,
            code: aws_lambda_1.Code.fromAsset('lambda', {}),
            handler: 'hello.handler',
        });
        const api_gateway = new aws_apigateway_1.LambdaRestApi(this, 'api-gateway-lambda-api', {
            handler: lambda,
            restApiName: `${environment}-lambda-api`,
            proxy: false,
        });
        api_gateway.root.addMethod('ANY');
        new aws_ssm_1.StringParameter(this, 'api-gw-lambda', {
            parameterName: `/${environment}/api-gw-lambda-url`,
            stringValue: api_gateway.url,
            type: aws_ssm_1.ParameterType.STRING,
        });
        new aws_ssm_1.StringParameter(this, 'api-gw2-lambda', {
            parameterName: `/${environment}/api-gw-lambda-url-2`,
            stringValue: `http://${api_gateway.restApiId}.execute-api.${region}.amazonaws.com`,
            type: aws_ssm_1.ParameterType.STRING,
        });
        new aws_ssm_1.StringParameter(this, 'api-gw-lambda-id', {
            parameterName: `/${environment}/api-gw-lambda-id`,
            stringValue: api_gateway.restApiId,
            type: aws_ssm_1.ParameterType.STRING,
        });
    }
}
exports.LambdaStack = LambdaStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFrRTtBQUNsRSxvREFBOEQ7QUFDOUQsNERBQXdEO0FBQ3hELDhDQUFrRTtBQUVsRSxNQUFhLFdBQVksU0FBUSxZQUFLO0lBQ2xDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDeEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNELE1BQU0sVUFBVSxHQUFHLFVBQUcsQ0FBQyxVQUFVLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsVUFBRyxDQUFDLE1BQU0sQ0FBQztRQUUxQixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUM3QyxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1lBQ2xDLE9BQU8sRUFBRSxlQUFlO1NBQzNCLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDbEUsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsR0FBRyxXQUFXLGFBQWE7WUFDeEMsS0FBSyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUM7UUFDSCxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsQyxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN2QyxhQUFhLEVBQUUsSUFBSSxXQUFXLG9CQUFvQjtZQUNsRCxXQUFXLEVBQUUsV0FBVyxDQUFDLEdBQUc7WUFDNUIsSUFBSSxFQUFFLHVCQUFhLENBQUMsTUFBTTtTQUM3QixDQUFDLENBQUM7UUFDSCxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3hDLGFBQWEsRUFBRSxJQUFJLFdBQVcsc0JBQXNCO1lBQ3BELFdBQVcsRUFBRSxVQUFVLFdBQVcsQ0FBQyxTQUFTLGdCQUFnQixNQUFNLGdCQUFnQjtZQUNsRixJQUFJLEVBQUUsdUJBQWEsQ0FBQyxNQUFNO1NBQzdCLENBQUMsQ0FBQztRQUNILElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUMsYUFBYSxFQUFFLElBQUksV0FBVyxtQkFBbUI7WUFDakQsV0FBVyxFQUFFLFdBQVcsQ0FBQyxTQUFTO1lBQ2xDLElBQUksRUFBRSx1QkFBYSxDQUFDLE1BQU07U0FDN0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBeENELGtDQXdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF3cywgU3RhY2ssIENvbnN0cnVjdCwgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xyXG5pbXBvcnQgeyBGdW5jdGlvbiwgUnVudGltZSwgQ29kZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgeyBMYW1iZGFSZXN0QXBpIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknO1xyXG5pbXBvcnQgeyBTdHJpbmdQYXJhbWV0ZXIsIFBhcmFtZXRlclR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMYW1iZGFTdGFjayBleHRlbmRzIFN0YWNrIHtcclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcclxuICAgICAgICBjb25zdCBwcm9qZWN0X25hbWUgPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dCgncHJvamVjdF9uYW1lJyk7XHJcbiAgICAgICAgY29uc3QgZW52aXJvbm1lbnQgPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dCgnZW52aXJvbm1lbnQnKTtcclxuXHJcbiAgICAgICAgY29uc3QgYWNjb3VudF9pZCA9IEF3cy5BQ0NPVU5UX0lEO1xyXG4gICAgICAgIGNvbnN0IHJlZ2lvbiA9IEF3cy5SRUdJT047XHJcblxyXG4gICAgICAgIGNvbnN0IGxhbWJkYSA9IG5ldyBGdW5jdGlvbih0aGlzLCAnaGVsbG8td29ybGQnLCB7XHJcbiAgICAgICAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzEyX1gsXHJcbiAgICAgICAgICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KCdsYW1iZGEnLCB7fSksXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdoZWxsby5oYW5kbGVyJyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBpX2dhdGV3YXkgPSBuZXcgTGFtYmRhUmVzdEFwaSh0aGlzLCAnYXBpLWdhdGV3YXktbGFtYmRhLWFwaScsIHtcclxuICAgICAgICAgICAgaGFuZGxlcjogbGFtYmRhLFxyXG4gICAgICAgICAgICByZXN0QXBpTmFtZTogYCR7ZW52aXJvbm1lbnR9LWxhbWJkYS1hcGlgLFxyXG4gICAgICAgICAgICBwcm94eTogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBpX2dhdGV3YXkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xyXG5cclxuICAgICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdhcGktZ3ctbGFtYmRhJywge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBgLyR7ZW52aXJvbm1lbnR9L2FwaS1ndy1sYW1iZGEtdXJsYCxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGFwaV9nYXRld2F5LnVybCxcclxuICAgICAgICAgICAgdHlwZTogUGFyYW1ldGVyVHlwZS5TVFJJTkcsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmV3IFN0cmluZ1BhcmFtZXRlcih0aGlzLCAnYXBpLWd3Mi1sYW1iZGEnLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vYXBpLWd3LWxhbWJkYS11cmwtMmAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBgaHR0cDovLyR7YXBpX2dhdGV3YXkucmVzdEFwaUlkfS5leGVjdXRlLWFwaS4ke3JlZ2lvbn0uYW1hem9uYXdzLmNvbWAsXHJcbiAgICAgICAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5ldyBTdHJpbmdQYXJhbWV0ZXIodGhpcywgJ2FwaS1ndy1sYW1iZGEtaWQnLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vYXBpLWd3LWxhbWJkYS1pZGAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBhcGlfZ2F0ZXdheS5yZXN0QXBpSWQsXHJcbiAgICAgICAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==