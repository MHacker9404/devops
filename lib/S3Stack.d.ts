import * as cdk from '@aws-cdk/core';
import { IBucket } from '@aws-cdk/aws-s3';
export declare class S3Stack extends cdk.Stack {
    private bucket;
    artifactBucket: IBucket;
    frontEndBucket: IBucket;
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps);
}
