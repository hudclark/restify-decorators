import { Server, RequestHandler } from 'restify';
export declare function registerControllers(server: Server): {
    withAuthenticator(authenticator: RequestHandler): any;
    addController(controller: any): void;
};
