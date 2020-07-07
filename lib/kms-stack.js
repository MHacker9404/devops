"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KmsStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_kms_1 = require("@aws-cdk/aws-kms");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
class KmsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const project_name = this.node.tryGetContext('project_name');
        const environment = this.node.tryGetContext('environment');
        this.kms_rds = new aws_kms_1.Key(this, 'rdsKey', {
            description: `${project_name}-key-rds`,
            enableKeyRotation: true,
        });
        this.kms_rds.addAlias(`alias/${project_name}-key-rds`);
        //  SSM Parameters
        new aws_ssm_1.StringParameter(this, `rdskey-param`, {
            parameterName: `/${environment}/rds-kms-key`,
            stringValue: this.kms_rds.keyId,
        });
        new aws_ssm_1.StringParameter(this, `rdskey-param-arn`, {
            parameterName: `/${environment}/rds-key-role-arn`,
            stringValue: this.kms_rds.keyArn,
        });
    }
}
exports.KmsStack = KmsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia21zLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsia21zLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBdUM7QUFDdkMsOENBQW1EO0FBRW5ELE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBR25DLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBcUI7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNuQyxXQUFXLEVBQUUsR0FBRyxZQUFZLFVBQVU7WUFDdEMsaUJBQWlCLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLFlBQVksVUFBVSxDQUFDLENBQUM7UUFFdkQsa0JBQWtCO1FBQ2xCLElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RDLGFBQWEsRUFBRSxJQUFJLFdBQVcsY0FBYztZQUM1QyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1NBQ2xDLENBQUMsQ0FBQztRQUNILElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUMsYUFBYSxFQUFFLElBQUksV0FBVyxtQkFBbUI7WUFDakQsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtTQUNuQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUEzQkQsNEJBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xyXG5pbXBvcnQgeyBLZXkgfSBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcclxuaW1wb3J0IHsgU3RyaW5nUGFyYW1ldGVyIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgS21zU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gICAgcHVibGljIGttc19yZHM6IEtleTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxyXG4gICAgICAgIGNvbnN0IHByb2plY3RfbmFtZSA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdwcm9qZWN0X25hbWUnKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdlbnZpcm9ubWVudCcpO1xyXG5cclxuICAgICAgICB0aGlzLmttc19yZHMgPSBuZXcgS2V5KHRoaXMsICdyZHNLZXknLCB7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgJHtwcm9qZWN0X25hbWV9LWtleS1yZHNgLFxyXG4gICAgICAgICAgICBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5rbXNfcmRzLmFkZEFsaWFzKGBhbGlhcy8ke3Byb2plY3RfbmFtZX0ta2V5LXJkc2ApO1xyXG5cclxuICAgICAgICAvLyAgU1NNIFBhcmFtZXRlcnNcclxuICAgICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsIGByZHNrZXktcGFyYW1gLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vcmRzLWttcy1rZXlgLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogdGhpcy5rbXNfcmRzLmtleUlkLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5ldyBTdHJpbmdQYXJhbWV0ZXIodGhpcywgYHJkc2tleS1wYXJhbS1hcm5gLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGAvJHtlbnZpcm9ubWVudH0vcmRzLWtleS1yb2xlLWFybmAsXHJcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiB0aGlzLmttc19yZHMua2V5QXJuLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==