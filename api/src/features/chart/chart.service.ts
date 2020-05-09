import { Repository, getRepository } from 'typeorm'
import { ChartEntity } from './chart.entity'
import { Chart } from './chart.interface'
import shortid from 'shortid'
import { Resolution } from '../../common/services'
import { CaptureService } from '../../common/services'

export class ChartService {
  private repo: Repository<ChartEntity>

  public constructor() {
    this.repo = getRepository(ChartEntity)
  }

  public async create(
    title: string,
    bundle: string,
    description: string,
    key: string,
    slug: string,
    userId: string
  ): Promise<Chart> {
    return await this.repo.save(
      new ChartEntity(title, bundle, description, userId, key, slug)
    )
  }

  public async selectById(id: string): Promise<ChartEntity | undefined> {
    return await this.repo.findOne({ id })
  }

  public async selectAll(
    fields: string[],
    searchTerm = '',
    skip = 0,
    take = 0 // default select all
  ): Promise<Chart[]> {
    fields = fields.map((field) => 'chart.' + field)

    return await this.repo
      .createQueryBuilder('chart')
      .select(fields)
      .where('LOWER(chart.title) like LOWER(:title)', {
        title: '%' + searchTerm + '%',
      })
      .orderBy('chart.creationDate', 'DESC')
      .skip(skip)
      .take(take)
      .getMany()
  }

  public async getTotalEntries(searchTerm = ''): Promise<number> {
    return await this.repo
      .createQueryBuilder('chart')
      .select('chart.id')
      .where('LOWER(chart.title) like LOWER(:title)', {
        title: '%' + searchTerm + '%',
      })
      .getCount()
  }

  public async update(chart: Chart): Promise<ChartEntity> {
    return await this.repo.save(chart)
  }

  public async remove(chart: ChartEntity): Promise<Chart> {
    chart = await chart.remove()
    delete chart.id
    return chart
  }

  public async generateId(): Promise<string> {
    const id = shortid.generate()
    const response = await this.repo.findOne(id)
    return response === undefined ? id : await this.generateId()
  }

  public capture(id: string): void {
    const bucket = 'chart-thumbnails'
    const screenshotPath = `/charts/${id}?fullscreen`
    const resLarge: Resolution = { width: 1280, height: 720 }
    const resSmall: Resolution = { width: 640, height: 360 }

    CaptureService.capture(id, bucket, screenshotPath, resLarge, resSmall)
  }
}
