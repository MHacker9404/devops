import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { IBucket } from '@aws-cdk/aws-s3';
interface PipelineProps extends StackProps {
    artifactBucket?: IBucket;
    artifactBucketName?: string;
    buildLogsBucket?: string;
}
export declare class CpBackendStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineProps);
}
export {};
