import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import { format } from 'date-fns'
import Button from '~/components/button'
import Table from '~/components/table'
import { getMachines, registerMachine } from '~/models/machine.server'
import { FiMoreHorizontal } from 'react-icons/fi'
import Input from '~/components/input'
import { useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { ApiError } from '~/utils/client.server'
import { getNamespaces } from '~/models/namespace.server'
import Select from '~/components/select'
import { requireUserId } from '~/utils/session.server'

export const action = async ({ request }: ActionArgs) => {
  await requireUserId(request)

  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  if (body.intent === 'register') {
    const parsed = z
      .object({ namespace: z.string().min(1).max(63), key: z.string() })
      .safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }
    try {
      const { machine } = await registerMachine({
        namespace: parsed.data.namespace,
        key: parsed.data.key,
      })
      return json({ machine, errors: null })
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
            __unscoped: 'Something went wrong while registering machine',
          },
        },
        { status: 500 },
      )
    }
  }

  throw new Error('Invalid intent')
}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request)

  const { namespaces } = await getNamespaces()
  const { machines } = await getMachines()

  const _namespaces = namespaces.map(namespace => {
    return {
      id: namespace.id,
      name: namespace.name,
    }
  })

  const _machines = machines.map(machine => {
    const formattedLastSeen = format(
      new Date(machine.lastSeen),
      'LLL M yyyy, hh:mm a',
    )

    return {
      id: machine.id,
      givenName: machine.givenName,
      ipAddresses: machine.ipAddresses,
      formattedLastSeen,
      namespace: {
        name: machine.namespace.name,
      },
    }
  })

  return json({ machines: _machines, namespaces: _namespaces })
}

export default function MachinesRoute() {
  const { machines, namespaces } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors ?? {}

  const registerFormRef = useRef<HTMLFormElement>(null)
  const transition = useTransition()

  useEffect(() => {
    invariant(registerFormRef.current)

    const isLoading = transition.state === 'loading'
    const isRegistering =
      transition.submission?.formData.get('intent') === 'register'
    const hasErrors = Boolean(actionData?.errors)

    // If intent was register and there are no errors we reset the form
    if (isLoading && isRegistering && !hasErrors) {
      registerFormRef.current.reset()
    }
  }, [actionData?.errors, transition.state, transition.submission?.formData])

  return (
    <main>
      {'__unscoped' in errors ? (
        <p className="mb-4 text-red-500">
          <span className="text-sm">{errors.__unscoped}</span>
        </p>
      ) : null}
      <section>
        <header className="mb-8">
          <h3 className="text-3xl font-semibold">Machines</h3>
        </header>
        <Table
          className="w-full text-sm"
          rows={machines}
          emptyText="No machines"
          columns={[
            {
              key: 'name',
              title: 'Name',
              render: row => (
                <div className="flex flex-col">
                  <span className="font-medium">{row.givenName}</span>
                  <span>{row.namespace.name}</span>
                </div>
              ),
            },
            {
              key: 'ip',
              title: 'ip',
              render: row => (
                <div className="flex flex-col">
                  {row.ipAddresses.map(ip => {
                    return <span key={ip}>{ip}</span>
                  })}
                </div>
              ),
            },
            {
              key: 'last-seen',
              title: 'Last Seen',
              className: 'align-top',
              render: row => row.formattedLastSeen,
            },
            {
              key: 'action-menu',
              title: <span className="sr-only">Namespaces action menu</span>,
              render: row => (
                <Button title={row.id} variant="ghost" size="sm">
                  <FiMoreHorizontal className="text-lg" />
                </Button>
              ),
            },
          ]}
          rowKey={row => row.id}
        />
      </section>
      <section className="mt-8">
        <header>
          <h4 className="text-xl font-semibold">Register Machine</h4>
        </header>
        <div className="mt-2 flex flex-col">
          <Form
            className="flex flex-col gap-2 sm:flex-row"
            method="post"
            ref={registerFormRef}
          >
            <div className="flex flex-grow flex-col gap-y-1">
              <Select
                name="namespace"
                className="truncate text-ellipsis"
                required
              >
                <Select.Option value="">Select namespace</Select.Option>
                {namespaces.map(namespace => {
                  return (
                    <Select.Option key={namespace.id} value={namespace.name}>
                      {namespace.name}
                    </Select.Option>
                  )
                })}
              </Select>
              {'namespace' in errors ? (
                <span className="text-sm text-red-500">{errors.namespace}</span>
              ) : null}
            </div>
            <div className="flex flex-grow-[2] flex-col gap-y-1">
              <Input name="key" placeholder="Key" autoComplete="off" required />
              {'key' in errors ? (
                <span className="text-sm text-red-500">{errors.key}</span>
              ) : null}
            </div>
            <Button
              name="intent"
              value="register"
              variant="primary"
              className="mt-2 justify-center sm:mt-0"
            >
              Register
            </Button>
          </Form>
        </div>
      </section>
    </main>
  )
}
