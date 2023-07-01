import { Dialog } from '@headlessui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from '@remix-run/react'
import { useRef } from 'react'
import { FiX } from 'react-icons/fi'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import Button from '~/components/button'
import Input from '~/components/input'
import { getMachine, renameMachine } from '~/models/headscale/machine.server'
import { ApiError } from '~/utils/client.server'
import { requireUserId } from '~/utils/session.server'

export const action = async ({ request, params }: ActionArgs) => {
  await requireUserId(request)
  invariant(params.id, 'Machine id not found in remove route')

  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  const machinesRoute = '/admin/machines'

  if (body.intent === 'cancel') {
    return redirect(machinesRoute)
  }

  if (body.intent === 'update_name') {
    const parsed = z.object({ name: z.string() }).safeParse(body)
    if (!parsed.success) {
      return json(
        { errors: { __unscoped: 'Machine name should be a string' } },
        { status: 400 },
      )
    }
    try {
      await renameMachine({ id: params.id, name: parsed.data.name })
      return redirect(machinesRoute)
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
            __unscoped: 'Something went wrong while updating machine',
          },
        },
        { status: 500 },
      )
    }
  }

  throw new Error('Invalid intent')
}

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request)
  invariant(params.id, 'Machine id not found in remove route')

  const { machine } = await getMachine({ id: params.id })
  return json({ machine })
}

export default function RemoveUserRoute() {
  const { machine } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors ?? { __unscoped: undefined }
  const nameInputRef = useRef<HTMLInputElement>(null)
  const cancelFetcher = useFetcher()

  return (
    <Dialog
      as="div"
      className="relative z-10"
      open
      initialFocus={nameInputRef}
      onClose={() => {
        cancelFetcher.submit({ intent: 'cancel' }, { method: 'post' })
      }}
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-lg overflow-hidden rounded-md bg-white p-6 text-left shadow-xl">
            <div className="flex justify-between gap-x-4">
              <Dialog.Title
                as="h3"
                className="align-middle text-lg font-medium leading-6 text-gray-900"
              >
                Edit machine name for {machine.givenName}
              </Dialog.Title>
              <Form method="post" replace>
                <Button
                  name="intent"
                  value="cancel"
                  variant="subtle"
                  icon={<FiX className="text-lg" />}
                />
              </Form>
            </div>

            {'__unscoped' in errors ? (
              <p className="mb-4 text-red-500">
                <span className="text-sm">{errors.__unscoped}</span>
              </p>
            ) : null}

            <div className="mt-4">
              <p className="text-sm text-gray-700">
                This machine name will be shown in admin panel.
              </p>
            </div>

            <Form method="post" replace>
              <div className="mt-6 flex flex-col">
                <label htmlFor="machine-name" className="mb-2 max-w-max">
                  Machine name
                </label>
                <Input
                  ref={nameInputRef}
                  id="machine-name"
                  type="text"
                  name="name"
                  defaultValue={machine.givenName}
                />
              </div>

              {/* This is placed as first button in form so it can be triggered by pressing Enter key */}
              <input type="submit" name="intent" value="update_name" hidden />

              <div className="mt-8 flex justify-end gap-x-3">
                <Button name="intent" value="cancel">
                  Cancel
                </Button>
                <Button name="intent" value="update_name" variant="primary">
                  Update name
                </Button>
              </div>
            </Form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
