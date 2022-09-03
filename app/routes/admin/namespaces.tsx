import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { z } from 'zod'
import { createNamespace, getNamespaces } from '~/models/namespace.server'
import { ApiError } from '~/utils/client.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  if (body.intent === 'create') {
    const parsed = z.object({ name: z.string() }).safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }
    try {
      const namespace = await createNamespace({ name: parsed.data.name })
      return json({ namespace, errors: null })
    } catch (error) {
      if (error instanceof ApiError) {
        return json(
          { errors: { __unscoped: error.message } },
          { status: error.response.status },
        )
      }
      return json(
        { errors: { __unscoped: 'Something went wrong' } },
        { status: 500 },
      )
    }
  }

  throw new Error('Invalid intent')
}

export const loader = async () => {
  const { namespaces } = await getNamespaces()
  const _namespaces = namespaces.map(namespace => {
    const formattedCreatedAt = format(
      new Date(namespace.createdAt),
      'LLL M yyyy, hh:mm a',
    )

    return {
      id: namespace.id,
      name: namespace.name,
      formattedCreatedAt,
    }
  })
  return json({ namespaces: _namespaces })
}

export default function MachinesRoute() {
  const { namespaces } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors ?? {}

  return (
    <main>
      {'__unscoped' in errors ? (
        <p className="mb-2 rounded border border-red-200 bg-red-50 px-2 py-1 text-sm text-red-500">
          {errors.__unscoped}
        </p>
      ) : null}
      <h3 className="mb-6 text-3xl font-semibold">Namespaces</h3>
      <table className="mb-5 table-auto">
        <thead>
          <tr className="space-x-3 text-left">
            <th className="py-1 pr-3">Name</th>
            <th className="py-1 pr-3">Created At</th>
            <th>
              <span className="sr-only">Namespaces action menu</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {namespaces.map(namespace => {
            return (
              <tr key={namespace.id}>
                <td className="py-1 pr-3">{namespace.name}</td>
                <td className="py-1 pr-3">{namespace.formattedCreatedAt}</td>
                <td className="py-1">
                  <button className="rounded border px-2 shadow-sm">...</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h4 className="mb-2 text-lg">Add new namespace</h4>
      <div className="flex flex-col">
        <Form className="flex gap-x-2" method="post">
          <input
            name="name"
            placeholder="Name"
            className="border placeholder:px-1.5"
          />
          <button name="intent" value="create">
            Create
          </button>
        </Form>
        {'name' in errors ? (
          <span className="text-sm text-red-500">{errors.name}</span>
        ) : null}
      </div>
    </main>
  )
}
