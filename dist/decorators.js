"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @controller
function controller(basePath) {
    return function (constructor) {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.__controller = true;
                this.__controller_base_path = basePath;
            }
        };
    };
}
exports.controller = controller;
// @get
function get(path, ...middleware) {
    return route('get', path, middleware);
}
exports.get = get;
// @post
function post(path, ...middleware) {
    return route('post', path, middleware);
}
exports.post = post;
// @put
function put(path, ...middleware) {
    return route('put', path, middleware);
}
exports.put = put;
// @del
function del(path, ...middleware) {
    return route('del', path, middleware);
}
exports.del = del;
// @patch
function patch(path, ...middleware) {
    return route('patch', path, middleware);
}
exports.patch = patch;
// @head
function head(path, ...middleware) {
    return route('head', path, middleware);
}
exports.head = head;
/**
 * Decorator factory for routes
 */
function route(method, path, middleware = []) {
    return function (target, propertyKey, descriptor) {
        const handler = descriptor.value;
        const route = getRoute(target, propertyKey);
        if (route != null) {
            route.path = path;
            route.method = method;
            route.handler = handler;
            route.middleware = middleware;
        }
        else {
            addRoute(target, {
                method,
                handler,
                path,
                middleware,
                propertyKey,
                authenticated: false
            });
        }
    };
}
// @authenticated
function authenticated() {
    return function (target, propertyKey, descriptor) {
        const route = getRoute(target, propertyKey);
        if (route != null) {
            route.authenticated = true;
        }
        else {
            addRoute(target, {
                propertyKey: propertyKey,
                authenticated: true,
            });
        }
    };
}
exports.authenticated = authenticated;
function getRoute(target, propertyKey) {
    if (target.__controller_raw_routes) {
        return target.__controller_raw_routes.find((route) => route.propertyKey === propertyKey);
    }
    return null;
}
function addRoute(target, route) {
    if (!target.__controller_raw_routes) {
        target.__controller_raw_routes = [];
    }
    target.__controller_raw_routes.push(route);
}
