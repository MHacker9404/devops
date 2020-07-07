import * as cdk from '@aws-cdk/core';
import { ISecurityGroup, IVpc } from '@aws-cdk/aws-ec2';
import { CfnSubnetGroup, CfnCacheCluster } from '@aws-cdk/aws-elasticache';
import { StringParameter } from '@aws-cdk/aws-ssm';

export interface RedisStackProps extends cdk.StackProps {
    vpc: IVpc;
    // redisSG: string;
    redisSG: ISecurityGroup;
}

//  this library may not be fully functional - the udemy course
//  uses low-level CloudFormation calls to implement the stack.
export class RedisStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: RedisStackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name: string = this.node.tryGetContext('project_name');
        const environment: string = this.node.tryGetContext('environment');

        const subnetIds = props.vpc.privateSubnets.map((s) => s.subnetId);

        const subnet_group = new CfnSubnetGroup(this, 'redis-subnet-group', {
            subnetIds: [...subnetIds],
            description: `${environment} subnet group for redis`,
        });

        const cluster = new CfnCacheCluster(this, `${environment}-redis-cluster`, {
            cacheNodeType: 'cache.t2.small',
            engine: 'redis',
            numCacheNodes: 1,
            clusterName: `${project_name}-redis-${environment}`,
            cacheSubnetGroupName: subnet_group.ref,
            vpcSecurityGroupIds: [props.redisSG.securityGroupId],
            autoMinorVersionUpgrade: true,
        });
        cluster.addDependsOn(subnet_group);

        new StringParameter(this, 'redis-endpoint', {
            parameterName: `/${environment}/redis-endpoint`,
            stringValue: cluster.attrRedisEndpointAddress,
        });
        new StringParameter(this, 'redis-port', {
            parameterName: `/${environment}/redis-port`,
            stringValue: cluster.attrRedisEndpointPort,
        });
    }
}
