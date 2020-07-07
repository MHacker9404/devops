"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_elasticache_1 = require("@aws-cdk/aws-elasticache");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
//  this library may not be fully functional - the udemy course
//  uses low-level CloudFormation calls to implement the stack.
class RedisStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        const subnetIds = props.vpc.privateSubnets.map((s) => s.subnetId);
        const subnet_group = new aws_elasticache_1.CfnSubnetGroup(this, 'redis-subnet-group', {
            subnetIds: [...subnetIds],
            description: `${environment} subnet group for redis`,
        });
        const cluster = new aws_elasticache_1.CfnCacheCluster(this, `${environment}-redis-cluster`, {
            cacheNodeType: 'cache.t2.small',
            engine: 'redis',
            numCacheNodes: 1,
            clusterName: `${project_name}-redis-${environment}`,
            cacheSubnetGroupName: subnet_group.ref,
            vpcSecurityGroupIds: [props.redisSG.securityGroupId],
            autoMinorVersionUpgrade: true,
        });
        cluster.addDependsOn(subnet_group);
        new aws_ssm_1.StringParameter(this, 'redis-endpoint', {
            parameterName: `/${environment}/redis-endpoint`,
            stringValue: cluster.attrRedisEndpointAddress,
        });
        new aws_ssm_1.StringParameter(this, 'redis-port', {
            parameterName: `/${environment}/redis-port`,
            stringValue: cluster.attrRedisEndpointPort,
        });
    }
}
exports.RedisStack = RedisStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWRpcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFFckMsOERBQTJFO0FBQzNFLDhDQUFtRDtBQVFuRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELE1BQWEsVUFBVyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWxFLE1BQU0sWUFBWSxHQUFHLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDaEUsU0FBUyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDekIsV0FBVyxFQUFFLEdBQUcsV0FBVyx5QkFBeUI7U0FDdkQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksRUFBRSxHQUFHLFdBQVcsZ0JBQWdCLEVBQUU7WUFDdEUsYUFBYSxFQUFFLGdCQUFnQjtZQUMvQixNQUFNLEVBQUUsT0FBTztZQUNmLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLFdBQVcsRUFBRSxHQUFHLFlBQVksVUFBVSxXQUFXLEVBQUU7WUFDbkQsb0JBQW9CLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDdEMsbUJBQW1CLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztZQUNwRCx1QkFBdUIsRUFBRSxJQUFJO1NBQ2hDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkMsSUFBSSx5QkFBZSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN4QyxhQUFhLEVBQUUsSUFBSSxXQUFXLGlCQUFpQjtZQUMvQyxXQUFXLEVBQUUsT0FBTyxDQUFDLHdCQUF3QjtTQUNoRCxDQUFDLENBQUM7UUFDSCxJQUFJLHlCQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwQyxhQUFhLEVBQUUsSUFBSSxXQUFXLGFBQWE7WUFDM0MsV0FBVyxFQUFFLE9BQU8sQ0FBQyxxQkFBcUI7U0FDN0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBbkNELGdDQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuaW1wb3J0IHsgSVNlY3VyaXR5R3JvdXAsIElWcGMgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcclxuaW1wb3J0IHsgQ2ZuU3VibmV0R3JvdXAsIENmbkNhY2hlQ2x1c3RlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljYWNoZSc7XHJcbmltcG9ydCB7IFN0cmluZ1BhcmFtZXRlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZWRpc1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XHJcbiAgICB2cGM6IElWcGM7XHJcbiAgICAvLyByZWRpc1NHOiBzdHJpbmc7XHJcbiAgICByZWRpc1NHOiBJU2VjdXJpdHlHcm91cDtcclxufVxyXG5cclxuLy8gIHRoaXMgbGlicmFyeSBtYXkgbm90IGJlIGZ1bGx5IGZ1bmN0aW9uYWwgLSB0aGUgdWRlbXkgY291cnNlXHJcbi8vICB1c2VzIGxvdy1sZXZlbCBDbG91ZEZvcm1hdGlvbiBjYWxscyB0byBpbXBsZW1lbnQgdGhlIHN0YWNrLlxyXG5leHBvcnQgY2xhc3MgUmVkaXNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFJlZGlzU3RhY2tQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcclxuICAgICAgICBjb25zdCBwcm9qZWN0X25hbWU6IHN0cmluZyA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdwcm9qZWN0X25hbWUnKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudDogc3RyaW5nID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ2Vudmlyb25tZW50Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN1Ym5ldElkcyA9IHByb3BzLnZwYy5wcml2YXRlU3VibmV0cy5tYXAoKHMpID0+IHMuc3VibmV0SWQpO1xyXG5cclxuICAgICAgICBjb25zdCBzdWJuZXRfZ3JvdXAgPSBuZXcgQ2ZuU3VibmV0R3JvdXAodGhpcywgJ3JlZGlzLXN1Ym5ldC1ncm91cCcsIHtcclxuICAgICAgICAgICAgc3VibmV0SWRzOiBbLi4uc3VibmV0SWRzXSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGAke2Vudmlyb25tZW50fSBzdWJuZXQgZ3JvdXAgZm9yIHJlZGlzYCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDZm5DYWNoZUNsdXN0ZXIodGhpcywgYCR7ZW52aXJvbm1lbnR9LXJlZGlzLWNsdXN0ZXJgLCB7XHJcbiAgICAgICAgICAgIGNhY2hlTm9kZVR5cGU6ICdjYWNoZS50Mi5zbWFsbCcsXHJcbiAgICAgICAgICAgIGVuZ2luZTogJ3JlZGlzJyxcclxuICAgICAgICAgICAgbnVtQ2FjaGVOb2RlczogMSxcclxuICAgICAgICAgICAgY2x1c3Rlck5hbWU6IGAke3Byb2plY3RfbmFtZX0tcmVkaXMtJHtlbnZpcm9ubWVudH1gLFxyXG4gICAgICAgICAgICBjYWNoZVN1Ym5ldEdyb3VwTmFtZTogc3VibmV0X2dyb3VwLnJlZixcclxuICAgICAgICAgICAgdnBjU2VjdXJpdHlHcm91cElkczogW3Byb3BzLnJlZGlzU0cuc2VjdXJpdHlHcm91cElkXSxcclxuICAgICAgICAgICAgYXV0b01pbm9yVmVyc2lvblVwZ3JhZGU6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2x1c3Rlci5hZGREZXBlbmRzT24oc3VibmV0X2dyb3VwKTtcclxuXHJcbiAgICAgICAgbmV3IFN0cmluZ1BhcmFtZXRlcih0aGlzLCAncmVkaXMtZW5kcG9pbnQnLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vcmVkaXMtZW5kcG9pbnRgLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY2x1c3Rlci5hdHRyUmVkaXNFbmRwb2ludEFkZHJlc3MsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmV3IFN0cmluZ1BhcmFtZXRlcih0aGlzLCAncmVkaXMtcG9ydCcsIHtcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogYC8ke2Vudmlyb25tZW50fS9yZWRpcy1wb3J0YCxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNsdXN0ZXIuYXR0clJlZGlzRW5kcG9pbnRQb3J0LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==