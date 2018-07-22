"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
function trimSlashes(str) {
    const startsWithSlash = str[0] === '/';
    const endsWithSlash = (str.length > 1) ? str[str.length - 1] === '/' : false;
    if (startsWithSlash || endsWithSlash) {
        const startIndex = (startsWithSlash) ? 1 : 0;
        const endIndex = (endsWithSlash) ? str.length - 1 : str.length;
        return str.slice(startIndex, endIndex);
    }
    return str;
}
exports.trimSlashes = trimSlashes;
function wrapAsyncHandler(handler) {
    return function (req, res, next) {
        const result = handler(req, res, next);
        if (result && result.catch) {
            result.catch((error) => {
                if (error instanceof restify_errors_1.HttpError) {
                    return next(error);
                }
                else {
                    return next(new restify_errors_1.InternalServerError());
                }
            });
        }
    };
}
exports.wrapAsyncHandler = wrapAsyncHandler;
