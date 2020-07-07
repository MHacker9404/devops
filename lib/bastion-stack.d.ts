import * as cdk from '@aws-cdk/core';
import { IVpc, ISecurityGroup } from '@aws-cdk/aws-ec2';
interface BastionStackProps extends cdk.StackProps {
    vpc: IVpc;
    securityGroup: ISecurityGroup;
}
export declare class BastionStack extends cdk.Stack {
    private host;
    constructor(scope: cdk.Construct, id: string, props: BastionStackProps);
}
export {};
