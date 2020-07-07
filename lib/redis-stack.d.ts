import * as cdk from '@aws-cdk/core';
import { ISecurityGroup, IVpc } from '@aws-cdk/aws-ec2';
export interface RedisStackProps extends cdk.StackProps {
    vpc: IVpc;
    redisSG: ISecurityGroup;
}
export declare class RedisStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: RedisStackProps);
}
