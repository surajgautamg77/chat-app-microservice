import { Document } from 'mongoose';
export declare class User extends Document {
    name: string;
    email: string;
    password: string;
}
export declare const UserSchema: any;
