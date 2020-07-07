"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
const core_1 = require("@aws-cdk/core");
class SecurityStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        this.lambda_sg = new aws_ec2_1.SecurityGroup(this, 'lambdasg', {
            securityGroupName: `${environment}-lambda-sg`,
            vpc: props.vpc,
            description: 'Security Group for lambda functions',
            allowAllOutbound: true,
        });
        this.bastion_sg = new aws_ec2_1.SecurityGroup(this, 'bastionsg', {
            securityGroupName: `${environment}-bastion-sg`,
            vpc: props.vpc,
            description: 'Security Group for Bastion Host',
            allowAllOutbound: true,
        });
        this.bastion_sg.addIngressRule(aws_ec2_1.Peer.anyIpv4(), aws_ec2_1.Port.tcp(22), 'SSH Access');
        this.redis_sg = new aws_ec2_1.SecurityGroup(this, 'redissg', {
            securityGroupName: `${environment}-redis-sg`,
            vpc: props.vpc,
            description: 'Security Group for Redis cluster',
            allowAllOutbound: true,
        });
        this.redis_sg.addIngressRule(this.lambda_sg, aws_ec2_1.Port.tcp(6379), `Access from Lambda functions`);
        new core_1.CfnOutput(this, 'redis-export', {
            exportName: 'redis-sg-export',
            value: this.redis_sg.securityGroupId,
        });
        //  lambda functions role definition
        this.lambda_role = new aws_iam_1.Role(this, `lambdaRole`, {
            assumedBy: new aws_iam_1.ServicePrincipal('lambda.amazonaws.com'),
            roleName: 'lambda-role',
            managedPolicies: [aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName(`service-role/AWSLambdaBasicExecutionRole`)],
        });
        //  custom inline policy
        this.lambda_role.addToPolicy(new aws_iam_1.PolicyStatement({
            actions: [`s3:*`, `rds:*`],
            resources: [`*`],
        }));
        //  SSM Parameters
        new aws_ssm_1.StringParameter(this, `lambdasg-param`, {
            parameterName: `/${environment}/lambda-sg`,
            stringValue: this.lambda_sg.securityGroupId,
        });
        new aws_ssm_1.StringParameter(this, `lambdarole-param-arn`, {
            parameterName: `/${environment}/lambda-role-arn`,
            stringValue: this.lambda_role.roleArn,
        });
        new aws_ssm_1.StringParameter(this, `lambdarole-param-name`, {
            parameterName: `/${environment}/lambda-role-name`,
            stringValue: this.lambda_role.roleName,
        });
    }
}
exports.SecurityStack = SecurityStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHktc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN1cml0eS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQWtHO0FBQ2xHLDhDQUFpRztBQUNqRyw4Q0FBbUQ7QUFDbkQsd0NBQTBDO0FBTTFDLE1BQWEsYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBTXhDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsaUJBQWlCLEVBQUUsR0FBRyxXQUFXLFlBQVk7WUFDN0MsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLHFDQUFxQztZQUNsRCxnQkFBZ0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDbkQsaUJBQWlCLEVBQUUsR0FBRyxXQUFXLGFBQWE7WUFDOUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLGlDQUFpQztZQUM5QyxnQkFBZ0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDL0MsaUJBQWlCLEVBQUUsR0FBRyxXQUFXLFdBQVc7WUFDNUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLGtDQUFrQztZQUMvQyxnQkFBZ0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1FBRTdGLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2hDLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZTtTQUN2QyxDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzVDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHNCQUFzQixDQUFDO1lBQ3ZELFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLGVBQWUsRUFBRSxDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsMENBQTBDLENBQUMsQ0FBQztTQUN4RyxDQUFDLENBQUM7UUFFSCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQ3hCLElBQUkseUJBQWUsQ0FBQztZQUNoQixPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO1lBQzFCLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNuQixDQUFDLENBQ0wsQ0FBQztRQUVGLGtCQUFrQjtRQUNsQixJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3hDLGFBQWEsRUFBRSxJQUFJLFdBQVcsWUFBWTtZQUMxQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlO1NBQzlDLENBQUMsQ0FBQztRQUNILElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDOUMsYUFBYSxFQUFFLElBQUksV0FBVyxrQkFBa0I7WUFDaEQsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTztTQUN4QyxDQUFDLENBQUM7UUFDSCxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQy9DLGFBQWEsRUFBRSxJQUFJLFdBQVcsbUJBQW1CO1lBQ2pELFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVE7U0FDekMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBdEVELHNDQXNFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuaW1wb3J0IHsgU2VjdXJpdHlHcm91cCwgSVZwYywgUGVlciwgUG9ydCwgSU1hY2hpbmVJbWFnZSwgSVNlY3VyaXR5R3JvdXAgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcclxuaW1wb3J0IHsgSVJvbGUsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xyXG5pbXBvcnQgeyBTdHJpbmdQYXJhbWV0ZXIgfSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcclxuaW1wb3J0IHsgQ2ZuT3V0cHV0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcblxyXG5pbnRlcmZhY2UgU2VjdXJpdHlTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xyXG4gICAgdnBjOiBJVnBjO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2VjdXJpdHlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgICBwdWJsaWMgbGFtYmRhX3NnOiBJU2VjdXJpdHlHcm91cDtcclxuICAgIHB1YmxpYyBiYXN0aW9uX3NnOiBJU2VjdXJpdHlHcm91cDtcclxuICAgIHB1YmxpYyByZWRpc19zZzogSVNlY3VyaXR5R3JvdXA7XHJcbiAgICBwdWJsaWMgbGFtYmRhX3JvbGU6IElSb2xlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2VjdXJpdHlTdGFja1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxyXG4gICAgICAgIGNvbnN0IHByb2plY3RfbmFtZSA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdwcm9qZWN0X25hbWUnKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdlbnZpcm9ubWVudCcpO1xyXG5cclxuICAgICAgICB0aGlzLmxhbWJkYV9zZyA9IG5ldyBTZWN1cml0eUdyb3VwKHRoaXMsICdsYW1iZGFzZycsIHtcclxuICAgICAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6IGAke2Vudmlyb25tZW50fS1sYW1iZGEtc2dgLFxyXG4gICAgICAgICAgICB2cGM6IHByb3BzLnZwYyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBHcm91cCBmb3IgbGFtYmRhIGZ1bmN0aW9ucycsXHJcbiAgICAgICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmFzdGlvbl9zZyA9IG5ldyBTZWN1cml0eUdyb3VwKHRoaXMsICdiYXN0aW9uc2cnLCB7XHJcbiAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiBgJHtlbnZpcm9ubWVudH0tYmFzdGlvbi1zZ2AsXHJcbiAgICAgICAgICAgIHZwYzogcHJvcHMudnBjLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NlY3VyaXR5IEdyb3VwIGZvciBCYXN0aW9uIEhvc3QnLFxyXG4gICAgICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYmFzdGlvbl9zZy5hZGRJbmdyZXNzUnVsZShQZWVyLmFueUlwdjQoKSwgUG9ydC50Y3AoMjIpLCAnU1NIIEFjY2VzcycpO1xyXG5cclxuICAgICAgICB0aGlzLnJlZGlzX3NnID0gbmV3IFNlY3VyaXR5R3JvdXAodGhpcywgJ3JlZGlzc2cnLCB7XHJcbiAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmVkaXMtc2dgLFxyXG4gICAgICAgICAgICB2cGM6IHByb3BzLnZwYyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBHcm91cCBmb3IgUmVkaXMgY2x1c3RlcicsXHJcbiAgICAgICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWRpc19zZy5hZGRJbmdyZXNzUnVsZSh0aGlzLmxhbWJkYV9zZywgUG9ydC50Y3AoNjM3OSksIGBBY2Nlc3MgZnJvbSBMYW1iZGEgZnVuY3Rpb25zYCk7XHJcblxyXG4gICAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ3JlZGlzLWV4cG9ydCcsIHtcclxuICAgICAgICAgICAgZXhwb3J0TmFtZTogJ3JlZGlzLXNnLWV4cG9ydCcsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnJlZGlzX3NnLnNlY3VyaXR5R3JvdXBJZCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIGxhbWJkYSBmdW5jdGlvbnMgcm9sZSBkZWZpbml0aW9uXHJcbiAgICAgICAgdGhpcy5sYW1iZGFfcm9sZSA9IG5ldyBSb2xlKHRoaXMsIGBsYW1iZGFSb2xlYCwge1xyXG4gICAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxyXG4gICAgICAgICAgICByb2xlTmFtZTogJ2xhbWJkYS1yb2xlJyxcclxuICAgICAgICAgICAgbWFuYWdlZFBvbGljaWVzOiBbTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoYHNlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGVgKV0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBjdXN0b20gaW5saW5lIHBvbGljeVxyXG4gICAgICAgIHRoaXMubGFtYmRhX3JvbGUuYWRkVG9Qb2xpY3koXHJcbiAgICAgICAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uczogW2BzMzoqYCwgYHJkczoqYF0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFtgKmBdLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyAgU1NNIFBhcmFtZXRlcnNcclxuICAgICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsIGBsYW1iZGFzZy1wYXJhbWAsIHtcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogYC8ke2Vudmlyb25tZW50fS9sYW1iZGEtc2dgLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogdGhpcy5sYW1iZGFfc2cuc2VjdXJpdHlHcm91cElkLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5ldyBTdHJpbmdQYXJhbWV0ZXIodGhpcywgYGxhbWJkYXJvbGUtcGFyYW0tYXJuYCwge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBgLyR7ZW52aXJvbm1lbnR9L2xhbWJkYS1yb2xlLWFybmAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiB0aGlzLmxhbWJkYV9yb2xlLnJvbGVBcm4sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmV3IFN0cmluZ1BhcmFtZXRlcih0aGlzLCBgbGFtYmRhcm9sZS1wYXJhbS1uYW1lYCwge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBgLyR7ZW52aXJvbm1lbnR9L2xhbWJkYS1yb2xlLW5hbWVgLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogdGhpcy5sYW1iZGFfcm9sZS5yb2xlTmFtZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=