import { Repository, getRepository } from 'typeorm'
import { UserEntity } from './user.entity'
import { User } from './user.interface'
import { Hash } from '../util/hash'
import { MailService } from '../util/mail-service/mail-service'
import { MailType } from '../util/mail-service/mail-service'
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
  ): Promise<User> {
    const passwordHash = Hash.generate(password)
    const hasTwoFactorAuth = false
    const twoFactorAuthSecret = ''

    const user = this.stripSecrets(
      await this.repo.save(
        new UserEntity(
          firstName,
          lastName,
          email,
          passwordHash,
          role,
          hasTwoFactorAuth,
          twoFactorAuthSecret
        )
      )
    )

    await new MailService().send(user, MailType.WELCOME)
    return user
  }

  public stripSecrets(user: User): User {
    return (({
      id,
      firstName,
      lastName,
      email,
      role,
      hasTwoFactorAuth,
      creationDate,
    }): User => ({
      id,
      firstName,
      lastName,
      email,
      role,
      hasTwoFactorAuth,
      creationDate,
    }))(user)
  }

  public async update(user: User): Promise<User> {
    return await this.repo.save(user)
  }

  public async exists(email: string): Promise<boolean> {
    return (await this.repo.findOne({ email })) !== undefined
  }

  public async select(email: string): Promise<User | undefined> {
    return await this.repo.findOne({ email })
  }

  public async selectById(id: string): Promise<User | undefined> {
    return await this.repo.findOne(id)
  }

  public async generateId(): Promise<string> {
    const id = shortid.generate()
    const response = await this.repo.findOne(id)
    return response === undefined ? id : await this.generateId()
  }
}
