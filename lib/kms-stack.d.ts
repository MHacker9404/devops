import * as cdk from '@aws-cdk/core';
import { Key } from '@aws-cdk/aws-kms';
export declare class KmsStack extends cdk.Stack {
    kms_rds: Key;
    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps);
}
