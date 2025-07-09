import { Entity } from "dynamodb-onetable";


export const VortexSchema = {
    version: '0.0.1',
    indexes: {
        primary: { hash: 'PK', sort: 'SK' },
        GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' },
        GSI2: { hash: 'GSI2PK', sort: 'GSI2SK' },
        GSI3: { hash: 'GSI3PK', sort: 'GSI3SK' },
        GSI4: { hash: 'GSI4PK', sort: 'GSI4SK' },
        GSI5: { hash: 'GSI5PK', sort: 'GSI5SK' },
    },
    models: {
        Vortex: {
            PK: { type: String, value: 'VORTEX', hidden: false },
            SK: { type: String, value: '${vortexId}', hidden: false },
            vortexId: { type: String, generate: 'ulid' },
            vortexDeviceId: { type: String },
            vortexStatus: {
                type: String,
                enum: ['IDLE', 'PROCESSING', 'ACTIVE', 'ACTIVATION_ERROR'],
                required: false,
            },
            recordStatus: {
                type: String,
                enum: ['PENDING', 'ACTIVE', 'ERROR'],
                required: false,
            },
            operatorCode: { type: String },
            operatorName: { type: String },
            manufacturedDate: { type: Date },
            cameraStatus: {
                type: String,
                enum: ['ACTIVE', 'PAUSED', 'IMAGE_PAUSE_PROCESSING', 'IMAGE_PAUSE_ERROR', 'IMAGE_RESUME_PROCESSING', 'IMAGE_RESUME_ERROR', 'IMAGE_CAPTURE_PROCESSING', 'IMAGE_CAPTURE_ERROR'],
                required: false,
            },
            cameraPreviousStatus: { type: String },
            cameraPausedUntil: { type: Date },
            GSI1PK: { type: String, value: 'VORTEX#${vortexStatus}#${recordStatus}', hidden: false },
            GSI1SK: { type: String, value: '${vortexDeviceId}', hidden: false },
            GSI2PK: { type: String, value: 'VORTEX#${operatorCode}#${recordStatus}', hidden: false },
            GSI2SK: { type: String, value: '${vortexDeviceId}', hidden: false },
            GSI3PK: { type: String, value: 'VORTEX#${operatorCode}#${vortexStatus}#${recordStatus}', hidden: false },
            GSI3SK: { type: String, value: '${vortexDeviceId}', hidden: false },
            GSI4PK: { type: String, value: 'VORTEX#${recordStatus}', hidden: false },
            GSI4SK: { type: String, value: '${vortexDeviceId}', hidden: false },
            GSI5PK: { type: String, value: 'VORTEX#${recordStatus}', hidden: false },
            GSI5SK: { type: String, value: '${firmwareVersion}', hidden: false },
            lastCommand: { type: String },
            lastCommandStatus: { type: String },
            lastCommandDate: { type: Date },
            lastCommandAcknowledgedDate: { type: Date },
            firmwareName: { type: String },
            firmwareVersion: { type: String },
            firmwareVersionRequested: { type: String },
            sensors: { type: Array, items: { type: Object } },
            firmwareUpdateStatus: {
                type: String,
                enum: ['IDLE',
                    'COMPLETED',
                    'PENDING',
                    'PAUSED',
                    'COMMAND_PROCESSING',
                    'UPDATE_ERROR',
                    'VERSION_MISMATCH'],
                required: false,
            },
            eventLogId: { type: String }, //current event log reference id 
        },
        Operator: {
            PK: { type: String, value: 'OPERATOR' },
            SK: { type: String, value: '${operatorId}' },
            operatorId: { type: String, generate: 'ulid' },
            operatorName: { type: String },
            operatorCode: { type: String },
            imageUploadEndpoint: { type: String },
            siteMonitoringAwsSecretArn: { type: String },
            siteMonitoringEndpoint: { type: String },
            cameraStatus: {
                type: String,
                enum: ['ACTIVE', 'PAUSED', 'IMAGE_PAUSE_PROCESSING', 'IMAGE_PAUSE_ERROR', 'IMAGE_RESUME_PROCESSING', 'IMAGE_RESUME_ERROR', 'IMAGE_CAPTURE_PROCESSING', 'IMAGE_CAPTURE_ERROR'],
                required: false,
            },
            GSI1PK: { type: String, value: 'OPERATOR' },
            GSI1SK: { type: String, value: '${operatorName}' },
            GSI2PK: { type: String, value: 'OPERATOR' },
            GSI2SK: { type: String, value: '${operatorCode}' },
        },
        Configuration: {
            PK: { type: String, value: 'CONFIGURATION' },
            SK: { type: String, value: '${configurationId}' },
            configurationId: { type: String, generate: 'ulid' },
            lastGeneratedVortexId: { type: String },
        },
        VortexEventLog: {
            PK: { type: String, value: 'VORTEX_EVENT_LOG' },
            SK: { type: String, value: '${logId}' },
            logId: { type: String, generate: 'ulid' },
            referenceId: { type: String },
            entityReferenceId: { type: String },
            action: { type: String },
            status: { type: String, enum: ['COMPLETED', 'ERROR', 'PROCESSING'] },
            sessionId: { type: String },
            ExpiryDate: { type: Number, ttl: true },
            GSI1PK: { type: String, value: 'VORTEX_EVENT_LOG', hidden: false },
            GSI1SK: { type: String, value: '${referenceId}', hidden: false },
            errorMessage: { type: Object, default: {} },
            data: { type: Object, default: {} },
        }
    } as const,
    params: {
        isoDates: true,
        timestamps: true,
    },
};

export type VortexDataType = Entity<typeof VortexSchema.models.Vortex>;
export type VortexEventLogDataType = Entity<typeof VortexSchema.models.VortexEventLog>;
export type OperatorDataType = Entity<typeof VortexSchema.models.Operator>;
export type ConfigurationDataType = Entity<typeof VortexSchema.models.Configuration>;
