import Koa from 'koa'

export class AdminController {
  public async settings(ctx: Koa.BaseContext, next: Function): Promise<void> {
    await next()
    ctx.body = 'Only an admin can see this!'
  }
}
