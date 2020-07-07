import * as cdk from '@aws-cdk/core';
import { IVpc, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';
interface SecurityStackProps extends cdk.StackProps {
    vpc: IVpc;
}
export declare class SecurityStack extends cdk.Stack {
    lambda_sg: ISecurityGroup;
    bastion_sg: ISecurityGroup;
    redis_sg: ISecurityGroup;
    lambda_role: IRole;
    constructor(scope: cdk.Construct, id: string, props: SecurityStackProps);
}
export {};
