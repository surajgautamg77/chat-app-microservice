import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../../libs/proto/user.proto'),
          url: process.env.USER_SERVICE_URL || 'localhost:3001',
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'payment',
          protoPath: join(__dirname, '../../../libs/proto/payment.proto'),
          url: process.env.PAYMENT_SERVICE_URL || 'localhost:3002',
        },
      },
      {
        name: 'PROJECT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'project',
          protoPath: join(__dirname, '../../../libs/proto/project.proto'),
          url: process.env.PROJECT_SERVICE_URL || 'localhost:3003',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 