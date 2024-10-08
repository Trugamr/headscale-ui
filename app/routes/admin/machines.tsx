import type { ActionArgs, LoaderArgs } from '@remix-run/node'
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
import Button from '~/components/button'
import Table from '~/components/table'
import type { Machine } from '~/models/headscale/machine.server'
import { getMachines, registerMachine } from '~/models/headscale/machine.server'
import { FiMoreHorizontal } from 'react-icons/fi'
import Input from '~/components/input'
import { useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { ApiError } from '~/utils/client.server'
import { getUsers } from '~/models/headscale/user.server'
import Select from '~/components/select'
import { requireUserId } from '~/utils/session.server'
import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import classNames from 'classnames'

export const action = async ({ request }: ActionArgs) => {
  await requireUserId(request)

  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  if (body.intent === 'register') {
    const parsed = z
      .object({ user: z.string().min(1).max(63), key: z.string() })
      .safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }
    try {
      const { machine } = await registerMachine({
        user: parsed.data.user,
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

  if (body.intent === 'edit_name') {
    const parsed = z.object({ id: z.string() }).safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: { __unscoped: 'Machine id should be a string' } },
        { status: 400 },
      )
    }
    return redirect(`/admin/machines/${parsed.data.id}/name/edit`)
  }

  if (body.intent === 'remove') {
    const parsed = z.object({ id: z.string() }).safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: { __unscoped: 'Machine id should be a string' } },
        { status: 400 },
      )
    }
    const id = parsed.data.id
    return redirect(`/admin/machines/${id}/remove`)
  }

  throw new Error('Invalid intent')
}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request)

  const { users } = await getUsers()
  const { machines } = await getMachines()

  const _users = users.map(user => {
    return {
      id: user.id,
      name: user.name,
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
      user: {
        name: machine.user.name,
      },
    }
  })

  return json({ machines: _machines, users: _users })
}

export default function MachinesRoute() {
  const { machines, users } = useLoaderData<typeof loader>()
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
                  <span>{row.user.name}</span>
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
              title: <span className="sr-only">Machine action menu</span>,
              render: row => {
                return <MachineMenu machine={row} />
              },
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
              <Select name="user" className="truncate text-ellipsis" required>
                <Select.Option value="">Select user</Select.Option>
                {users.map(user => {
                  return (
                    <Select.Option key={user.id} value={user.name}>
                      {user.name}
                    </Select.Option>
                  )
                })}
              </Select>
              {'user' in errors ? (
                <span className="text-sm text-red-500">{errors.user}</span>
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

      <Outlet />
    </main>
  )
}

// Components
type MachineMenuProps = {
  machine: Pick<Machine, 'id'>
}

function MachineMenu({ machine }: MachineMenuProps) {
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
          <input name="id" defaultValue={machine.id} hidden />
          <div className={menuGroupClassName}>
            <Menu.Item
              as="button"
              name="intent"
              value="edit_name"
              className={menuItemClassName}
            >
              Edit machine name
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
              Remove machine
            </Menu.Item>
          </div>
        </Menu.Items>
      </Float>
    </Menu>
  )
}
