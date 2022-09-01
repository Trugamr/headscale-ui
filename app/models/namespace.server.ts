import { client } from '~/utils/client.server'

// Routes
export async function getNamespaces() {
  const { data } = await client.get<{ namespaces: Namespace[] }>(
    '/v1/namespace',
  )
  return data
}

export async function createNamespace({ name }: CreateNamespaceOptions) {
  const { data } = await client.post<Namespace>('/v1/namespace', { name })
  return data
}

// Types
export type Namespace = {
  id: string
  name: string
  createdAt: string
}

type CreateNamespaceOptions = {
  name: string
}
