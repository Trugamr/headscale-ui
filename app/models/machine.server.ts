import { client } from '~/utils/client.server'
import type { Namespace } from './namespace.server'

// Routes
export async function getMachines() {
  const { data } = await client.get<{ machines: Machine[] }>('/v1/machine')
  return data
}

// Types
type Machine = {
  id: string
  machineKey: string
  nodeKey: string
  discoKey: string
  ipAddresses: ['fd7a:115c:a1e0::1', '100.64.0.1']
  name: string
  namespace: Namespace
  lastSeen: string
  lastSuccessfulUpdate: string
  expiry: string
  preAuthKey: null
  createdAt: string
  registerMethod: 'REGISTER_METHOD_UNSPECIFIED'
  forcedTags: string[]
  invalidTags: string[]
  validTags: string[]
  givenName: string
}
