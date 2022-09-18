import type { User } from '@prisma/client'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { getEnv } from '~/env.server'
import { getUserById } from '~/models/user.server'

const env = getEnv()

const storage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    secure: env.NODE_ENV === 'production',
    secrets: [env.SESSION_SECRET],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (typeof userId !== 'string') {
    return null
  }
  return userId
}

export async function createUserSession(
  userId: User['id'],
  redirectTo: string,
) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }
  try {
    return getUserById(userId)
  } catch {
    throw logout(request)
  }
}
