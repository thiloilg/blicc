import { Repository, getRepository } from 'typeorm'
import { UserEntity } from './user.entity'
import { User } from './user.interface'
import { Hash } from '../../util/hash'
import { MailService } from '../../common/services/mail-service/mail-service'
import { MailType } from '../../common/services/mail-service/mail-service'
import uuid from 'uuid'
import shortid from 'shortid'

export class UserService {
  private repo: Repository<UserEntity>

  public constructor() {
    this.repo = getRepository(UserEntity)
  }

  public async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role = 'user'
  ): Promise<User | undefined> {
    if (await this.exists(email)) return
    const passwordHash = Hash.generate(password)
    const hasTwoFactorAuth = false
    const twoFactorAuthSecret = ''
    const refreshToken = uuid()

    const user = await this.repo.save(
      new UserEntity(
        firstName,
        lastName,
        email,
        passwordHash,
        refreshToken,
        role,
        hasTwoFactorAuth,
        twoFactorAuthSecret
      )
    )

    delete user.twoFactorAuthSecret
    delete user.passwordHash

    await new MailService().send(user, MailType.WELCOME)
    return user
  }

  public async generateId(): Promise<string> {
    const id = shortid.generate()
    const response = await this.repo.findOne(id)
    return response === undefined ? id : await this.generateId()
  }

  public async selectByEmailWithRefreshToken(
    email: string
  ): Promise<User | undefined> {
    return await this.repo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.email = :email', { email })
      .getOne()
  }

  public async selectById(id: string): Promise<User | undefined> {
    return await this.repo.findOne(id)
  }

  public async list(): Promise<User[]> {
    return await this.repo
      .createQueryBuilder('user')
      .select('user')
      .orderBy('user.creationDate', 'DESC')
      .getMany()
  }

  public async getTotalEntries(): Promise<number> {
    return await this.repo
      .createQueryBuilder('user')
      .select('user.id')
      .getCount()
  }

  public async exists(email: string): Promise<boolean> {
    return (await this.repo.findOne({ email })) !== undefined
  }

  public async update(user: User): Promise<User> {
    return await this.repo.save(user)
  }

  public async deleteById(id: string): Promise<boolean> {
    const deleteResult = await this.repo.delete({ id })
    return deleteResult.affected === 1
  }
}
