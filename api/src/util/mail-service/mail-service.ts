import Mailer, { Transporter, SendMailOptions } from 'nodemailer'
import { MailGenerator } from './mail-generator'
import { User } from '../../user/user.interface'
import { MAIL_ADDRESS, MAIL_PASSWORD, MAIL_HOST } from '../../config'

export const MailType = {
  WELCOME: 'welcome',
  RESET_PASSWORD: 'reset_password',
}

export class MailService {
  private transporter: Transporter
  private generator: MailGenerator

  public constructor() {
    this.transporter = Mailer.createTransport({
      host: MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD,
      },
    })
    this.generator = new MailGenerator()
  }

  public async send(user: User, type: string): Promise<void> {
    try {
      const { email, firstName, lastName } = user
      const mail: SendMailOptions = await this.generator.generateMail(
        email,
        firstName,
        lastName,
        type
      )
      await this.transporter.sendMail(mail)
    } catch (e) {
      console.log('Mailserver failed to send Welcome mail!', e)
    }
  }
}
