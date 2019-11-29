import speakeasy from 'speakeasy'
import {
  instance,
  initializeUser,
  clearUser,
} from '../../../common/tests/user.helper'
import { user } from '../../user/mocks/user.mock'

describe('POST: /two-factor-auth', () => {
  let params = { email: '', userId: '', cookie: '' }

  beforeEach(async () => {
    params = await initializeUser()
  })

  it('204: No content', async () => {
    let response = await instance.get('/two-factor-auth', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(200)

    const secret = response.data.otpAuthUrl.split('=')[1]
    const d = new Date()
    const seconds = d.getTime() / 1000

    let token = speakeasy.totp({
      secret,
      encoding: 'base32',
      time: seconds,
    })

    response = await instance.post(
      '/two-factor-auth',
      {
        token,
      },
      {
        headers: {
          Cookie: params.cookie,
        },
      }
    )
    expect(response.status).toBe(204)

    // clear up
    token = speakeasy.totp({
      secret,
      encoding: 'base32',
      time: seconds,
    })
    await clearUser(params.userId, params.cookie, user.password, token)
  })

  it('400: Bad request', async () => {
    let response = await instance.get('/two-factor-auth', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(200)
    const wrongToken = '923532'
    response = await instance.post(
      '/two-factor-auth',
      {
        token: wrongToken,
      },
      {
        headers: {
          Cookie: params.cookie,
        },
      }
    )
    expect(response.status).toBe(400)

    // clear up
    await clearUser(params.userId, params.cookie)
  })

  it('401: Unauthorized', async () => {
    const response = await instance.post('/two-factor-auth', {
      token: '323436',
    })
    expect(response.status).toBe(401)

    // clear up
    await clearUser(params.userId, params.cookie)
  })
})
