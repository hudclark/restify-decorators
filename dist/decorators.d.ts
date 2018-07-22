import { RequestHandler } from 'restify';
export interface IRawRoute {
    method?: string;
    handler?: RequestHandler;
    path?: string;
    middleware?: Array<RequestHandler>;
    authenticated: boolean;
    propertyKey: string;
}
export declare function controller(basePath: string): Function;
export declare function get(path: string, ...middleware: RequestHandler[]): Function;
export declare function post(path: string, ...middleware: RequestHandler[]): Function;
export declare function put(path: string, ...middleware: RequestHandler[]): Function;
export declare function del(path: string, ...middleware: RequestHandler[]): Function;
export declare function patch(path: string, ...middleware: RequestHandler[]): Function;
export declare function head(path: string, ...middleware: RequestHandler[]): Function;
export declare function authenticated(): Function;
