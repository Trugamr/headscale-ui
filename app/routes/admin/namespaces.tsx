import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { z } from 'zod'
import Input from '~/components/input'
import { createNamespace, getNamespaces } from '~/models/namespace.server'
import { ApiError } from '~/utils/client.server'
import { FiAlertCircle, FiMoreHorizontal } from 'react-icons/fi'
import Button from '~/components/button'
import Table from '~/components/table'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  if (body.intent === 'create') {
    const parsed = z.object({ name: z.string().max(63) }).safeParse(body)
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
        <p className="mb-3 max-w-max rounded border border-red-200 bg-red-50 px-2 py-1 text-red-500">
          <FiAlertCircle className="mr-1.5 inline-block align-middle text-base" />
          <span className="text-sm">{errors.__unscoped}</span>
        </p>
      ) : null}
      <section className="mb-6">
        <header className="mb-8">
          <h3 className="text-3xl font-semibold">Namespaces</h3>
        </header>
        <Table
          className="w-full"
          columns={[
            {
              key: 'name',
              title: 'Name',
              render: row => row.name,
            },
            {
              key: 'created-at',
              title: 'Created At',
              className: 'text-sm',
              render: row => row.formattedCreatedAt,
            },
            {
              key: 'action-menu',
              title: <span className="sr-only">Namespaces action menu</span>,
              render: row => (
                <Button
                  className="rounded border border-transparent py-1 px-2 text-lg hover:border-gray-200 hover:shadow-sm"
                  title={row.id}
                >
                  <FiMoreHorizontal />
                </Button>
              ),
            },
          ]}
          rows={namespaces}
          rowKey={row => row.id}
        />
      </section>
      <section>
        <header className="mb-2">
          <h4 className="text-lg">Add new namespace</h4>
        </header>
        <div className="flex flex-col">
          <Form className="flex gap-x-2" method="post">
            <Input name="name" placeholder="Name" autoComplete="off" />
            <Button name="intent" value="create">
              Create
            </Button>
          </Form>
          {'name' in errors ? (
            <span className="text-sm text-red-500">{errors.name}</span>
          ) : null}
        </div>
      </section>
    </main>
  )
}
