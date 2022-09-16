import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { AuthorizationError } from 'remix-auth'
import Button from '~/components/button'
import Input from '~/components/input'
import { authenticator } from '~/services/auth.server'

export const action = async ({ request }: ActionArgs) => {
  try {
    throw await authenticator.authenticate('email-password', request, {
      successRedirect: '/admin',
      throwOnError: true,
    })
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }
    if (error instanceof AuthorizationError) {
      return json({
        errors: {
          __unscoped: error.message,
        },
      })
    }
    return json({
      errors: {
        __unscoped: 'Something went wrong',
      },
    })
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  // If the user is already authenticated redirect to admin dashboard
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/admin',
  })
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors ?? { __unscoped: undefined }

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
