import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
export declare class VpcStack extends cdk.Stack {
    vpc: Vpc;
    privateSubnets: string[];
    publicSubnets: string[];
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps);
}
