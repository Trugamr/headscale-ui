import { json } from '@remix-run/node'
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { getNamespaces } from '~/models/namespace.server'

export const loader = async () => {
  const { namespaces } = await getNamespaces()

  if (namespaces.length === 0) {
    // TODO: Throw no namespaces found error and handle in boundary
    throw new Error('Not implemented')
  }

  return json({ namespaces })
}

export default function AdminRoute() {
  const { namespaces } = useLoaderData<typeof loader>()
  const [namespace] = namespaces

  return (
    <div>
      <div>
        <header className="flex">
          <Link to="/admin">
            <h1>{namespace.name}</h1>
          </Link>
        </header>
        <nav className="border">
          <NavLink to="machines">Machines</NavLink>
          <NavLink to="settings">Settings</NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
