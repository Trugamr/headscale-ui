import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import { format } from 'date-fns'
import { z } from 'zod'
import Input from '~/components/input'
import type { Namespace } from '~/models/namespace.server'
import { createNamespace, getNamespaces } from '~/models/namespace.server'
import { ApiError } from '~/utils/client.server'
import { FiMoreHorizontal } from 'react-icons/fi'
import Button from '~/components/button'
import Table from '~/components/table'
import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  if (body.intent === 'create') {
    const parsed = z.object({ name: z.string().min(1).max(63) }).safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }
    try {
      const { namespace } = await createNamespace({ name: parsed.data.name })
      return json({ namespace, errors: null })
    } catch (error) {
      if (error instanceof ApiError) {
        return json(
          { errors: { __unscoped: error.message } },
          { status: error.response.status },
        )
      }
      return json(
        {
          errors: {
            __unscoped: 'Something went wrong while creating namespace',
          },
        },
        { status: 500 },
      )
    }
  }

  if (body.intent === 'remove') {
    const parsed = z.object({ name: z.string() }).safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: { __unscoped: 'Namespace name should be a string' } },
        { status: 400 },
      )
    }
    // Namespace name can be empty string so we redirect with a space
    // Using which api correctly returns the namespace with empty string
    const name = parsed.data.name
    return redirect(`/admin/namespaces/${name}/remove`)
  }

  if (body.intent === 'edit') {
    const parsed = z.object({ name: z.string() }).safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: { __unscoped: 'Namespace name should be a string' } },
        { status: 400 },
      )
    }
    // Namespace name can be empty string so we redirect with a space
    // Using which api correctly returns the namespace with empty string
    const name = parsed.data.name === '' ? ' ' : parsed.data.name
    return redirect(`/admin/namespaces/${name}/edit`)
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

  const createFormRef = useRef<HTMLFormElement>(null)
  const transition = useTransition()

  // Clear form input on submission
  useEffect(() => {
    invariant(createFormRef.current)

    const isLoading = transition.state === 'loading'
    const isCreating =
      transition.submission?.formData.get('intent') === 'create'
    const hasErrors = Boolean(actionData?.errors)

    // If intent was create and there are no errors we reset the form
    if (isLoading && isCreating && !hasErrors) {
      createFormRef.current.reset()
    }
  }, [actionData?.errors, transition])

  return (
    <main>
      {'__unscoped' in errors ? (
        <p className="mb-4 text-red-500">
          <span className="text-sm">{errors.__unscoped}</span>
        </p>
      ) : null}
      <section>
        <header className="mb-8">
          <h3 className="text-3xl font-semibold">Namespaces</h3>
        </header>
        <Table
          className="w-full text-sm"
          columns={[
            {
              key: 'name',
              title: 'Name',
              render: row => row.name,
            },
            {
              key: 'created-at',
              title: 'Created At',
              render: row => row.formattedCreatedAt,
            },
            {
              key: 'action-menu',
              title: <span className="sr-only">Namespaces action menu</span>,
              render: row => {
                return <NamespaceMenu namespace={row} />
              },
            },
          ]}
          rows={namespaces}
          rowKey={row => row.id}
        />
      </section>
      <section className="mt-8">
        <header>
          <h4 className="text-xl font-semibold">Create Namespace</h4>
        </header>
        <div className="mt-2 flex flex-col gap-y-1">
          <Form className="flex gap-x-2" method="post" ref={createFormRef}>
            <Input
              className="flex-grow sm:flex-grow-0"
              name="name"
              placeholder="Name"
              autoComplete="off"
              required
            />
            <Button name="intent" value="create" variant="primary">
              Create
            </Button>
          </Form>
          {'name' in errors ? (
            <span className="text-sm text-red-500">{errors.name}</span>
          ) : null}
        </div>
      </section>

      <Outlet />
    </main>
  )
}

// Components
type NamespaceMenuProps = {
  namespace: Pick<Namespace, 'name'>
}

function NamespaceMenu({ namespace }: NamespaceMenuProps) {
  const menuGroupClassName = 'flex flex-col'
  const menuItemClassName =
    'truncate text-ellipsis px-3 py-1.5 text-left ui-active:bg-gray-100 ui-disabled:text-gray-300'

  return (
    <Menu>
      <Float
        placement="left-start"
        offset={8}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <Menu.Button
          as={Button}
          variant="ghost"
          icon={<FiMoreHorizontal className="text-lg" />}
        />
        <Menu.Items
          as={Form}
          method="post"
          className="w-52 rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg focus:outline-none"
        >
          <input name="name" defaultValue={namespace.name} hidden />
          <div className={menuGroupClassName}>
            <Menu.Item
              as="button"
              name="intent"
              value="edit"
              className={menuItemClassName}
            >
              Edit namespace
            </Menu.Item>
          </div>
          <hr className="my-1 border-gray-200" />
          <div className={menuGroupClassName}>
            <Menu.Item
              as="button"
              className={classNames('text-danger-500', menuItemClassName)}
              name="intent"
              value="remove"
            >
              Remove namepsace
            </Menu.Item>
          </div>
        </Menu.Items>
      </Float>
    </Menu>
  )
}
