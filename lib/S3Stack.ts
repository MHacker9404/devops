import * as cdk from '@aws-cdk/core';
import { Aws, RemovalPolicy } from '@aws-cdk/core';
import { Bucket, IBucket, BucketAccessControl, BucketEncryption } from '@aws-cdk/aws-s3';
import { ParameterType, StringParameter } from '@aws-cdk/aws-ssm';

export class S3Stack extends cdk.Stack {
    private bucket: IBucket;
    public artifactBucket: IBucket;
    public frontEndBucket: IBucket;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        const account_id = Aws.ACCOUNT_ID;

        this.bucket = new Bucket(this, 'bucket-lambda', {
            accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: BucketEncryption.S3_MANAGED,
            //  adding the account id helps prevent conflicts on bucket names
            //  since they have to be globally unique
            bucketName: `${account_id}-${environment}-lambda-deploy-packages`,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });

        new StringParameter(this, 'bucket-lambda-param', {
            parameterName: `/${environment}/lambda-s3-bucket`,
            stringValue: this.bucket.bucketName,
            type: ParameterType.STRING,
        });

        this.artifactBucket = new Bucket(this, 'build-artifacts', {
            accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: BucketEncryption.S3_MANAGED,
            //  adding the account id helps prevent conflicts on bucket names
            //  since they have to be globally unique
            bucketName: `${account_id}-${environment}-build-artifacts`,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });
        new StringParameter(this, 'build-artifacts-param', {
            parameterName: `/${environment}/s3-build-artifacts-bucket`,
            stringValue: this.artifactBucket.bucketName,
            type: ParameterType.STRING,
        });

        this.frontEndBucket = new Bucket(this, 'front-end-bucket', {
            accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: BucketEncryption.S3_MANAGED,
            //  adding the account id helps prevent conflicts on bucket names
            //  since they have to be globally unique
            bucketName: `${account_id}-${environment}-front-end-bucket`,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });
        new StringParameter(this, 'front-end-bucket-param', {
            parameterName: `/${environment}/s3-front-end-bucket`,
            stringValue: this.frontEndBucket.bucketName,
            type: ParameterType.STRING,
        });
    }
}
