import { Injectable } from "@nestjs/common";

import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Logger } from "@nestjs/common";
import { MessageHandlerService } from "./message.handler.service";

@Injectable()
export class SqsLocalService {

    private readonly logger = new Logger(SqsLocalService.name);

    private readonly sqsClient = new SQSClient({
        region: process.env.DEFAULT_REGION,
    });


    constructor(private readonly messageHandlerService: MessageHandlerService) {
    }



    async pollQueue() {

        const queueUrl = process.env.[SQS_QUEUE_NAME];
        this.logger.log(`Polling queue ${queueUrl}`);

        while (true) {
            try {
                const { Messages } = await this.sqsClient.send(
                    new ReceiveMessageCommand({
                        QueueUrl: queueUrl,
                        MaxNumberOfMessages: 10,
                        WaitTimeSeconds: 20,
                    })
                );

                if (Messages && Messages.length > 0) {
                    for (const message of Messages) {
                        this.logger.log(`Processing message: ${JSON.stringify(message)}`);
                        // Invoke your NestJS handler
                        await this.messageHandlerService.handleMessage(message.Body);

                        // Delete the message after processing
                        await this.sqsClient.send(
                            new DeleteMessageCommand({
                                QueueUrl: queueUrl,
                                ReceiptHandle: message.ReceiptHandle,
                            })
                        );
                    }
                }
            } catch (error) {
                this.logger.error('Error polling SQS queue:', error);
            }
        }

    }
}   
