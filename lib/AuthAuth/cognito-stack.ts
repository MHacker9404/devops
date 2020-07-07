import * as cdk from '@aws-cdk/core';
import { CfnUserPool, CfnUserPoolClient, CfnIdentityPool } from '@aws-cdk/aws-cognito';
import { StringParameter, ParameterType } from '@aws-cdk/aws-ssm';

export class CognitoStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');

        const userPool = new CfnUserPool(this, 'cognito-user-pool', {
            autoVerifiedAttributes: ['email'],
            usernameAttributes: ['email', 'phone_number'],
            userPoolName: `${project_name}-user-pool`,
            schema: [
                {
                    attributeDataType: 'String',
                    name: 'param1',
                    mutable: true,
                },
            ],
            policies: {
                passwordPolicy: {
                    minimumLength: 10,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSymbols: false,
                    requireUppercase: true,
                },
            },
        });

        const userPoolClient = new CfnUserPoolClient(this, 'cognito-user-pool-client', {
            userPoolId: userPool.ref,
            clientName: `${environment}-app-client`,
        });

        const identity_pool = new CfnIdentityPool(this, 'cognito-identity-pool', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [
                {
                    clientId: userPoolClient.ref,
                    providerName: userPool.attrProviderName,
                },
            ],
            identityPoolName: `${project_name}-identity-pool`,
        });

        new StringParameter(this, 'app-id', {
            parameterName: `/${environment}/cognito-app-client-id`,
            stringValue: userPoolClient.ref,
            type: ParameterType.STRING,
        });
        new StringParameter(this, 'user-pool-id', {
            parameterName: `/${environment}/cognito-user-pool-id`,
            stringValue: userPoolClient.userPoolId,
            type: ParameterType.STRING,
        });
        new StringParameter(this, 'identity-pool-id', {
            parameterName: `/${environment}/cognito-identity-pool-id`,
            stringValue: identity_pool.ref,
            type: ParameterType.STRING,
        });
    }
}
