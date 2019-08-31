import Koa from 'koa'

export class DataSupplyController {
  /**
   * @swagger
   *
   * /:
   *   get:
   *     description: Inform
   *     produces:
   *       - text/html
   *     responses:
   *       200:
   *         description: success
   */
  public async inform(ctx: Koa.BaseContext, next: Function): Promise<void> {
    await next()

    ctx.body = 'API to supply data'
  }

  /**
   * @swagger
   *
   * /:
   *   post:
   *     description: Supply
   *     produces:
   *       - text/html
   *     responses:
   *       200:
   *         description: success
   */
  public async supply(ctx: Koa.BaseContext, next: Function): Promise<void> {
    await next()
    ctx.body = {}
  }
}
