import 'mocha'
import * as chai from 'chai'
import * as restify from 'restify'
import DummyController from './dummy-controller'
import { registerControllers } from '../dist/index'

const chaiHttp = require('chai-http')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiHttp)
chai.use(chaiAsPromised)

function authenticator (req: restify.Request, res: restify.Response, next: restify.Next) {
    const token = req.header('token')
    if (token === 'abc') {
        next()
    } else {
        return res.send(401)
    }
}

describe ('controller', () => {

    let server: restify.Server = null!

    beforeEach ((done) => {
        server = restify.createServer({name: 'restify-decorators'})
        server.use(restify.plugins.bodyParser());

        const controller = new DummyController('foo')

        registerControllers(server)
            .withAuthenticator(authenticator)
            .addController(controller)

        server.listen(done)
    })

    const validateArrays = (actual: Array<string>, expected: Array<string>) => {
        chai.expect(actual.length).equal(expected.length)
        for (let i = 0; i < actual.length; i++) {
            chai.expect(actual[i]).equal(expected[i])
        }
    }




    it ('should register routes', async () => {
        const response = await chai.request(server).get('/dummy/state')
        validateArrays(response.body.state, ['foo'])
    })

    it ('should do simple http methods', async () => {
        let r = await chai.request(server)
            .post('/dummy/simple-add')
            .send({item: 'hello world!'})
        const response = await chai.request(server).get('/dummy/state')
        validateArrays(response.body.state, ['foo', 'hello world!'])
    })

    it ('should handle async responses', async () => {
        const response = await chai.request(server)
            .get('/dummy/async')
        chai.expect(response.body).equal('async')
    })

    it ('should handle unhandled promise exceptions', async () => {
        const response = await chai.request(server)
            .get('/dummy/async/throw-unhandled')
        chai.expect(response.status).equal(500)
        chai.expect(response.body.code).equal('InternalServer')
    })

    it ('should handle thrown http errors', async () => {
        const response = await chai.request(server)
            .get('/dummy/async/throw-http')
        chai.expect(response.status).equal(400)
        chai.expect(response.body.message).equal('bad request')
    })

    it ('should evaluate middleware', async () => {
        const response = await chai.request(server)
            .get('/dummy/middleware')
        validateArrays(response.body, ['one', 'two', 'three'])
    })

    it ('should authenicate authenticated routes', async () => {
        let response = await chai.request(server)
            .get('/dummy/secret')

        chai.expect(response.status).equal(401)
        chai.expect(response.body.secret).undefined

        response = await chai.request(server)
            .get('/dummy/secret')
            .set('token', 'bcd')

        chai.expect(response.status).equal(401)
        chai.expect(response.body.secret).undefined

        response = await chai.request(server)
            .get('/dummy/secret')
            .set('token', 'abc')

        chai.expect(response.status).equal(200)
        chai.expect(response.body.secret).equal('abc')
    })

})