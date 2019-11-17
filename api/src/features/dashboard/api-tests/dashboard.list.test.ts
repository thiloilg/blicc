import { instance, initializeUser } from '../../../common/tests/user.helper'
import { Dashboard } from '../dashboard.interface'

describe('GET: /dashboards', () => {
  let params = { email: '', userId: '', cookie: '' }

  beforeEach(async () => {
    params = await initializeUser()
    await instance.post(
      '/dashboards',
      {
        title: 'Title',
        data: {},
      },
      {
        headers: {
          Cookie: params.cookie,
        },
      }
    )
    await instance.post(
      '/dashboards',
      {
        title: 'Title2',
        data: {},
      },
      {
        headers: {
          Cookie: params.cookie,
        },
      }
    )
  })

  it('200: OK', async () => {
    let response = await instance.get('/dashboards', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(200)

    response = await instance.get('/dashboards?fields=id,data', {
      headers: {
        Cookie: params.cookie,
      },
    })
    const fields = ['id', 'data']
    expect(response.status).toBe(200)
    expect(
      response.data.dashboards.every((dashboard: Dashboard): boolean => {
        return Object.keys(dashboard).every(field => {
          return fields.includes(field)
        })
      })
    ).toBe(true)

    response = await instance.get('dashboards?search=Title2', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(200)
    expect(response.data.dashboards[0].title).toEqual('Title2')

    for (let i = 1; i <= 10; i++) {
      await instance.post(
        '/dashboards',
        {
          title: `Title${i + 2}`,
          data: {},
        },
        {
          headers: {
            Cookie: params.cookie,
          },
        }
      )
    }

    response = await instance.get('/dashboards?skip=2&take=10', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(200)
    expect(response.data.dashboards.length).toEqual(10)

    // check validation for empty result
    params = await initializeUser()
    response = await instance.get('/dashboards', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(200)
  })

  it('400: Bad request', async () => {
    let response = await instance.get('/dashboards?fields=wrongFieldName', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(400)

    response = await instance.get('/dashboards?take=noNumber&skip=noNumber', {
      headers: {
        Cookie: params.cookie,
      },
    })
    expect(response.status).toBe(400)
  })

  it('401: Unauthorized', async () => {
    const { status } = await instance.get('/dashboards')
    expect(status).toBe(401)
  })
})