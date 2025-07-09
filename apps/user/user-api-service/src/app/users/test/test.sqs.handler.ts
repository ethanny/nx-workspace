import { MessageQueueServiceAbstract } from "@message-queue-lib";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
export class TestSqsHandler {

    constructor(

        @Inject('MessageQueueAwsLibService')
        private readonly messageQueueAwsLibService: MessageQueueServiceAbstract,
        private readonly configService: ConfigService
    ) { }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleMessage(message: any) {

        const userSqs = this.configService.get('USER_EVENT_SQS');
        console.log(userSqs);
        await this.messageQueueAwsLibService.sendMessageToSQS(userSqs, JSON.stringify(message));
    }
}
