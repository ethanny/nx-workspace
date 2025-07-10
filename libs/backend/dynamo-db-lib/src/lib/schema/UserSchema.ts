import { Entity } from "dynamodb-onetable";

export const UserSchema = {
    version: '0.0.1',
    indexes: {
        primary: { hash: 'PK', sort: 'SK' },
        GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' },
        GSI2: { hash: 'GSI2PK' },
        GSI3: { hash: 'GSI3PK', sort: 'GSI3SK' },
        GSI4: { hash: 'GSI4PK' },
        GSI5: { hash: 'GSI5PK', sort: 'GSI5SK' },
        GSI6: { hash: 'GSI6PK', sort: 'GSI6SK' },
    },
    models: {
        User: {
            PK: { type: String, value: 'USER', hidden: false },
            SK: { type: String, value: '${userId}', hidden: false },
            userRole: {
                type: String,
                enum: ['USER', 'ADMIN'],
                required: false,
            },
            userStatus: {
                type: String,
                enum: ['PENDING', 'ACTIVE', 'INACTIVE', 'DELETED'],
                required: false,
            },
            userId: { type: String, generate: 'ulid' },
            email: { type: String, required: false },
            GSI1PK: { type: String, value: 'USER#${userRole}#${userStatus}', hidden: false },
            GSI1SK: { type: String, value: '${email}', hidden: false },
            GSI2PK: { type: String, value: 'USER#${email}#${userStatus}', hidden: false },
            GSI3PK: { type: String, value: 'USER#${userStatus}', hidden: false },
            GSI3SK: { type: String, value: '${userRole}', hidden: false },
            GSI4PK: { type: String, value: 'USER#${email}', hidden: false },
            GSI5PK: { type: String, value: 'USER#${userStatus}', hidden: false },
            GSI5SK: { type: String, value: '${email}', hidden: false },
            eventLogId: { type: String }, //current event log reference id 
            firstName: { type: String },
            lastName: { type: String },
            data: {
                type: Object,
                default: {},
                schema: {
                    country: { type: String },
                },
            },
        },
    } as const,
    params: {
        isoDates: true,
        timestamps: true,
    },
};

export type UserDataType = Entity<typeof UserSchema.models.User>;
