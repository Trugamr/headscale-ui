import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import Button from '~/components/button'
import Input from '~/components/input'
import { login } from '~/models/user.server'
import { createUserSession, getUserId } from '~/utils/session.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  const schema = z.object({
    email: z.string().email('Email should be valid'),
    password: z.string().min(6, 'Password must be atleast 6 characters'),
  })

  const parsed = await schema.safeParseAsync(body)
  if (!parsed.success) {
    return json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const userId = await login({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  if (!userId) {
    return json(
      { errors: { __unscoped: 'Invalid credentials' } },
      { status: 400 },
    )
  }

  return createUserSession(userId, '/admin')
}

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request)
  if (userId) {
    return redirect('/admin')
  }
  return json(null)
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors ?? {}

  return (
    <main className="flex h-full flex-col">
      <div className="bg-gray-100 py-4">
        <div>
          <header className="container mx-auto flex">
            <h1 className="text-lg font-semibold">headscale</h1>
          </header>
        </div>
      </div>

      <div className="container mx-auto flex flex-grow items-center justify-center py-6">
        <Form
          method="post"
          className="max-w-xs flex-grow rounded-md border border-gray-200 bg-gray-50 px-5 py-8"
        >
          <div className="flex flex-col gap-y-1">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" name="email" required />
            {'email' in errors ? (
              <p className="mb-1 text-sm text-red-500" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>
          <div className="mt-3 flex flex-col gap-y-1">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
            {'password' in errors ? (
              <p className="mb-1 text-sm text-red-500" role="alert">
                {errors.password}
              </p>
            ) : null}
          </div>

          <Button className="mt-8 w-full" variant="primary">
            Sign In
          </Button>

          {'__unscoped' in errors ? (
            <p className="mt-2 text-sm text-red-500">{errors.__unscoped}</p>
          ) : null}
        </Form>
      </div>
    </main>
  )
}
