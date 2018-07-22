[![Build Status](https://travis-ci.org/hudclark/restify-decorators.svg?branch=master)](https://travis-ci.org/hudclark/restify-decorators)
# Restify Decorators
Typescript decorators for quickly creating Restify controllers.

## Installation
```sh
npm install restify-decorators --save
```

## Usage
```javascript
import { controller, get, post, authenticated } from 'restify-decorators'
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

## Test
```sh
npm run test
```
