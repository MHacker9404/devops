"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_cognito_1 = require("@aws-cdk/aws-cognito");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
class CognitoStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        const userPool = new aws_cognito_1.CfnUserPool(this, 'cognito-user-pool', {
            autoVerifiedAttributes: ['email'],
            usernameAttributes: ['email', 'phone_number'],
            userPoolName: `${project_name}-user-pool`,
            schema: [
                {
                    attributeDataType: 'String',
                    name: 'param1',
                    mutable: true,
                },
            ],
            policies: {
                passwordPolicy: {
                    minimumLength: 10,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSymbols: false,
                    requireUppercase: true,
                },
            },
        });
        const userPoolClient = new aws_cognito_1.CfnUserPoolClient(this, 'cognito-user-pool-client', {
            userPoolId: userPool.ref,
            clientName: `${environment}-app-client`,
        });
        const identity_pool = new aws_cognito_1.CfnIdentityPool(this, 'cognito-identity-pool', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [
                {
                    clientId: userPoolClient.ref,
                    providerName: userPool.attrProviderName,
                },
            ],
            identityPoolName: `${project_name}-identity-pool`,
        });
        new aws_ssm_1.StringParameter(this, 'app-id', {
            parameterName: `/${environment}/cognito-app-client-id`,
            stringValue: userPoolClient.ref,
            type: aws_ssm_1.ParameterType.STRING,
        });
        new aws_ssm_1.StringParameter(this, 'user-pool-id', {
            parameterName: `/${environment}/cognito-user-pool-id`,
            stringValue: userPoolClient.userPoolId,
            type: aws_ssm_1.ParameterType.STRING,
        });
        new aws_ssm_1.StringParameter(this, 'identity-pool-id', {
            parameterName: `/${environment}/cognito-identity-pool-id`,
            stringValue: identity_pool.ref,
            type: aws_ssm_1.ParameterType.STRING,
        });
    }
}
exports.CognitoStack = CognitoStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8tc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHNEQUF1RjtBQUN2Riw4Q0FBa0U7QUFFbEUsTUFBYSxZQUFhLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdkMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFDN0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFM0QsTUFBTSxRQUFRLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN4RCxzQkFBc0IsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNqQyxrQkFBa0IsRUFBRSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUM7WUFDN0MsWUFBWSxFQUFFLEdBQUcsWUFBWSxZQUFZO1lBQ3pDLE1BQU0sRUFBRTtnQkFDSjtvQkFDSSxpQkFBaUIsRUFBRSxRQUFRO29CQUMzQixJQUFJLEVBQUUsUUFBUTtvQkFDZCxPQUFPLEVBQUUsSUFBSTtpQkFDaEI7YUFDSjtZQUNELFFBQVEsRUFBRTtnQkFDTixjQUFjLEVBQUU7b0JBQ1osYUFBYSxFQUFFLEVBQUU7b0JBQ2pCLGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCLGNBQWMsRUFBRSxJQUFJO29CQUNwQixjQUFjLEVBQUUsS0FBSztvQkFDckIsZ0JBQWdCLEVBQUUsSUFBSTtpQkFDekI7YUFDSjtTQUNKLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksK0JBQWlCLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQzNFLFVBQVUsRUFBRSxRQUFRLENBQUMsR0FBRztZQUN4QixVQUFVLEVBQUUsR0FBRyxXQUFXLGFBQWE7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSw2QkFBZSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUNyRSw4QkFBOEIsRUFBRSxLQUFLO1lBQ3JDLHdCQUF3QixFQUFFO2dCQUN0QjtvQkFDSSxRQUFRLEVBQUUsY0FBYyxDQUFDLEdBQUc7b0JBQzVCLFlBQVksRUFBRSxRQUFRLENBQUMsZ0JBQWdCO2lCQUMxQzthQUNKO1lBQ0QsZ0JBQWdCLEVBQUUsR0FBRyxZQUFZLGdCQUFnQjtTQUNwRCxDQUFDLENBQUM7UUFFSCxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNoQyxhQUFhLEVBQUUsSUFBSSxXQUFXLHdCQUF3QjtZQUN0RCxXQUFXLEVBQUUsY0FBYyxDQUFDLEdBQUc7WUFDL0IsSUFBSSxFQUFFLHVCQUFhLENBQUMsTUFBTTtTQUM3QixDQUFDLENBQUM7UUFDSCxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0QyxhQUFhLEVBQUUsSUFBSSxXQUFXLHVCQUF1QjtZQUNyRCxXQUFXLEVBQUUsY0FBYyxDQUFDLFVBQVU7WUFDdEMsSUFBSSxFQUFFLHVCQUFhLENBQUMsTUFBTTtTQUM3QixDQUFDLENBQUM7UUFDSCxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzFDLGFBQWEsRUFBRSxJQUFJLFdBQVcsMkJBQTJCO1lBQ3pELFdBQVcsRUFBRSxhQUFhLENBQUMsR0FBRztZQUM5QixJQUFJLEVBQUUsdUJBQWEsQ0FBQyxNQUFNO1NBQzdCLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQTlERCxvQ0E4REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcbmltcG9ydCB7IENmblVzZXJQb29sLCBDZm5Vc2VyUG9vbENsaWVudCwgQ2ZuSWRlbnRpdHlQb29sIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZ25pdG8nO1xyXG5pbXBvcnQgeyBTdHJpbmdQYXJhbWV0ZXIsIFBhcmFtZXRlclR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2duaXRvU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXHJcbiAgICAgICAgY29uc3QgcHJvamVjdF9uYW1lID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ3Byb2plY3RfbmFtZScpO1xyXG4gICAgICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ2Vudmlyb25tZW50Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXJQb29sID0gbmV3IENmblVzZXJQb29sKHRoaXMsICdjb2duaXRvLXVzZXItcG9vbCcsIHtcclxuICAgICAgICAgICAgYXV0b1ZlcmlmaWVkQXR0cmlidXRlczogWydlbWFpbCddLFxyXG4gICAgICAgICAgICB1c2VybmFtZUF0dHJpYnV0ZXM6IFsnZW1haWwnLCAncGhvbmVfbnVtYmVyJ10sXHJcbiAgICAgICAgICAgIHVzZXJQb29sTmFtZTogYCR7cHJvamVjdF9uYW1lfS11c2VyLXBvb2xgLFxyXG4gICAgICAgICAgICBzY2hlbWE6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVEYXRhVHlwZTogJ1N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3BhcmFtMScsXHJcbiAgICAgICAgICAgICAgICAgICAgbXV0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHBvbGljaWVzOiB7XHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZFBvbGljeToge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbmltdW1MZW5ndGg6IDEwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMb3dlcmNhc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZU51bWJlcnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZVN5bWJvbHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVVcHBlcmNhc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB1c2VyUG9vbENsaWVudCA9IG5ldyBDZm5Vc2VyUG9vbENsaWVudCh0aGlzLCAnY29nbml0by11c2VyLXBvb2wtY2xpZW50Jywge1xyXG4gICAgICAgICAgICB1c2VyUG9vbElkOiB1c2VyUG9vbC5yZWYsXHJcbiAgICAgICAgICAgIGNsaWVudE5hbWU6IGAke2Vudmlyb25tZW50fS1hcHAtY2xpZW50YCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaWRlbnRpdHlfcG9vbCA9IG5ldyBDZm5JZGVudGl0eVBvb2wodGhpcywgJ2NvZ25pdG8taWRlbnRpdHktcG9vbCcsIHtcclxuICAgICAgICAgICAgYWxsb3dVbmF1dGhlbnRpY2F0ZWRJZGVudGl0aWVzOiBmYWxzZSxcclxuICAgICAgICAgICAgY29nbml0b0lkZW50aXR5UHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50SWQ6IHVzZXJQb29sQ2xpZW50LnJlZixcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlck5hbWU6IHVzZXJQb29sLmF0dHJQcm92aWRlck5hbWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBpZGVudGl0eVBvb2xOYW1lOiBgJHtwcm9qZWN0X25hbWV9LWlkZW50aXR5LXBvb2xgLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdhcHAtaWQnLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vY29nbml0by1hcHAtY2xpZW50LWlkYCxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IHVzZXJQb29sQ2xpZW50LnJlZixcclxuICAgICAgICAgICAgdHlwZTogUGFyYW1ldGVyVHlwZS5TVFJJTkcsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmV3IFN0cmluZ1BhcmFtZXRlcih0aGlzLCAndXNlci1wb29sLWlkJywge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBgLyR7ZW52aXJvbm1lbnR9L2NvZ25pdG8tdXNlci1wb29sLWlkYCxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IHVzZXJQb29sQ2xpZW50LnVzZXJQb29sSWQsXHJcbiAgICAgICAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5ldyBTdHJpbmdQYXJhbWV0ZXIodGhpcywgJ2lkZW50aXR5LXBvb2wtaWQnLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vY29nbml0by1pZGVudGl0eS1wb29sLWlkYCxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGlkZW50aXR5X3Bvb2wucmVmLFxyXG4gICAgICAgICAgICB0eXBlOiBQYXJhbWV0ZXJUeXBlLlNUUklORyxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=