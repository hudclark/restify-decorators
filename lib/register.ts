import { Server, RequestHandler } from 'restify'
import { trimSlashes, wrapAsyncHandler } from './utils'
import { IRawRoute } from './decorators'

interface IRoute {
    method: string
    handler: RequestHandler
    path: string
    middleware: Array<RequestHandler>
    authenticated: boolean
}

export function registerControllers (server: Server) {
    let _authenticator: RequestHandler | null = null
    return {
        withAuthenticator (authenticator: RequestHandler) {
            _authenticator = authenticator
            return this
        },
        addController (controller: any) {
            registerController(server, controller, _authenticator)
        }
    }
}

export function registerController (server: Server, controller: any, authenticator: RequestHandler | null) {
    if (!controller.__controller) {
        throw new Error('Attempted register non-controller. Ensure it uses the @controller decorator')
    }

    if (!controller.__controller_raw_routes) {
        console.error('No routes registered on controller, skipping.')
        return
    }

    const basePath = (controller.__controller_base_path) ?
        '/' + trimSlashes(controller.__controller_base_path) : '/'

    controller.__controller_raw_routes.forEach ((rawRoute: IRawRoute) => {
        const route = cleanRoute(rawRoute)

        const fullPath = basePath + '/' + trimSlashes(route.path)
        const handler = wrapAsyncHandler(route.handler.bind(controller))
        const register = (<any> server)[route.method]

        if (route.authenticated) {
            if (!authenticator) {
                throw new Error(route.path + ' is authenticated, but no authenticator was given.')
            }
            register.call(server, fullPath, authenticator, ...route.middleware, handler)
        } else {
            register.call(server, fullPath, ...route.middleware, handler)
        }
    })
}

function cleanRoute (rawRoute: IRawRoute): IRoute {
    const errors = []
    if (rawRoute.method == null || !rawRoute.method.length) {
        errors.push('Inavlid method')
    }
    if (typeof rawRoute.handler !== 'function') {
        errors.push('Invalid handler')
    }
    if (rawRoute.middleware == null || !Array.isArray(rawRoute.middleware)) {
        errors.push('Invalid middleware')
    }
    if (errors.length) {
        throw new Error('Errors found in route: ' + rawRoute.propertyKey + ". " + errors)
    }

    return {
        method: rawRoute.method!,
        handler: rawRoute.handler!,
        middleware: rawRoute.middleware!,
        path: rawRoute.path || '',
        authenticated: rawRoute.authenticated
    }
}