import axios from 'axios'
import uuid from 'uuid/v4'
import { user } from '../../features/user/mocks/user.mock'
import { API_TEST_TARGET } from '../../config'

export const instance = axios.create({
  baseURL: API_TEST_TARGET,
  withCredentials: true,
  validateStatus: status => status >= 200 && status < 500,
})

export async function initializeUser(): Promise<{
  email: string
  userId: string
  cookie: string
}> {
  const email = `${uuid()}@example.com`
  let response = await instance.post('/users', {
    ...user,
    email,
  })

  const { data } = response
  console.log('create user')
  console.log(response)

  response = await instance.post('/tokens', {
    email,
    password: user.password,
  })

  console.log('login')
  console.log(response)

  const cookies = response.headers['set-cookie']

  console.log('extract cookie')
  console.log(cookies)
  const cookie = cookies
    .find((cookie: string): boolean => cookie.startsWith('access_token'))
    .split(';')[0]

  return { email, userId: data.id, cookie }
}

export async function getCookie(email: string): Promise<string> {
  const response = await instance.post('/tokens', {
    email,
    password: user.password,
  })
  const cookies = response.headers['set-cookie']
  return cookies
    .find((cookie: string): boolean => cookie.startsWith('access_token'))
    .split(';')[0]
}

export async function clearUser(
  userId: string,
  cookie: string,
  password: string = user.password,
  token = ''
): Promise<void> {
  await instance.post(
    `/users/${userId}/delete`,
    {
      token,
      password,
    },
    {
      headers: {
        Cookie: cookie,
      },
    }
  )
}
