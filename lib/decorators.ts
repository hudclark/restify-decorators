import { RequestHandler } from 'restify'

export interface IRawRoute {
    method?: string
    handler?: RequestHandler
    path?: string
    middleware?: Array<RequestHandler>
    authenticated: boolean
    propertyKey: string
}

// @controller
export function controller (basePath: string): Function {
    return function <T extends {new(...args:any[]):{}}> (constructor: T) {
        return class extends constructor {
            __controller = true
            __controller_base_path = basePath
        }
    }
}

// @get
export function get (path: string, ...middleware: RequestHandler[]) {
    return route('get', path, middleware)
}

// @post
export function post (path: string, ...middleware: RequestHandler[]) {
    return route('post', path, middleware)
}

// @put
export function put (path: string, ...middleware: RequestHandler[]) {
    return route('put', path, middleware)
}

// @del
export function del (path: string, ...middleware: RequestHandler[]) {
    return route('del', path, middleware)
}

// @patch
export function patch (path: string, ...middleware: RequestHandler[]) {
    return route('patch', path, middleware)
}

// @head
export function head (path: string, ...middleware: RequestHandler[]) {
    return route('head', path, middleware)
}

/**
 * Decorator factory for routes
 */
function route (method: string, path: string, middleware: RequestHandler[] = []): Function {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandler>) {
        const handler = descriptor.value as RequestHandler
        const route = getRoute(target, propertyKey)
        if (route != null) {
            route.path = path
            route.method = method
            route.handler = handler
            route.middleware = middleware
        } else {
            addRoute(target, {
                method,
                handler,
                path,
                middleware,
                propertyKey,
                authenticated: false
            })
        }
    }
}

// @authenticated
export function authenticated (): Function {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandler>) {
        const route = getRoute(target, propertyKey)
        if (route != null) {
            route.authenticated = true
        } else {
            addRoute(target, {
                propertyKey: propertyKey,
                authenticated: true,
            })
        }
    }
}

function getRoute (target: any, propertyKey: string): IRawRoute | null {
    if (target.__controller_raw_routes) {
        return target.__controller_raw_routes.find((route: IRawRoute) => route.propertyKey === propertyKey)
    }
    return null
}

function addRoute (target: any, route: IRawRoute) {
    if (!target.__controller_raw_routes) {
        target.__controller_raw_routes = []
    }
    target.__controller_raw_routes.push(route)
}