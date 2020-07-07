"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpBackendStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
const aws_codepipeline_actions_1 = require("@aws-cdk/aws-codepipeline-actions");
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class CpBackendStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        const account_id = core_1.Aws.ACCOUNT_ID;
        const region = core_1.Aws.REGION;
        //  ! is the non-null assertion operator
        // https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
        const artifactBucket = props.artifactBucket
            ? aws_s3_1.Bucket.fromBucketArn(this, 'artifact-bucket', props.artifactBucket.bucketArn)
            : aws_s3_1.Bucket.fromBucketName(this, 'artifactBucket', props.artifactBucketName);
        const githubToken = core_1.SecretValue.secretsManager(`${environment}/github-token`, {
            jsonField: 'github-token',
        });
        const build = new aws_codebuild_1.PipelineProject(this, 'backend-build', {
            projectName: `${environment}-${project_name}-build-project`,
            description: 'package lamda functions',
            environment: {
                buildImage: aws_codebuild_1.LinuxBuildImage.STANDARD_4_0,
                environmentVariables: {
                    ENV: {
                        value: `${environment}`,
                        type: aws_codebuild_1.BuildEnvironmentVariableType.PLAINTEXT,
                    },
                    PRJ: {
                        value: `${project_name}`,
                        type: aws_codebuild_1.BuildEnvironmentVariableType.PLAINTEXT,
                    },
                    STAGE: {
                        value: `${environment}`,
                        type: aws_codebuild_1.BuildEnvironmentVariableType.PLAINTEXT,
                    },
                },
            },
            cache: aws_codebuild_1.Cache.bucket(artifactBucket, {
                prefix: `${environment}-codebuild-cache`,
            }),
            buildSpec: aws_codebuild_1.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: ['echo "--INSTALL PHASE--"', 'npm i -g serverless --silent --no-progress'],
                    },
                    pre_build: {
                        commands: ['echo "--PRE-Build PHASE--"', 'npm install --silent --no-progress'],
                    },
                    build: {
                        commands: ['echo "--Build PHASE--"', 'serverless deploy -s $STAGE'],
                    },
                },
                artifacts: {
                    files: ['**/*'],
                    'base-directory': '.serverless',
                },
            }),
        });
        const pipeline = new aws_codepipeline_1.Pipeline(this, 'backend-pipeline', {
            pipelineName: `${environment}-${project_name}-backend-pipeline`,
            artifactBucket: artifactBucket,
            restartExecutionOnUpdate: false,
        });
        const sourceOutput = new aws_codepipeline_1.Artifact('source');
        const buildOutput = new aws_codepipeline_1.Artifact('build');
        //  source stage
        pipeline.addStage({
            stageName: 'source',
            actions: [
                new aws_codepipeline_actions_1.GitHubSourceAction({
                    oauthToken: githubToken,
                    output: sourceOutput,
                    repo: 'devops',
                    branch: 'master',
                    owner: 'mhacker9404',
                    actionName: 'GitHubSource',
                }),
            ],
        });
        //  build stage
        pipeline.addStage({
            stageName: 'deploy',
            actions: [
                new aws_codepipeline_actions_1.CodeBuildAction({
                    actionName: `DeployTo${environment}`,
                    input: sourceOutput,
                    project: build,
                    outputs: [buildOutput],
                }),
            ],
        });
        build.role.addToPolicy(new aws_iam_1.PolicyStatement({
            actions: ['cloudformation:*', 's3:*', 'iam:*', 'lambda:*', 'apigateway:*'],
            resources: ['*'],
        }));
        build.role.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
        /*
        new StringParameter(this, 'front-end-bucket-param', {
            parameterName: `/${environment}/s3-front-end-bucket`,
            stringValue: this.frontEndBucket.bucketName,
            type: ParameterType.STRING,
        });
        */
    }
}
exports.CpBackendStack = CpBackendStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFjay1lbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYWNrLWVuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBK0U7QUFDL0UsNENBQWtEO0FBQ2xELGdFQUErRDtBQUMvRCxnRkFBd0Y7QUFDeEYsMERBTWdDO0FBQ2hDLDhDQUFrRTtBQVFsRSxNQUFhLGNBQWUsU0FBUSxZQUFLO0lBQ3JDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNELE1BQU0sVUFBVSxHQUFHLFVBQUcsQ0FBQyxVQUFVLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsVUFBRyxDQUFDLE1BQU0sQ0FBQztRQUUxQix3Q0FBd0M7UUFDeEMsaUhBQWlIO1FBQ2pILE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjO1lBQ3ZDLENBQUMsQ0FBQyxlQUFNLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQztZQUMvRSxDQUFDLENBQUMsZUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGtCQUFtQixDQUFDLENBQUM7UUFFL0UsTUFBTSxXQUFXLEdBQUcsa0JBQVcsQ0FBQyxjQUFjLENBQUMsR0FBRyxXQUFXLGVBQWUsRUFBRTtZQUMxRSxTQUFTLEVBQUUsY0FBYztTQUM1QixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLCtCQUFlLENBQUMsSUFBSSxFQUFF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R0FBRyxDQUFDO1NBQ25CLENBQUMsQ0FDTCxDQUFDO1FBQ0YsS0FBSyxDQUFDLElBQUssQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztRQUU1Rjs7Ozs7O1VBTUU7SUFDTixDQUFDO0NBQ0o7QUFySEQsd0NBcUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXdzLCBTdGFjaywgQ29uc3RydWN0LCBTdGFja1Byb3BzLCBTZWNyZXRWYWx1ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xyXG5pbXBvcnQgeyBCdWNrZXQsIElCdWNrZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xyXG5pbXBvcnQgeyBQaXBlbGluZSwgQXJ0aWZhY3QgfSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcclxuaW1wb3J0IHsgR2l0SHViU291cmNlQWN0aW9uLCBDb2RlQnVpbGRBY3Rpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gICAgUGlwZWxpbmVQcm9qZWN0LFxyXG4gICAgTGludXhCdWlsZEltYWdlLFxyXG4gICAgQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZSxcclxuICAgIENhY2hlLFxyXG4gICAgQnVpbGRTcGVjLFxyXG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xyXG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQsIE1hbmFnZWRQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcclxuXHJcbmludGVyZmFjZSBQaXBlbGluZVByb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XHJcbiAgICBhcnRpZmFjdEJ1Y2tldD86IElCdWNrZXQ7XHJcbiAgICBhcnRpZmFjdEJ1Y2tldE5hbWU/OiBzdHJpbmc7XHJcbiAgICBidWlsZExvZ3NCdWNrZXQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcEJhY2tlbmRTdGFjayBleHRlbmRzIFN0YWNrIHtcclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxyXG4gICAgICAgIGNvbnN0IHByb2plY3RfbmFtZSA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdwcm9qZWN0X25hbWUnKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdlbnZpcm9ubWVudCcpO1xyXG5cclxuICAgICAgICBjb25zdCBhY2NvdW50X2lkID0gQXdzLkFDQ09VTlRfSUQ7XHJcbiAgICAgICAgY29uc3QgcmVnaW9uID0gQXdzLlJFR0lPTjtcclxuXHJcbiAgICAgICAgLy8gICEgaXMgdGhlIG5vbi1udWxsIGFzc2VydGlvbiBvcGVyYXRvclxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU0NDk2Mzk4L3R5cGVzY3JpcHQtdHlwZS1zdHJpbmctdW5kZWZpbmVkLWlzLW5vdC1hc3NpZ25hYmxlLXRvLXR5cGUtc3RyaW5nXHJcbiAgICAgICAgY29uc3QgYXJ0aWZhY3RCdWNrZXQgPSBwcm9wcy5hcnRpZmFjdEJ1Y2tldFxyXG4gICAgICAgICAgICA/IEJ1Y2tldC5mcm9tQnVja2V0QXJuKHRoaXMsICdhcnRpZmFjdC1idWNrZXQnLCBwcm9wcy5hcnRpZmFjdEJ1Y2tldC5idWNrZXRBcm4pXHJcbiAgICAgICAgICAgIDogQnVja2V0LmZyb21CdWNrZXROYW1lKHRoaXMsICdhcnRpZmFjdEJ1Y2tldCcsIHByb3BzLmFydGlmYWN0QnVja2V0TmFtZSEpO1xyXG5cclxuICAgICAgICBjb25zdCBnaXRodWJUb2tlbiA9IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKGAke2Vudmlyb25tZW50fS9naXRodWItdG9rZW5gLCB7XHJcbiAgICAgICAgICAgIGpzb25GaWVsZDogJ2dpdGh1Yi10b2tlbicsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkID0gbmV3IFBpcGVsaW5lUHJvamVjdCh0aGlzLCAnYmFja2VuZC1idWlsZCcsIHtcclxuICAgICAgICAgICAgcHJvamVjdE5hbWU6IGAke2Vudmlyb25tZW50fS0ke3Byb2plY3RfbmFtZX0tYnVpbGQtcHJvamVjdGAsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncGFja2FnZSBsYW1kYSBmdW5jdGlvbnMnLFxyXG4gICAgICAgICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgICAgICAgICAgYnVpbGRJbWFnZTogTGludXhCdWlsZEltYWdlLlNUQU5EQVJEXzRfMCxcclxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgRU5WOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBgJHtlbnZpcm9ubWVudH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlBMQUlOVEVYVCxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFBSSjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYCR7cHJvamVjdF9uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgU1RBR0U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGAke2Vudmlyb25tZW50fWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYWNoZTogQ2FjaGUuYnVja2V0KGFydGlmYWN0QnVja2V0LCB7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXg6IGAke2Vudmlyb25tZW50fS1jb2RlYnVpbGQtY2FjaGVgLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgYnVpbGRTcGVjOiBCdWlsZFNwZWMuZnJvbU9iamVjdCh7XHJcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcclxuICAgICAgICAgICAgICAgIHBoYXNlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbGw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnZWNobyBcIi0tSU5TVEFMTCBQSEFTRS0tXCInLCAnbnBtIGkgLWcgc2VydmVybGVzcyAtLXNpbGVudCAtLW5vLXByb2dyZXNzJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYnVpbGQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnZWNobyBcIi0tUFJFLUJ1aWxkIFBIQVNFLS1cIicsICducG0gaW5zdGFsbCAtLXNpbGVudCAtLW5vLXByb2dyZXNzJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogWydlY2hvIFwiLS1CdWlsZCBQSEFTRS0tXCInLCAnc2VydmVybGVzcyBkZXBsb3kgLXMgJFNUQUdFJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlczogWycqKi8qJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJy5zZXJ2ZXJsZXNzJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBQaXBlbGluZSh0aGlzLCAnYmFja2VuZC1waXBlbGluZScsIHtcclxuICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiBgJHtlbnZpcm9ubWVudH0tJHtwcm9qZWN0X25hbWV9LWJhY2tlbmQtcGlwZWxpbmVgLFxyXG4gICAgICAgICAgICBhcnRpZmFjdEJ1Y2tldDogYXJ0aWZhY3RCdWNrZXQsXHJcbiAgICAgICAgICAgIHJlc3RhcnRFeGVjdXRpb25PblVwZGF0ZTogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBBcnRpZmFjdCgnc291cmNlJyk7XHJcbiAgICAgICAgY29uc3QgYnVpbGRPdXRwdXQgPSBuZXcgQXJ0aWZhY3QoJ2J1aWxkJyk7XHJcblxyXG4gICAgICAgIC8vICBzb3VyY2Ugc3RhZ2VcclxuICAgICAgICBwaXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ3NvdXJjZScsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcclxuICAgICAgICAgICAgICAgIG5ldyBHaXRIdWJTb3VyY2VBY3Rpb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIG9hdXRoVG9rZW46IGdpdGh1YlRva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG86ICdkZXZvcHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaDogJ21hc3RlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6ICdtaGFja2VyOTQwNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0dpdEh1YlNvdXJjZScsXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIGJ1aWxkIHN0YWdlXHJcbiAgICAgICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xyXG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdkZXBsb3knLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgICAgICBuZXcgQ29kZUJ1aWxkQWN0aW9uKHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiBgRGVwbG95VG8ke2Vudmlyb25tZW50fWAsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBidWlsZCxcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBbYnVpbGRPdXRwdXRdLFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJ1aWxkLnJvbGUhLmFkZFRvUG9saWN5KFxyXG4gICAgICAgICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnY2xvdWRmb3JtYXRpb246KicsICdzMzoqJywgJ2lhbToqJywgJ2xhbWJkYToqJywgJ2FwaWdhdGV3YXk6KiddLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBidWlsZC5yb2xlIS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBZG1pbmlzdHJhdG9yQWNjZXNzJykpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIG5ldyBTdHJpbmdQYXJhbWV0ZXIodGhpcywgJ2Zyb250LWVuZC1idWNrZXQtcGFyYW0nLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vczMtZnJvbnQtZW5kLWJ1Y2tldGAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiB0aGlzLmZyb250RW5kQnVja2V0LmJ1Y2tldE5hbWUsXHJcbiAgICAgICAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICovXHJcbiAgICB9XHJcbn1cclxuIl19