import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Set global prefix
  app.setGlobalPrefix('api');

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription(`
      The User Service API provides endpoints for user management and authentication.
      
      ## Features
      - User registration and authentication
      - User profile management
      - JWT-based authentication
      
      ## Authentication
      All protected endpoints require a valid JWT token in the Authorization header.
      Format: \`Bearer <token>\`
    `)
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controllers
    )
    .addServer('http://localhost:3000', 'Local Development')
    .build();
  
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'User Service API Documentation',
  });
  
  await app.listen(3000);
}
bootstrap(); 