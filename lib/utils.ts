import { RequestHandler, Request, Response, Next } from 'restify'
import { HttpError, InternalServerError } from 'restify-errors'

export function trimSlashes (str: string): string {
    const startsWithSlash = str[0] === '/'
    const endsWithSlash = (str.length > 1) ? str[str.length - 1] === '/' : false

    if (startsWithSlash || endsWithSlash) {
        const startIndex = (startsWithSlash) ? 1 : 0
        const endIndex = (endsWithSlash) ? str.length - 1: str.length
        return str.slice(startIndex, endIndex)
    }
    return str
}

export function wrapAsyncHandler (handler: RequestHandler): RequestHandler {
    return function (req: Request, res: Response, next: Next) {
        const result = handler(req, res, next)
        if (result && result.catch) {
            result.catch((error: any) => {
                if (error instanceof HttpError) {
                    return next(error)
                } else {
                    return next(new InternalServerError())
                }
            })
        }
    }
}