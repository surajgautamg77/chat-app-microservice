import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('AI Chatbot Platform API')
    .setDescription('The AI Chatbot Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap(); 