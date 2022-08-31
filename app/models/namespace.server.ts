import { client } from '~/utils/client.server'

// Routes
export async function getNamespaces() {
  const { data } = await client.get<{ namespaces: Namespace[] }>(
    '/v1/namespace',
  )
  return data
}

// Types
export type Namespace = {
  id: string
  name: string
  createdAt: string
}
