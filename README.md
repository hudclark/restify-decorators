# Restify Decorators
Typescript decorators for quickly creating Restify controllers.

# Usage
```javascript
import { controller, get, post, authenticated } from 'restify-decorators'
import * as restify from 'restify'


@controller('/users')
class UserController {

  @get('/:id')
  public async getUser (req, res, next) { ... }
    
  @get('/feed')
  public async getFeed (req, res, next) { ... }
  
  @post('/')
  @authenticated()
  public async createUser (req, res, next) { ... }

}

const server = restify.createServer()

registerControllers(sever)
  .withAuthenticator(jwtAuthenticator)
  .addController(new UserController())

```
