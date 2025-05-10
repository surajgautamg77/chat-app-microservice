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
    .setTitle('API Gateway')
    .setDescription(`
      The API Gateway provides a unified interface for all microservices.
      
      ## Services
      - User Service: User management and authentication
      - Projects Service: Project and bot management
      
      ## Authentication
      All protected endpoints require a valid JWT token in the Authorization header.
      Format: \`Bearer <token>\`
    `)
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('projects', 'Project management endpoints')
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
    .addServer('http://localhost:3002', 'Local Development')
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
    customSiteTitle: 'API Gateway Documentation',
  });
  
  await app.listen(3002);
}
bootstrap(); 