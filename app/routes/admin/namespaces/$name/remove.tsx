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
import Button from '~/components/button'
import { getNamespace, removeNamespace } from '~/models/namespace.server'
import { ApiError } from '~/utils/client.server'

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.name, 'Namespace name not found in remove route')

  const formData = await request.formData()
  const body = Object.fromEntries(formData)

  const namespacesRoute = '/admin/namespaces'

  if (body.intent === 'cancel') {
    return redirect(namespacesRoute)
  }

  if (body.intent === 'remove_confirm') {
    try {
      await removeNamespace({ name: params.name })
      return redirect(namespacesRoute)
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
            __unscoped: 'Something went wrong while removing namespace',
          },
        },
        { status: 500 },
      )
    }
  }

  throw new Error('Invalid intent')
}

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.name, 'Namespace name not found in remove route')
  const { namespace } = await getNamespace({ name: params.name })
  return json({ namespace })
}

export default function RemoveNamespaceRoute() {
  const { namespace } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors ?? { __unscoped: undefined }
  const removeButtonRef = useRef<HTMLButtonElement>(null)
  const cancelFetcher = useFetcher()

  return (
    <Dialog
      as="div"
      className="relative z-10"
      open
      initialFocus={removeButtonRef}
      onClose={() => {
        cancelFetcher.submit({ intent: 'cancel' }, { method: 'post' })
      }}
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <Form
          method="post"
          replace
          className="flex min-h-full items-center justify-center p-4 text-center"
        >
          <Dialog.Panel className="w-full max-w-lg overflow-hidden rounded-md bg-white p-6 text-left shadow-xl">
            <div className="flex justify-between gap-x-4">
              <Dialog.Title
                as="h3"
                className="align-middle text-lg font-medium leading-6 text-gray-900"
              >
                Remove {namespace.name}
              </Dialog.Title>
              <Button
                name="intent"
                value="cancel"
                variant="subtle"
                icon={<FiX className="text-lg" />}
              />
            </div>

            {'__unscoped' in errors ? (
              <p className="mb-4 text-red-500">
                <span className="text-sm">{errors.__unscoped}</span>
              </p>
            ) : null}

            <div className="mt-4">
              <p className="text-sm text-gray-700">
                This namespace will permanently be removed.
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-x-3">
              <Button name="intent" value="cancel">
                Cancel
              </Button>
              <Button
                ref={removeButtonRef}
                name="intent"
                value="remove_confirm"
                variant="primary"
                danger
              >
                Remove <span className="hidden sm:inline">namespace</span>
              </Button>
            </div>
          </Dialog.Panel>
        </Form>
      </div>
    </Dialog>
  )
}

function noOp() {}
