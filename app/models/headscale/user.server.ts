import { client } from '~/utils/client.server'

// Routes
export function getUsers() {
  return client.get('v1/user').json<{ users: User[] }>()
}

export function getUser({ name }: GetUserOptions) {
  return client.get(`v1/user/${name}`).json<{ user: User }>()
}

export function createUser({ name }: CreateUserOptions) {
  return client.post('v1/user', { json: { name } }).json<{ user: User }>()
}

export function removeUser({ name }: RemoveUserOptions) {
  return client.delete(`v1/user/${name}`).json<{}>()
}

export function renameUser({ before, after }: RenameUserOptions) {
  return client.post(`v1/user/${before}/rename/${after}`).json<{ user: User }>()
}

// Types
export type User = {
  id: string
  name: string
  createdAt: string
}

type GetUserOptions = {
  name: string
}

type CreateUserOptions = {
  name: string
}

type RemoveUserOptions = {
  name: string
}

type RenameUserOptions = {
  before: string
  after: string
}
