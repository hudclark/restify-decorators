import { Server, RequestHandler } from 'restify';
export declare function registerControllers(server: Server): {
    withAuthenticator(authenticator: RequestHandler): any;
    addController(controller: any): void;
};
export declare function registerController(server: Server, controller: any, authenticator: RequestHandler | null): void;
