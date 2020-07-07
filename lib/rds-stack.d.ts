import * as cdk from '@aws-cdk/core';
import { Vpc, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { IKey } from '@aws-cdk/aws-kms';
export interface RdsStackProps extends cdk.StackProps {
    vpc: Vpc;
    lambdaSG: ISecurityGroup;
    bastionSG: ISecurityGroup;
    kmsKey: IKey;
}
export declare class RdsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: RdsStackProps);
}
