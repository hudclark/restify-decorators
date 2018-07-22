import { controller, get, post, authenticated } from '../dist/index'
import { Request, Response, Next } from 'restify'
import { BadRequestError } from 'restify-errors'

@controller('/dummy')
export default class DummyController {

    state: Array<string>

    constructor (startState: string) {
        this.state = [startState]
    }

    @get('/state')
    public getState (req: Request, res: Response, next: Next) {
        res.send({state: this.state})
        return next()
    }

    @post('/simple-add')
    public addState (req: Request, res: Response, next: Next) {
        this.state.push(req.body.item)
        res.send(200)
        return next()
    }

    @get('/secret')
    @authenticated()
    public getSecret (req: Request, res: Response, next: Next) {
        res.send({secret: 'abc'})
        return next()
    }

    @get('/async')
    public getAsync (req: Request, res: Response, next: Next) {
        return new Promise((resolve, reject) => {
            setTimeout(() =>  resolve(), 10)
        })
        .then(() => {
            res.send('async')
            return next()
        })
    }

    @get('/async/throw-unhandled')
    public async throwAsync (req: Request, res: Response, next: Next) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                reject()
            }, 10)
        })

        res.send('async')
        return next()
    }

    @get('/async/throw-http')
    public async throwAsyncHttpError (req: Request, res: Response, next: Next) {
        throw new BadRequestError('bad request')
    }

    @get('/middleware', middleware1, middleware2, middleware3)
    public getMiddleware (req: Request, res: Response, next: Next) {
        res.send(req.params.middleware)
        next()
    }

}

function middleware1 (req: Request, res: Response, next: Next) {
    req.params.middleware = ['one']
    next()
}

function middleware2 (req: Request, res: Response, next: Next) {
    req.params.middleware.push('two')
    next()
}

function middleware3 (req: Request, res: Response, next: Next) {
    req.params.middleware.push('three')
    next()
}