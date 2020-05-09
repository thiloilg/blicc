import { Repository, getRepository } from 'typeorm'
import { DashboardEntity } from './dashboard.entity'
import { Dashboard } from './dashboard.interface'
import shortid from 'shortid'
import { CaptureService, Resolution } from '../../common/services'

export class DashboardService {
  private repo: Repository<DashboardEntity>

  public constructor() {
    this.repo = getRepository(DashboardEntity)
  }

  public async create(
    title: string,
    description: string,
    userId: string,
    data: object
  ): Promise<Dashboard> {
    return await this.repo.save(
      new DashboardEntity(title, description, userId, data)
    )
  }

  public async select(id: string): Promise<DashboardEntity | undefined> {
    return await this.repo.findOne(id)
  }

  public async listByUserId(
    userId: string,
    fields: string[],
    searchTerm = '',
    skip = 0,
    take = 0 // default select all
  ): Promise<Dashboard[]> {
    fields = fields.map((field) => 'dashboard.' + field)

    return await this.repo
      .createQueryBuilder('dashboard')
      .select(fields)
      .where('dashboard.userId = :userId', { userId })
      .andWhere('LOWER(dashboard.title) like LOWER(:title)', {
        title: '%' + searchTerm + '%',
      })
      .orderBy('dashboard.creationDate', 'DESC')
      .skip(skip)
      .take(take)
      .getMany()
  }

  public async getTotalEntriesByUserId(
    userId: string,
    searchTerm = ''
  ): Promise<number> {
    return await this.repo
      .createQueryBuilder('dashboard')
      .select('dashboard.id')
      .where('dashboard.userId = :userId', { userId })
      .andWhere('LOWER(dashboard.title) like LOWER(:title)', {
        title: '%' + searchTerm + '%',
      })
      .getCount()
  }

  public async update(dashboard: Dashboard): Promise<DashboardEntity> {
    return await this.repo.save(dashboard)
  }

  public async generateId(): Promise<string> {
    const id = shortid.generate()
    const response = await this.repo.findOne(id)
    return response === undefined ? id : await this.generateId()
  }

  public async remove(dashboard: DashboardEntity): Promise<Dashboard> {
    dashboard = await dashboard.remove()
    delete dashboard.id
    return dashboard
  }

  public capture(id: string): void {
    const bucket = 'dashboard-thumbnails'
    const screenshotPath = `/dashboards/${id}?fullscreen`
    const resLarge: Resolution = { width: 1280, height: 720 }
    const resSmall: Resolution = { width: 640, height: 360 }

    CaptureService.capture(id, bucket, screenshotPath, resLarge, resSmall)
  }
}
