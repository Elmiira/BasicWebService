import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import config from './config';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main'); 
  logger.log('Starting application...');


  // *** to connect to rabbitmq ?888
  // const queueName = config.microserviceOptions.queueName;
  // const host = config.microserviceOptions.host;

  // await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [host],
  //     queue: queueName,
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  // *** Swagger setup ***
  // const document = SwaggerModule.createDocument(app, config.openAPIObject);
  // SwaggerModule.setup('api', app, document);


  app.startAllMicroservices();
  await app.listen(config.app.port);
}

bootstrap();
