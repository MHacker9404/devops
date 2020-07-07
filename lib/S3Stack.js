"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Stack = void 0;
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
class S3Stack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        const account_id = core_1.Aws.ACCOUNT_ID;
        this.bucket = new aws_s3_1.Bucket(this, 'bucket-lambda', {
            accessControl: aws_s3_1.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: aws_s3_1.BucketEncryption.S3_MANAGED,
            //  adding the account id helps prevent conflicts on bucket names
            //  since they have to be globally unique
            bucketName: `${account_id}-${environment}-lambda-deploy-packages`,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            },
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        new aws_ssm_1.StringParameter(this, 'bucket-lambda-param', {
            parameterName: `/${environment}/lambda-s3-bucket`,
            stringValue: this.bucket.bucketName,
            type: aws_ssm_1.ParameterType.STRING,
        });
        this.artifactBucket = new aws_s3_1.Bucket(this, 'build-artifacts', {
            accessControl: aws_s3_1.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: aws_s3_1.BucketEncryption.S3_MANAGED,
            //  adding the account id helps prevent conflicts on bucket names
            //  since they have to be globally unique
            bucketName: `${account_id}-${environment}-build-artifacts`,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            },
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        new aws_ssm_1.StringParameter(this, 'build-artifacts-param', {
            parameterName: `/${environment}/s3-build-artifacts-bucket`,
            stringValue: this.artifactBucket.bucketName,
            type: aws_ssm_1.ParameterType.STRING,
        });
        this.frontEndBucket = new aws_s3_1.Bucket(this, 'front-end-bucket', {
            accessControl: aws_s3_1.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: aws_s3_1.BucketEncryption.S3_MANAGED,
            //  adding the account id helps prevent conflicts on bucket names
            //  since they have to be globally unique
            bucketName: `${account_id}-${environment}-front-end-bucket`,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            },
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        new aws_ssm_1.StringParameter(this, 'front-end-bucket-param', {
            parameterName: `/${environment}/s3-front-end-bucket`,
            stringValue: this.frontEndBucket.bucketName,
            type: aws_ssm_1.ParameterType.STRING,
        });
    }
}
exports.S3Stack = S3Stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUzNTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlMzU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHdDQUFtRDtBQUNuRCw0Q0FBeUY7QUFDekYsOENBQWtFO0FBRWxFLE1BQWEsT0FBUSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBS2xDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNELE1BQU0sVUFBVSxHQUFHLFVBQUcsQ0FBQyxVQUFVLENBQUM7UUFFbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzVDLGFBQWEsRUFBRSw0QkFBbUIsQ0FBQyx5QkFBeUI7WUFDNUQsVUFBVSxFQUFFLHlCQUFnQixDQUFDLFVBQVU7WUFDdkMsaUVBQWlFO1lBQ2pFLHlDQUF5QztZQUN6QyxVQUFVLEVBQUUsR0FBRyxVQUFVLElBQUksV0FBVyx5QkFBeUI7WUFDakUsaUJBQWlCLEVBQUU7Z0JBQ2YsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLHFCQUFxQixFQUFFLElBQUk7YUFDOUI7WUFDRCxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3ZDLENBQUMsQ0FBQztRQUVILElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDN0MsYUFBYSxFQUFFLElBQUksV0FBVyxtQkFBbUI7WUFDakQsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVTtZQUNuQyxJQUFJLEVBQUUsdUJBQWEsQ0FBQyxNQUFNO1NBQzdCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3RELGFBQWEsRUFBRSw0QkFBbUIsQ0FBQyx5QkFBeUI7WUFDNUQsVUFBVSxFQUFFLHlCQUFnQixDQUFDLFVBQVU7WUFDdkMsaUVBQWlFO1lBQ2pFLHlDQUF5QztZQUN6QyxVQUFVLEVBQUUsR0FBRyxVQUFVLElBQUksV0FBVyxrQkFBa0I7WUFDMUQsaUJBQWlCLEVBQUU7Z0JBQ2YsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLHFCQUFxQixFQUFFLElBQUk7YUFDOUI7WUFDRCxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3ZDLENBQUMsQ0FBQztRQUNILElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDL0MsYUFBYSxFQUFFLElBQUksV0FBVyw0QkFBNEI7WUFDMUQsV0FBVyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVTtZQUMzQyxJQUFJLEVBQUUsdUJBQWEsQ0FBQyxNQUFNO1NBQzdCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3ZELGFBQWEsRUFBRSw0QkFBbUIsQ0FBQyx5QkFBeUI7WUFDNUQsVUFBVSxFQUFFLHlCQUFnQixDQUFDLFVBQVU7WUFDdkMsaUVBQWlFO1lBQ2pFLHlDQUF5QztZQUN6QyxVQUFVLEVBQUUsR0FBRyxVQUFVLElBQUksV0FBVyxtQkFBbUI7WUFDM0QsaUJBQWlCLEVBQUU7Z0JBQ2YsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLHFCQUFxQixFQUFFLElBQUk7YUFDOUI7WUFDRCxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3ZDLENBQUMsQ0FBQztRQUNILElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDaEQsYUFBYSxFQUFFLElBQUksV0FBVyxzQkFBc0I7WUFDcEQsV0FBVyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVTtZQUMzQyxJQUFJLEVBQUUsdUJBQWEsQ0FBQyxNQUFNO1NBQzdCLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQTNFRCwwQkEyRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcbmltcG9ydCB7IEF3cywgUmVtb3ZhbFBvbGljeSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xyXG5pbXBvcnQgeyBCdWNrZXQsIElCdWNrZXQsIEJ1Y2tldEFjY2Vzc0NvbnRyb2wsIEJ1Y2tldEVuY3J5cHRpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xyXG5pbXBvcnQgeyBQYXJhbWV0ZXJUeXBlLCBTdHJpbmdQYXJhbWV0ZXIgfSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTM1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICAgIHByaXZhdGUgYnVja2V0OiBJQnVja2V0O1xyXG4gICAgcHVibGljIGFydGlmYWN0QnVja2V0OiBJQnVja2V0O1xyXG4gICAgcHVibGljIGZyb250RW5kQnVja2V0OiBJQnVja2V0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxyXG4gICAgICAgIGNvbnN0IHByb2plY3RfbmFtZSA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdwcm9qZWN0X25hbWUnKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdlbnZpcm9ubWVudCcpO1xyXG5cclxuICAgICAgICBjb25zdCBhY2NvdW50X2lkID0gQXdzLkFDQ09VTlRfSUQ7XHJcblxyXG4gICAgICAgIHRoaXMuYnVja2V0ID0gbmV3IEJ1Y2tldCh0aGlzLCAnYnVja2V0LWxhbWJkYScsIHtcclxuICAgICAgICAgICAgYWNjZXNzQ29udHJvbDogQnVja2V0QWNjZXNzQ29udHJvbC5CVUNLRVRfT1dORVJfRlVMTF9DT05UUk9MLFxyXG4gICAgICAgICAgICBlbmNyeXB0aW9uOiBCdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQsXHJcbiAgICAgICAgICAgIC8vICBhZGRpbmcgdGhlIGFjY291bnQgaWQgaGVscHMgcHJldmVudCBjb25mbGljdHMgb24gYnVja2V0IG5hbWVzXHJcbiAgICAgICAgICAgIC8vICBzaW5jZSB0aGV5IGhhdmUgdG8gYmUgZ2xvYmFsbHkgdW5pcXVlXHJcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IGAke2FjY291bnRfaWR9LSR7ZW52aXJvbm1lbnR9LWxhbWJkYS1kZXBsb3ktcGFja2FnZXNgLFxyXG4gICAgICAgICAgICBibG9ja1B1YmxpY0FjY2Vzczoge1xyXG4gICAgICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2xzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmxvY2tQdWJsaWNQb2xpY3k6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpZ25vcmVQdWJsaWNBY2xzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3RQdWJsaWNCdWNrZXRzOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG5ldyBTdHJpbmdQYXJhbWV0ZXIodGhpcywgJ2J1Y2tldC1sYW1iZGEtcGFyYW0nLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vbGFtYmRhLXMzLWJ1Y2tldGAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiB0aGlzLmJ1Y2tldC5idWNrZXROYW1lLFxyXG4gICAgICAgICAgICB0eXBlOiBQYXJhbWV0ZXJUeXBlLlNUUklORyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnRpZmFjdEJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgJ2J1aWxkLWFydGlmYWN0cycsIHtcclxuICAgICAgICAgICAgYWNjZXNzQ29udHJvbDogQnVja2V0QWNjZXNzQ29udHJvbC5CVUNLRVRfT1dORVJfRlVMTF9DT05UUk9MLFxyXG4gICAgICAgICAgICBlbmNyeXB0aW9uOiBCdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQsXHJcbiAgICAgICAgICAgIC8vICBhZGRpbmcgdGhlIGFjY291bnQgaWQgaGVscHMgcHJldmVudCBjb25mbGljdHMgb24gYnVja2V0IG5hbWVzXHJcbiAgICAgICAgICAgIC8vICBzaW5jZSB0aGV5IGhhdmUgdG8gYmUgZ2xvYmFsbHkgdW5pcXVlXHJcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IGAke2FjY291bnRfaWR9LSR7ZW52aXJvbm1lbnR9LWJ1aWxkLWFydGlmYWN0c2AsXHJcbiAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiB7XHJcbiAgICAgICAgICAgICAgICBibG9ja1B1YmxpY0FjbHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBibG9ja1B1YmxpY1BvbGljeTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGlnbm9yZVB1YmxpY0FjbHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXN0cmljdFB1YmxpY0J1Y2tldHM6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdidWlsZC1hcnRpZmFjdHMtcGFyYW0nLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vczMtYnVpbGQtYXJ0aWZhY3RzLWJ1Y2tldGAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiB0aGlzLmFydGlmYWN0QnVja2V0LmJ1Y2tldE5hbWUsXHJcbiAgICAgICAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmZyb250RW5kQnVja2V0ID0gbmV3IEJ1Y2tldCh0aGlzLCAnZnJvbnQtZW5kLWJ1Y2tldCcsIHtcclxuICAgICAgICAgICAgYWNjZXNzQ29udHJvbDogQnVja2V0QWNjZXNzQ29udHJvbC5CVUNLRVRfT1dORVJfRlVMTF9DT05UUk9MLFxyXG4gICAgICAgICAgICBlbmNyeXB0aW9uOiBCdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQsXHJcbiAgICAgICAgICAgIC8vICBhZGRpbmcgdGhlIGFjY291bnQgaWQgaGVscHMgcHJldmVudCBjb25mbGljdHMgb24gYnVja2V0IG5hbWVzXHJcbiAgICAgICAgICAgIC8vICBzaW5jZSB0aGV5IGhhdmUgdG8gYmUgZ2xvYmFsbHkgdW5pcXVlXHJcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IGAke2FjY291bnRfaWR9LSR7ZW52aXJvbm1lbnR9LWZyb250LWVuZC1idWNrZXRgLFxyXG4gICAgICAgICAgICBibG9ja1B1YmxpY0FjY2Vzczoge1xyXG4gICAgICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2xzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmxvY2tQdWJsaWNQb2xpY3k6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpZ25vcmVQdWJsaWNBY2xzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3RQdWJsaWNCdWNrZXRzOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmV3IFN0cmluZ1BhcmFtZXRlcih0aGlzLCAnZnJvbnQtZW5kLWJ1Y2tldC1wYXJhbScsIHtcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogYC8ke2Vudmlyb25tZW50fS9zMy1mcm9udC1lbmQtYnVja2V0YCxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IHRoaXMuZnJvbnRFbmRCdWNrZXQuYnVja2V0TmFtZSxcclxuICAgICAgICAgICAgdHlwZTogUGFyYW1ldGVyVHlwZS5TVFJJTkcsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19