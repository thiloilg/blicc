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
      const dashboard = await this.dashboardService.select(id)
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

  public async list(ctx: Koa.DefaultContext, next: Function): Promise<void> {
    await next()
    try {
      const fields: string[] = ctx.query.fields
        ? ctx.query.fields.split(',')
        : undefined
      const dashboards = await this.dashboardService.selectAll(
        ctx.user.id,
        fields,
        ctx.query.search,
        ctx.query.skip,
        ctx.query.take
      )
      const total = await this.dashboardService.getTotalEntries()

      if (!dashboards) {
        ctx.status = status.BAD_REQUEST
        return
      }

      ctx.body = { total, dashboards }
      ctx.status = status.OK
    } catch (e) {
      ctx.status = status.INTERNAL_SERVER_ERROR
    }
  }

  public async update(ctx: Koa.DefaultContext, next: Function): Promise<void> {
    await next()
    try {
      const { id } = ctx.params
      const dashboard = await this.dashboardService.select(id)
      if (dashboard !== undefined && ctx.user.id === dashboard.userId) {
        if (ctx.request.body.title) dashboard.title = ctx.request.body.title
        if (ctx.request.body.data) dashboard.data = ctx.request.body.data
        if (
          ctx.request.body.id !== dashboard.id ||
          ctx.request.body.userId !== dashboard.userId ||
          ctx.request.body.creationDate !== dashboard.creationDate
        ) {
          ctx.status = status.BAD_REQUEST
          return
        }

        await this.dashboardService.update(dashboard)
        ctx.body = dashboard
        ctx.status = status.OK
        return
      }
      ctx.status = status.FORBIDDEN
    } catch (e) {
      ctx.status = status.INTERNAL_SERVER_ERROR
    }
  }

  public async delete(ctx: Koa.DefaultContext, next: Function): Promise<void> {
    await next()
    try {
      const { id } = ctx.params
      const dashboard = await this.dashboardService.select(id)
      if (dashboard !== undefined && ctx.user.id === dashboard.userId) {
        ctx.body = await this.dashboardService.remove(dashboard)
        ctx.status = status.OK
        return
      }
      ctx.status = status.FORBIDDEN
    } catch (e) {
      ctx.status = status.INTERNAL_SERVER_ERROR
    }
  }
}