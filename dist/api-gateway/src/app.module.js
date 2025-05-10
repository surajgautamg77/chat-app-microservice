"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            microservices_1.ClientsModule.register([
                {
                    name: 'USER_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'user',
                        protoPath: (0, path_1.join)(__dirname, '../../../libs/proto/user.proto'),
                        url: process.env.USER_SERVICE_URL || 'localhost:3001',
                    },
                },
                {
                    name: 'PAYMENT_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'payment',
                        protoPath: (0, path_1.join)(__dirname, '../../../libs/proto/payment.proto'),
                        url: process.env.PAYMENT_SERVICE_URL || 'localhost:3002',
                    },
                },
                {
                    name: 'PROJECT_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'project',
                        protoPath: (0, path_1.join)(__dirname, '../../../libs/proto/project.proto'),
                        url: process.env.PROJECT_SERVICE_URL || 'localhost:3003',
                    },
                },
            ]),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map