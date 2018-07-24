[![Build Status](https://travis-ci.org/hudclark/restify-decorators.svg?branch=master)](https://travis-ci.org/hudclark/restify-decorators)

[![NPM](https://nodei.co/npm/restify-decorators.png)](https://nodei.co/npm/<package>/)
# Restify Decorators
Typescript decorators for quickly creating Restify controllers.

## Installation
```sh
npm install restify-decorators --save
```

## Usage
```javascript
import { controller, get, post, authenticated, registerControllers } from 'restify-decorators'
import * as restify from 'restify'


@controller('/users')
class UserController {

  @get('/:id')
  public async getUser (req, res, next) { ... }
    
  @get('/:id/feed')
  public async getFeed (req, res, next) { ... }
  
  @post('/')
  @authenticated()
  public async createUser (req, res, next) { ... }
  
  @post('/:id/story', loggerMiddleware, compressionMiddleware)
  @authenticated()
  public async createStory (req, res, next) { ... }

}

const server = restify.createServer()

registerControllers(sever)
  .withAuthenticator(jwtAuthenticator)
  .addController(new UserController())

```

### `@controller(rootPath)`
```javascript
@controller('/path')
class FooController {}
```
A class decorator that will mark the class as a controller. `@controller` takes a root path for the controller. Controllers must be explicitly wired to your server via `registerController` or `registerControllers`.

### `@<http-verb>('path', [...middleware])`
```javascript
@get('/:id', middlewareOne, middlewareTwo)
public getById (req, res, next) {}
```
A method decorator for http verbs. The path will be prepended with the controller's root path. Optionally pass in middleware. The middleware will be executed in the order passed.

### `@authenticated()`
```javascript
@post('/')
@authenticated()
public createUser (req, res, next) {}
```
A method decorator that will first run authentication middleware on a route. When registering a controller with authenticated routes, you must pass an authenticator to `registerController` or `registerControllers`.

### `registerController(server, controller, [authenticator])`
Used to add a single controller to the server.

### `registerControllers(server)`
```javascript
registerControllers(server)
  .withAuthenticator(jwtAuthenticator)
  .addController(userController)
  .addController(adminController)
```
A convience method over `registerController` to make it easy to wire up all of your controllers at once.

## Test
```sh
npm run test
```
