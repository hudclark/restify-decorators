import { Server, RequestHandler } from 'restify';
export * from './decorators';
export declare function registerController(server: Server, controller: any, authenticator: RequestHandler): void;
