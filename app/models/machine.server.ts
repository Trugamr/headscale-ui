import { client } from '~/utils/client.server'
import type { Namespace } from './namespace.server'

// Routes
export function getMachine(options: GetMachineOptions) {
  return client.get(`v1/machine/${options.id}`).json<{ machine: Machine }>()
}

export function getMachines() {
  return client.get('v1/machine').json<{ machines: Machine[] }>()
}

export function registerMachine(params: RegisterMachineOptions) {
  return client
    .post('v1/machine/register', { searchParams: params })
    .json<{ machine: Machine }>()
}

export function renameMachine(options: RenameMachineOptions) {
  return client
    .post(`v1/machine/${options.id}/rename/${options.name}`)
    .json<{ machine: Machine }>()
}

export function removeMachine(options: RemoveMachineOptions) {
  return client.delete(`v1/machine/${options.id}`).json<{}>()
}

// Types
export type Machine = {
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

type GetMachineOptions = {
  id: string
}

type RegisterMachineOptions = {
  namespace: string
  key: string
}

type RenameMachineOptions = {
  id: string
  name: string
}

type RemoveMachineOptions = {
  id: string
}
