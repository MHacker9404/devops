import * as cdk from '@aws-cdk/core';
import { Vpc, ISecurityGroup, SubnetType, InstanceType, InstanceClass, InstanceSize } from '@aws-cdk/aws-ec2';
import { IKey } from '@aws-cdk/aws-kms';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { DatabaseCluster, DatabaseClusterEngine, ClusterParameterGroup } from '@aws-cdk/aws-rds';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { RemovalPolicy } from '@aws-cdk/core';

export interface RdsStackProps extends cdk.StackProps {
    vpc: Vpc;
    lambdaSG: ISecurityGroup;
    bastionSG: ISecurityGroup;
    kmsKey: IKey;
}

export class RdsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: RdsStackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name: string = this.node.tryGetContext('project_name');
        const environment: string = this.node.tryGetContext('environment');

        const db_creds = new Secret(this, 'db-secret', {
            secretName: `${environment}/rds-secret`,
            generateSecretString: {
                includeSpace: false,
                passwordLength: 12,
                generateStringKey: 'password',
                excludePunctuation: true,
                secretStringTemplate: JSON.stringify({ username: 'admin' }),
            },
        });

        const db_mysql = new DatabaseCluster(this, 'mysql', {
            defaultDatabaseName: `${project_name}${environment}`,
            engine: DatabaseClusterEngine.AURORA_MYSQL,
            // engineVersion: '5.7.12'
            masterUser: {
                username: 'admin',
                password: db_creds.secretValueFromJson('password'),
            },
            instanceProps: {
                vpc: props.vpc,
                vpcSubnets: { subnetType: SubnetType.ISOLATED },
                instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
            },
            instances: 1,

            parameterGroup: ClusterParameterGroup.fromParameterGroupName(this, 'pg-dev', 'default.aurora-mysql5.7'),

            storageEncryptionKey: props.kmsKey,

            removalPolicy: environment === 'dev' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
        });

        db_mysql.connections.allowDefaultPortFrom(props.lambdaSG, 'Access from Lambda functions');
        db_mysql.connections.allowDefaultPortFrom(props.bastionSG, 'Access from bastion host');

        new StringParameter(this, 'db-host', {
            parameterName: `/${environment}/db-host`,
            stringValue: db_mysql.clusterEndpoint.hostname,
        });
    }
}
