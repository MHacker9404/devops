"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdsStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_secretsmanager_1 = require("@aws-cdk/aws-secretsmanager");
const aws_rds_1 = require("@aws-cdk/aws-rds");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
const core_1 = require("@aws-cdk/core");
class RdsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        const db_creds = new aws_secretsmanager_1.Secret(this, 'db-secret', {
            secretName: `${environment}/rds-secret`,
            generateSecretString: {
                includeSpace: false,
                passwordLength: 12,
                generateStringKey: 'password',
                excludePunctuation: true,
                secretStringTemplate: JSON.stringify({ username: 'admin' }),
            },
        });
        const db_mysql = new aws_rds_1.DatabaseCluster(this, 'mysql', {
            defaultDatabaseName: `${project_name}${environment}`,
            engine: aws_rds_1.DatabaseClusterEngine.AURORA_MYSQL,
            // engineVersion: '5.7.12'
            masterUser: {
                username: 'admin',
                password: db_creds.secretValueFromJson('password'),
            },
            instanceProps: {
                vpc: props.vpc,
                vpcSubnets: { subnetType: aws_ec2_1.SubnetType.ISOLATED },
                instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.T3, aws_ec2_1.InstanceSize.SMALL),
            },
            instances: 1,
            parameterGroup: aws_rds_1.ClusterParameterGroup.fromParameterGroupName(this, 'pg-dev', 'default.aurora-mysql5.7'),
            storageEncryptionKey: props.kmsKey,
            removalPolicy: environment === 'dev' ? core_1.RemovalPolicy.DESTROY : core_1.RemovalPolicy.RETAIN,
        });
        db_mysql.connections.allowDefaultPortFrom(props.lambdaSG, 'Access from Lambda functions');
        db_mysql.connections.allowDefaultPortFrom(props.bastionSG, 'Access from bastion host');
        new aws_ssm_1.StringParameter(this, 'db-host', {
            parameterName: `/${environment}/db-host`,
            stringValue: db_mysql.clusterEndpoint.hostname,
        });
    }
}
exports.RdsStack = RdsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmRzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmRzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBOEc7QUFFOUcsb0VBQXFEO0FBQ3JELDhDQUFpRztBQUNqRyw4Q0FBbUQ7QUFDbkQsd0NBQThDO0FBUzlDLE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sUUFBUSxHQUFHLElBQUksMkJBQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQzNDLFVBQVUsRUFBRSxHQUFHLFdBQVcsYUFBYTtZQUN2QyxvQkFBb0IsRUFBRTtnQkFDbEIsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLGNBQWMsRUFBRSxFQUFFO2dCQUNsQixpQkFBaUIsRUFBRSxVQUFVO2dCQUM3QixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4QixvQkFBb0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQzlEO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSx5QkFBZSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDaEQsbUJBQW1CLEVBQUUsR0FBRyxZQUFZLEdBQUcsV0FBVyxFQUFFO1lBQ3BELE1BQU0sRUFBRSwrQkFBcUIsQ0FBQyxZQUFZO1lBQzFDLDBCQUEwQjtZQUMxQixVQUFVLEVBQUU7Z0JBQ1IsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRSxRQUFRLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDO2FBQ3JEO1lBQ0QsYUFBYSxFQUFFO2dCQUNYLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztnQkFDZCxVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsb0JBQVUsQ0FBQyxRQUFRLEVBQUU7Z0JBQy9DLFlBQVksRUFBRSxzQkFBWSxDQUFDLEVBQUUsQ0FBQyx1QkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBWSxDQUFDLEtBQUssQ0FBQzthQUN0RTtZQUNELFNBQVMsRUFBRSxDQUFDO1lBRVosY0FBYyxFQUFFLCtCQUFxQixDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUseUJBQXlCLENBQUM7WUFFdkcsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFFbEMsYUFBYSxFQUFFLFdBQVcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLG9CQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxvQkFBYSxDQUFDLE1BQU07U0FDdEYsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLDhCQUE4QixDQUFDLENBQUM7UUFDMUYsUUFBUSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFFdkYsSUFBSSx5QkFBZSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDakMsYUFBYSxFQUFFLElBQUksV0FBVyxVQUFVO1lBQ3hDLFdBQVcsRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDakQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBakRELDRCQWlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuaW1wb3J0IHsgVnBjLCBJU2VjdXJpdHlHcm91cCwgU3VibmV0VHlwZSwgSW5zdGFuY2VUeXBlLCBJbnN0YW5jZUNsYXNzLCBJbnN0YW5jZVNpemUgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcclxuaW1wb3J0IHsgSUtleSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xyXG5pbXBvcnQgeyBTZWNyZXQgfSBmcm9tICdAYXdzLWNkay9hd3Mtc2VjcmV0c21hbmFnZXInO1xyXG5pbXBvcnQgeyBEYXRhYmFzZUNsdXN0ZXIsIERhdGFiYXNlQ2x1c3RlckVuZ2luZSwgQ2x1c3RlclBhcmFtZXRlckdyb3VwIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXJkcyc7XHJcbmltcG9ydCB7IFN0cmluZ1BhcmFtZXRlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xyXG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJkc1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XHJcbiAgICB2cGM6IFZwYztcclxuICAgIGxhbWJkYVNHOiBJU2VjdXJpdHlHcm91cDtcclxuICAgIGJhc3Rpb25TRzogSVNlY3VyaXR5R3JvdXA7XHJcbiAgICBrbXNLZXk6IElLZXk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZHNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFJkc1N0YWNrUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXHJcbiAgICAgICAgY29uc3QgcHJvamVjdF9uYW1lOiBzdHJpbmcgPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dCgncHJvamVjdF9uYW1lJyk7XHJcbiAgICAgICAgY29uc3QgZW52aXJvbm1lbnQ6IHN0cmluZyA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdlbnZpcm9ubWVudCcpO1xyXG5cclxuICAgICAgICBjb25zdCBkYl9jcmVkcyA9IG5ldyBTZWNyZXQodGhpcywgJ2RiLXNlY3JldCcsIHtcclxuICAgICAgICAgICAgc2VjcmV0TmFtZTogYCR7ZW52aXJvbm1lbnR9L3Jkcy1zZWNyZXRgLFxyXG4gICAgICAgICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xyXG4gICAgICAgICAgICAgICAgaW5jbHVkZVNwYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkTGVuZ3RoOiAxMixcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRlU3RyaW5nS2V5OiAncGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZVB1bmN0dWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2VjcmV0U3RyaW5nVGVtcGxhdGU6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWU6ICdhZG1pbicgfSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRiX215c3FsID0gbmV3IERhdGFiYXNlQ2x1c3Rlcih0aGlzLCAnbXlzcWwnLCB7XHJcbiAgICAgICAgICAgIGRlZmF1bHREYXRhYmFzZU5hbWU6IGAke3Byb2plY3RfbmFtZX0ke2Vudmlyb25tZW50fWAsXHJcbiAgICAgICAgICAgIGVuZ2luZTogRGF0YWJhc2VDbHVzdGVyRW5naW5lLkFVUk9SQV9NWVNRTCxcclxuICAgICAgICAgICAgLy8gZW5naW5lVmVyc2lvbjogJzUuNy4xMidcclxuICAgICAgICAgICAgbWFzdGVyVXNlcjoge1xyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6ICdhZG1pbicsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogZGJfY3JlZHMuc2VjcmV0VmFsdWVGcm9tSnNvbigncGFzc3dvcmQnKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaW5zdGFuY2VQcm9wczoge1xyXG4gICAgICAgICAgICAgICAgdnBjOiBwcm9wcy52cGMsXHJcbiAgICAgICAgICAgICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5TTUFMTCksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGluc3RhbmNlczogMSxcclxuXHJcbiAgICAgICAgICAgIHBhcmFtZXRlckdyb3VwOiBDbHVzdGVyUGFyYW1ldGVyR3JvdXAuZnJvbVBhcmFtZXRlckdyb3VwTmFtZSh0aGlzLCAncGctZGV2JywgJ2RlZmF1bHQuYXVyb3JhLW15c3FsNS43JyksXHJcblxyXG4gICAgICAgICAgICBzdG9yYWdlRW5jcnlwdGlvbktleTogcHJvcHMua21zS2V5LFxyXG5cclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogZW52aXJvbm1lbnQgPT09ICdkZXYnID8gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZIDogUmVtb3ZhbFBvbGljeS5SRVRBSU4sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRiX215c3FsLmNvbm5lY3Rpb25zLmFsbG93RGVmYXVsdFBvcnRGcm9tKHByb3BzLmxhbWJkYVNHLCAnQWNjZXNzIGZyb20gTGFtYmRhIGZ1bmN0aW9ucycpO1xyXG4gICAgICAgIGRiX215c3FsLmNvbm5lY3Rpb25zLmFsbG93RGVmYXVsdFBvcnRGcm9tKHByb3BzLmJhc3Rpb25TRywgJ0FjY2VzcyBmcm9tIGJhc3Rpb24gaG9zdCcpO1xyXG5cclxuICAgICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdkYi1ob3N0Jywge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBgLyR7ZW52aXJvbm1lbnR9L2RiLWhvc3RgLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogZGJfbXlzcWwuY2x1c3RlckVuZHBvaW50Lmhvc3RuYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==