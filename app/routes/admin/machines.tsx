import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import Button from '~/components/button'
import Table from '~/components/table'
import { getMachines } from '~/models/machine.server'
import { FiMoreHorizontal } from 'react-icons/fi'

export const loader = async () => {
  const { machines } = await getMachines()

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

  return json({ machines: _machines })
}

export default function MachinesRoute() {
  const { machines } = useLoaderData<typeof loader>()

  return (
    <main>
      <section>
        <header className="mb-8">
          <h3 className="text-3xl font-semibold">Machines</h3>
        </header>
        <Table
          className="w-full text-sm"
          rows={machines}
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
    </main>
  )
}
