import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getMachines } from '~/models/machine.server'

export const loader = async () => {
  const { machines } = await getMachines()

  const _machines = machines.map(machine => {
    return {
      id: machine.id,
      givenName: machine.givenName,
      ipAddresses: machine.ipAddresses,
      lastSeen: new Date(machine.lastSeen).toLocaleString(),
      namespace: {
        name: machine.namespace.name,
      },
    }
  })

  return json({ machines: _machines })
}

export default function MachinesRoute() {
  const { machines } = useLoaderData<typeof loader>()

  return (
    <main className="p-4">
      <h3 className="mb-2 text-2xl">Machines</h3>
      <table className="table-auto">
        <thead>
          <tr className="space-x-3 text-left">
            <th className="py-1 pr-3">Name</th>
            <th className="py-1 pr-3">IP</th>
            <th className="py-1 pr-3">Last Seen</th>
            <th>
              <span className="sr-only">Machines action menu</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {machines.map(machine => {
            return (
              <tr key={machine.id} className="align-top">
                <td className="py-1 pr-3">
                  <div className="flex flex-col">
                    <span>{machine.givenName}</span>
                    <span>{machine.namespace.name}</span>
                  </div>
                </td>
                <td className="flex flex-col py-1 pr-3">
                  <div className="flex flex-col">
                    {machine.ipAddresses.map(ip => {
                      return <span key={ip}>{ip}</span>
                    })}
                  </div>
                </td>
                <td className="py-1 pr-3">{machine.lastSeen}</td>
                <td className="py-1">
                  <button className="rounded border px-2 shadow-sm" disabled>
                    ...
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
