import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TestSqsHandler } from './test/test.sqs.handler';




@Controller('test-sqs')
@ApiTags('test-sqs')
export class TestSqsController {
  constructor(
    private readonly testSqsHandler: TestSqsHandler
  ) { }



  @Post()

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'object' }
      }
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage(@Body() data: any) {
    return this.testSqsHandler.handleMessage(data);
  }


}
