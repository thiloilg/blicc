import Koa from 'koa'
import fs from 'fs'
import sharp from 'sharp'
import statusCode from 'http-status-codes'
import { MinioClient } from '../../util/minio-client'
import { Logger } from '../../util/logger'

export class ProfilePictureController {
  public async serve(ctx: Koa.DefaultContext, next: Function): Promise<void> {
    await next()
    const { resolution = '640x640' } = ctx.query

    if (!['640x640', '160x160'].includes(resolution)) {
      ctx.status = statusCode.BAD_REQUEST
      return
    }
    const { imgName } = ctx.params
    const imgPath = `${resolution}/${imgName}`
    ctx.set('Content-Type', 'image/jpeg')
    ctx.body = await MinioClient.load('profile-pictures', imgPath)
  }

  public async set(ctx: Koa.DefaultContext, next: Function): Promise<void> {
    await next()
    const bucket = 'profile-pictures'
    const region = 'de-east-1'
    const quality = 50
    const { userId } = ctx.params

    const { path } = ctx.state.files.image
    const imgName = `${userId}.jpg`

    const buf: Buffer = await sharp(path)
      .resize(640, 640)
      .jpeg({ quality })
      .toBuffer()

    MinioClient.store(bucket, region, `640x640/${imgName}`, buf)

    fs.unlink(path, (err) => {
      if (err) throw err
      Logger.info(`File deleted ${path}`)
    })

    ctx.status = statusCode.OK
  }
}
