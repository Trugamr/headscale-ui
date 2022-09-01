import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { getNamespaces } from '~/models/namespace.server'

export const loader = async () => {
  const { namespaces } = await getNamespaces()
  const _namespaces = namespaces.map(namespace => {
    return {
      ...namespace,
      createdAt: new Date(namespace.createdAt).toLocaleString(),
    }
  })
  return json({ namespaces: _namespaces })
}

export default function MachinesRoute() {
  const { namespaces } = useLoaderData<typeof loader>()

  return (
    <main className="p-4">
      <h3 className="mb-2 text-2xl">Namespaces</h3>
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
                <td className="py-1 pr-3">{namespace.createdAt}</td>
                <td className="py-1">
                  <button className="rounded border px-2 shadow-sm">...</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h4 className="mb-2 text-lg">Add new namespace</h4>
      <Form className="flex gap-x-2" method="post">
        <div>
          <input
            name="name"
            placeholder="Name"
            className="border placeholder:px-1.5"
            required
          />
        </div>
        <button name="intent" value="create">
          Create
        </button>
      </Form>
    </main>
  )
}
