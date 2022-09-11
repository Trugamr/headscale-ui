import { client } from '~/utils/client.server'

// Routes
export function getNamespaces() {
  return client.get('v1/namespace').json<{ namespaces: Namespace[] }>()
}

export function getNamespace({ name }: GetNamespaceOptions) {
  return client.get(`v1/namespace/${name}`).json<{ namespace: Namespace }>()
}

export function createNamespace({ name }: CreateNamespaceOptions) {
  return client.post('v1/namespace', { json: { name } }).json<Namespace>()
}

export function removeNamespace({ name }: RemoveNamespaceOptions) {
  return client.delete(`v1/namespace/${name}`).json<{}>()
}

// Types
export type Namespace = {
  id: string
  name: string
  createdAt: string
}

type GetNamespaceOptions = {
  name: string
}

type CreateNamespaceOptions = {
  name: string
}

type RemoveNamespaceOptions = {
  name: string
}
