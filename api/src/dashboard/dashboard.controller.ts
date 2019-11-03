import Koa from 'koa'
import status from 'http-status-codes'
import { DashboardService } from './dashboard.service'

export class DashboardController {
  private dashboardService: DashboardService

  public constructor() {
    this.dashboardService = new DashboardService()
  }

  public async create(ctx: Koa.DefaultContext, next: Function): Promise<void> {
    await next()
    const { title, data } = ctx.request.body
    const { id } = ctx.user
    ctx.body = await this.dashboardService.create(title, id, data)
    ctx.status = 201
  }

  public async access(ctx: Koa.DefaultContext, next: Function): Promise<void> {
    await next()
    try {
      const { id } = ctx.params
      const dashboard = await this.dashboardService.selectById(id)
      if (dashboard !== undefined && ctx.user.id === dashboard.userId) {
        ctx.body = dashboard
        ctx.status = status.OK
        return
      }
      ctx.status = status.FORBIDDEN
    } catch (e) {
      ctx.status = status.INTERNAL_SERVER_ERROR
    }
  }
}
