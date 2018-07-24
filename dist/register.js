"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function registerControllers(server) {
    let _authenticator = null;
    return {
        withAuthenticator(authenticator) {
            _authenticator = authenticator;
            return this;
        },
        addController(controller) {
            registerController(server, controller, _authenticator);
        }
    };
}
exports.registerControllers = registerControllers;
function registerController(server, controller, authenticator) {
    if (!controller.__controller) {
        throw new Error('Attempted register non-controller. Ensure it uses the @controller decorator');
    }
    if (!controller.__controller_raw_routes) {
        console.error('No routes registered on controller, skipping.');
        return;
    }
    const basePath = (controller.__controller_base_path) ?
        '/' + utils_1.trimSlashes(controller.__controller_base_path) : '/';
    controller.__controller_raw_routes.forEach((rawRoute) => {
        const route = cleanRoute(rawRoute);
        const fullPath = basePath + '/' + utils_1.trimSlashes(route.path);
        const handler = utils_1.wrapAsyncHandler(route.handler.bind(controller));
        const register = server[route.method];
        if (route.authenticated) {
            if (!authenticator) {
                throw new Error(route.path + ' is authenticated, but no authenticator was given.');
            }
            register.call(server, fullPath, authenticator, ...route.middleware, handler);
        }
        else {
            register.call(server, fullPath, ...route.middleware, handler);
        }
    });
    // Free up some memory
    delete controller.__controller_raw_routes;
}
exports.registerController = registerController;
function cleanRoute(rawRoute) {
    const errors = [];
    if (rawRoute.method == null || !rawRoute.method.length) {
        errors.push('Inavlid method');
    }
    if (typeof rawRoute.handler !== 'function') {
        errors.push('Invalid handler');
    }
    if (rawRoute.middleware == null || !Array.isArray(rawRoute.middleware)) {
        errors.push('Invalid middleware');
    }
    if (errors.length) {
        throw new Error('Errors found in route: ' + rawRoute.propertyKey + ". " + errors);
    }
    return {
        method: rawRoute.method,
        handler: rawRoute.handler,
        middleware: rawRoute.middleware,
        path: rawRoute.path || '',
        authenticated: rawRoute.authenticated
    };
}
