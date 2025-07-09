import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { SqsLocalService } from './app/sqs.local.service';


async function createSwaggerConfig() {
    return new DocumentBuilder()
        .setTitle('USER-EVENT-HANDLER-SERVICE')
        .setDescription('USER-EVENT-HANDLER-SERVICE API')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();
}

async function setupGlobalMiddleware(app: INestApplication) {
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
}

async function bootstrapServer() {
    const app = await NestFactory.create(AppModule);

    await setupGlobalMiddleware(app);
    const config = await createSwaggerConfig();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, { useGlobalPrefix: true });

    Logger.log(`🚀 LOCALSTACK_STATUS: ${process.env.LOCALSTACK_STATUS}`);
    if (process.env.LOCALSTACK_STATUS === 'ENABLED') {
        const appContext = await NestFactory.createApplicationContext(AppModule);
        const sqsService = appContext.get(SqsLocalService);
        sqsService.pollQueue();
    } else {

        const port = process.env.PORT || 4008;

        await app.listen(port);
        Logger.log(`🚀 USER-EVENT-HANDLER-SERVICE is running on: http://localhost:${port}/api`);
        Logger.log(`🚀 USER-EVENT-HANDLER-SERVICE Swagger Endpoint : http://localhost:${port}/api/swagger`);
    }



}


if (process.env.SERVICE_TRIGGER && process.env.SERVICE_TRIGGER === 'LOCALHOST') {
    Logger.log('Starting local server');
    bootstrapServer();
}


export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback
) => {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const service = appContext.get(AppService);

    return service.handleMessage(event.Records);
};
