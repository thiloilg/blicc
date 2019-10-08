import Koa from 'koa'
import status from 'http-status-codes'
import { JWT } from '../util/jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { TokenPayload } from '../token/token-payload.interface'

export class AuthMiddleware {
  public static async handle(
    ctx: Koa.BaseContext,
    next: Function
  ): Promise<void> {
    try {
      let token: string = ctx.cookies.get('access_token')
      console.log(token)
      if (!token) {
        const { authorization } = ctx.headers
        token = authorization.split(' ')[1]
      }
      console.log(1)
      const payload: TokenPayload = JWT.verify(token)
      console.log(payload)
      console.log(2)
      const user: User | undefined = await new UserService().select(
        payload.email
      )
      console.log(3)
      if (user) {
        ctx.user = user
        await next()
        console.log(4)
      } else {
        ctx.status = status.NOT_FOUND
        ctx.body = 'User does not exist.'
        console.log(5)
      }
    } catch (e) {
      console.log(6)
      console.log(e)
      if (e.name === 'TokenExpiredError') {
        ctx.status = status.UNAUTHORIZED
        ctx.body = `Authorization token has expired on ${new Date(
          e.expiredAt
        )}.`
      } else {
        ctx.status = status.UNAUTHORIZED
        ctx.body = 'Please provide a valid authorization token.'
      }
    }
  }
}
