import * as cdk from '@aws-cdk/core';
import {
    IVpc,
    ISecurityGroup,
    Instance,
    InstanceType,
    InstanceClass,
    InstanceSize,
    AmazonLinuxImage,
    AmazonLinuxEdition,
    AmazonLinuxGeneration,
    AmazonLinuxVirt,
    AmazonLinuxStorage,
    SubnetType,
} from '@aws-cdk/aws-ec2';

interface BastionStackProps extends cdk.StackProps {
    vpc: IVpc;
    securityGroup: ISecurityGroup;
}

export class BastionStack extends cdk.Stack {
    private host: Instance;

    constructor(scope: cdk.Construct, id: string, props: BastionStackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        this.host = new Instance(this, 'bastion-host', {
            // instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            instanceType: new InstanceType('t2.micro'),
            machineImage: new AmazonLinuxImage({
                edition: AmazonLinuxEdition.STANDARD,
                generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
                virtualization: AmazonLinuxVirt.HVM,
                storage: AmazonLinuxStorage.GENERAL_PURPOSE,
            }),
            vpc: props.vpc,
            keyName: 'prb-cdk-devops',
            vpcSubnets: { subnetType: SubnetType.PUBLIC },
            securityGroup: props.securityGroup,
        });
    }
}
