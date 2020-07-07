import * as cdk from '@aws-cdk/core';
import { Key } from '@aws-cdk/aws-kms';
import { StringParameter } from '@aws-cdk/aws-ssm';

export class KmsStack extends cdk.Stack {
    public kms_rds: Key;

    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        this.kms_rds = new Key(this, 'rdsKey', {
            description: `${project_name}-key-rds`,
            enableKeyRotation: true,
        });

        this.kms_rds.addAlias(`alias/${project_name}-key-rds`);

        //  SSM Parameters
        new StringParameter(this, `rdskey-param`, {
            parameterName: `/${environment}/rds-kms-key`,
            stringValue: this.kms_rds.keyId,
        });
        new StringParameter(this, `rdskey-param-arn`, {
            parameterName: `/${environment}/rds-key-role-arn`,
            stringValue: this.kms_rds.keyArn,
        });
    }
}
