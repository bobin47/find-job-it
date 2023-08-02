import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Blog APIs')
    .setDescription('List APIs for simple Blog by NXB Dev')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addBearerAuth()
    .build();
  const documnent = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documnent);
  await app.listen(3000);
}
bootstrap();
