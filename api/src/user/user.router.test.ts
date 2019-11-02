import uuid from 'uuid/v4'
import {
  user,
  invalidEmails,
  invalidPasswords,
  injectionAttacks,
} from '../../mocks/user.mock'
import { instance } from '../test/helper'

describe('GET: /users/:id', () => {
  let email = ''
  let userId = ''
  let cookie = ''

  beforeEach(async () => {
    email = `${uuid()}@example.com`
    const { data } = await instance.post('/users', {
      ...user,
      email,
    })

    userId = data.id

    const response = await instance.post('/tokens', {
      email,
      password: user.password,
    })

    const cookies = response.headers['set-cookie']
    cookie = cookies
      .find((cookie: string): boolean => cookie.startsWith('access_token'))
      .split(';')[0]
  })

  it('200: OK', async () => {
    const { status } = await instance.get(`/users/${userId}`, {
      headers: {
        Cookie: cookie,
      },
    })
    expect(status).toBe(200)
  })

  it('401: Unauthorized', async () => {
    const { status } = await instance.get(`/users/${userId}`)
    expect(status).toBe(401)
  })

  it('403: Forbidden', async () => {
    const { status } = await instance.get(`/users/not-yours-or-non-existent`, {
      headers: {
        Cookie: cookie,
      },
    })
    expect(status).toBe(403)
  })
})

describe('POST: /users', () => {
  let email = ''

  beforeEach(() => {
    email = `${uuid()}@example.com`
  })

  it('201: Created', async () => {
    const { status } = await instance.post('/users', {
      ...user,
      email,
    })
    expect(status).toBe(201)
  })

  it('400: Bad request', async () => {
    const invalidInputs = [
      'no json',
      {
        ...user,
        field: 'more than requested',
      },
      {
        firstName: 'John',
        email: 'john@example.com',
        password: 'BES7/y!mczU#D]FK',
      },
    ]

    for (const input of invalidInputs) {
      const { status } = await instance.post('/users', input)
      expect(status).toBe(400)
    }

    const validUser = {
      ...user,
      email,
    }

    for (const injection of injectionAttacks) {
      Object.keys(validUser).forEach(async key => {
        const { status } = await instance.post('/users', {
          ...validUser,
          [key]: injection,
        })
        expect(status).toBeGreaterThanOrEqual(400)
      })
    }
  })

  it('409: Conflict', async () => {
    await instance.post('/users', {
      ...user,
      email,
    })
    const { status } = await instance.post('/users', {
      ...user,
      email,
    })
    expect(status).toBe(409)
  })

  it('422: Unprocessable entity', async () => {
    for (const email of invalidEmails) {
      const { status } = await instance.post('/users', {
        ...user,
        email,
      })
      expect(status).toBe(422)
    }

    for (const password of invalidPasswords) {
      const { status } = await instance.post('/users', {
        ...user,
        password,
      })
      expect(status).toBe(422)
    }
  })
})
