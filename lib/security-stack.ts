import * as cdk from '@aws-cdk/core';
import { SecurityGroup, IVpc, Peer, Port, IMachineImage, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { IRole, Role, ServicePrincipal, ManagedPolicy, PolicyStatement } from '@aws-cdk/aws-iam';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { CfnOutput } from '@aws-cdk/core';

interface SecurityStackProps extends cdk.StackProps {
    vpc: IVpc;
}

export class SecurityStack extends cdk.Stack {
    public lambda_sg: ISecurityGroup;
    public bastion_sg: ISecurityGroup;
    public redis_sg: ISecurityGroup;
    public lambda_role: IRole;

    constructor(scope: cdk.Construct, id: string, props: SecurityStackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        this.lambda_sg = new SecurityGroup(this, 'lambdasg', {
            securityGroupName: `${environment}-lambda-sg`,
            vpc: props.vpc,
            description: 'Security Group for lambda functions',
            allowAllOutbound: true,
        });

        this.bastion_sg = new SecurityGroup(this, 'bastionsg', {
            securityGroupName: `${environment}-bastion-sg`,
            vpc: props.vpc,
            description: 'Security Group for Bastion Host',
            allowAllOutbound: true,
        });
        this.bastion_sg.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'SSH Access');

        this.redis_sg = new SecurityGroup(this, 'redissg', {
            securityGroupName: `${environment}-redis-sg`,
            vpc: props.vpc,
            description: 'Security Group for Redis cluster',
            allowAllOutbound: true,
        });
        this.redis_sg.addIngressRule(this.lambda_sg, Port.tcp(6379), `Access from Lambda functions`);

        new CfnOutput(this, 'redis-export', {
            exportName: 'redis-sg-export',
            value: this.redis_sg.securityGroupId,
        });

        //  lambda functions role definition
        this.lambda_role = new Role(this, `lambdaRole`, {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            roleName: 'lambda-role',
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName(`service-role/AWSLambdaBasicExecutionRole`)],
        });

        //  custom inline policy
        this.lambda_role.addToPolicy(
            new PolicyStatement({
                actions: [`s3:*`, `rds:*`],
                resources: [`*`],
            }),
        );

        //  SSM Parameters
        new StringParameter(this, `lambdasg-param`, {
            parameterName: `/${environment}/lambda-sg`,
            stringValue: this.lambda_sg.securityGroupId,
        });
        new StringParameter(this, `lambdarole-param-arn`, {
            parameterName: `/${environment}/lambda-role-arn`,
            stringValue: this.lambda_role.roleArn,
        });
        new StringParameter(this, `lambdarole-param-name`, {
            parameterName: `/${environment}/lambda-role-name`,
            stringValue: this.lambda_role.roleName,
        });
    }
}
