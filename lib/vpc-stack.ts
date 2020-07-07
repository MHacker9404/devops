import * as cdk from '@aws-cdk/core';
import { ISubnet, Vpc, SubnetType } from '@aws-cdk/aws-ec2';
import * as ssm from '@aws-cdk/aws-ssm';

export class VpcStack extends cdk.Stack {
    public vpc: Vpc;
    public privateSubnets: string[] = [];
    public publicSubnets: string[] = [];

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        this.vpc = new Vpc(this, 'devVPC', {
            cidr: '172.32.0.0/16',
            maxAzs: 2,
            enableDnsHostnames: true, //  Indicates whether the instances launched in the VPC get public DNS hostnames.
            enableDnsSupport: true, //  Indicates whether the DNS resolution is supported for the VPC.
            subnetConfiguration: [
                {
                    name: 'Public',
                    cidrMask: 24,
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    name: 'Private',
                    cidrMask: 24,
                    subnetType: SubnetType.PRIVATE,
                },
                {
                    name: 'Isolated',
                    cidrMask: 24,
                    subnetType: SubnetType.ISOLATED,
                },
            ],
            natGateways: 1,
        });

        this.privateSubnets = this.vpc.privateSubnets.map((subnet: ISubnet) => subnet.subnetId);
        this.privateSubnets.forEach(
            (subnet: string, index: number) =>
                new ssm.StringParameter(this, `private-subnet-${index + 1}`, {
                    stringValue: subnet,
                    parameterName: `/${environment}/private-subnet-${index + 1}`,
                    type: ssm.ParameterType.STRING,
                }),
        );

        this.publicSubnets = this.vpc.publicSubnets.map((subnet: ISubnet) => subnet.subnetId);
        this.publicSubnets.forEach(
            (subnet: string, index: number) =>
                new ssm.StringParameter(this, `public-subnet-${index + 1}`, {
                    stringValue: subnet,
                    parameterName: `/${environment}/public-subnet-${index + 1}`,
                    type: ssm.ParameterType.STRING,
                }),
        );
    }
}
