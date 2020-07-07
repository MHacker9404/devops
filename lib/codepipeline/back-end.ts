import { Aws, Stack, Construct, StackProps, SecretValue } from '@aws-cdk/core';
import { Bucket, IBucket } from '@aws-cdk/aws-s3';
import { Pipeline, Artifact } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction, CodeBuildAction } from '@aws-cdk/aws-codepipeline-actions';
import {
    PipelineProject,
    LinuxBuildImage,
    BuildEnvironmentVariableType,
    Cache,
    BuildSpec,
} from '@aws-cdk/aws-codebuild';
import { PolicyStatement, ManagedPolicy } from '@aws-cdk/aws-iam';

interface PipelineProps extends StackProps {
    artifactBucket?: IBucket;
    artifactBucketName?: string;
    buildLogsBucket?: string;
}

export class CpBackendStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        const account_id = Aws.ACCOUNT_ID;
        const region = Aws.REGION;

        //  ! is the non-null assertion operator
        // https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
        const artifactBucket = props.artifactBucket
            ? Bucket.fromBucketArn(this, 'artifact-bucket', props.artifactBucket.bucketArn)
            : Bucket.fromBucketName(this, 'artifactBucket', props.artifactBucketName!);

        const githubToken = SecretValue.secretsManager(`${environment}/github-token`, {
            jsonField: 'github-token',
        });

        const build = new PipelineProject(this, 'backend-build', {
            projectName: `${environment}-${project_name}-build-project`,
            description: 'package lamda functions',
            environment: {
                buildImage: LinuxBuildImage.STANDARD_4_0,
                environmentVariables: {
                    ENV: {
                        value: `${environment}`,
                        type: BuildEnvironmentVariableType.PLAINTEXT,
                    },
                    PRJ: {
                        value: `${project_name}`,
                        type: BuildEnvironmentVariableType.PLAINTEXT,
                    },
                    STAGE: {
                        value: `${environment}`,
                        type: BuildEnvironmentVariableType.PLAINTEXT,
                    },
                },
            },
            cache: Cache.bucket(artifactBucket, {
                prefix: `${environment}-codebuild-cache`,
            }),
            buildSpec: BuildSpec.fromObject({
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

        const pipeline = new Pipeline(this, 'backend-pipeline', {
            pipelineName: `${environment}-${project_name}-backend-pipeline`,
            artifactBucket: artifactBucket,
            restartExecutionOnUpdate: false,
        });

        const sourceOutput = new Artifact('source');
        const buildOutput = new Artifact('build');

        //  source stage
        pipeline.addStage({
            stageName: 'source',
            actions: [
                new GitHubSourceAction({
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
                new CodeBuildAction({
                    actionName: `DeployTo${environment}`,
                    input: sourceOutput,
                    project: build,
                    outputs: [buildOutput],
                }),
            ],
        });

        build.role!.addToPolicy(
            new PolicyStatement({
                actions: ['cloudformation:*', 's3:*', 'iam:*', 'lambda:*', 'apigateway:*'],
                resources: ['*'],
            }),
        );
        build.role!.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

        /*
        new StringParameter(this, 'front-end-bucket-param', {
            parameterName: `/${environment}/s3-front-end-bucket`,
            stringValue: this.frontEndBucket.bucketName,
            type: ParameterType.STRING,
        });
        */
    }
}
