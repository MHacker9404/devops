#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../lib/vpc-stack';
import { SecurityStack } from '../lib/security-stack';
// import { MasterStack } from '../lib/master-stack';
import { BastionStack } from '../lib/bastion-stack';
import { KmsStack } from '../lib/kms-stack';
import { S3Stack } from '../lib/S3Stack';
import { RdsStack } from '../lib/rds-stack';
import { RedisStack } from '../lib/redis-stack';
// import { Fn } from '@aws-cdk/core';
import { CognitoStack } from '../lib/AuthAuth/cognito-stack';
import { ApiGatewayStack } from '../lib/AuthAuth/api-gateway-stack';
import { LambdaStack } from '../lib/AuthAuth/lambda-stack';
import { CpBackendStack } from '../lib/codepipeline/back-end';

const app = new cdk.App();
let vpc_stack = new VpcStack(app, 'vpc');
let sec_stack = new SecurityStack(app, 'security', { vpc: vpc_stack.vpc });
let bastion_stack = new BastionStack(app, 'bastion', { vpc: vpc_stack.vpc, securityGroup: sec_stack.bastion_sg });
let kms_stack = new KmsStack(app, 'kms', {});
let s3_stack = new S3Stack(app, 's3');
let rds_stack = new RdsStack(app, 'rds', {
    vpc: vpc_stack.vpc,
    lambdaSG: sec_stack.lambda_sg,
    bastionSG: sec_stack.bastion_sg,
    kmsKey: kms_stack.kms_rds,
});
let redis_stack = new RedisStack(app, 'redis', { vpc: vpc_stack.vpc, redisSG: sec_stack.redis_sg });
// let redis_stack = new RedisStack(app, 'redis', { vpc: vpc_stack.vpc, redisSG: Fn.importValue('redis-sg-export') });

let cognito_stack = new CognitoStack(app, 'cognito');
let api_gateway_stack = new ApiGatewayStack(app, 'api-gateway');
let lambda_stack = new LambdaStack(app, 'lambda');

let pipeline = new CpBackendStack(app, 'pipeline', {
    artifactBucket: s3_stack.artifactBucket,
});

/*
let master_stack = new MasterStack(app, 'MasterStack');
let vpc_stack = new VpcStack(master_stack, 'VpcStack');
let sec_stack = new SecurityStack(master_stack, 'SecurityStack', { vpc: vpc_stack.vpc });
*/

app.synth();
