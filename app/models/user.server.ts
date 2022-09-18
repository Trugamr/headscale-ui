import { prisma } from '~/utils/db.server'
import bcrypt from 'bcrypt'
import type { User } from '@prisma/client'

export async function login({ email, password }: LoginOptions) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  })
  if (!user) {
    return null
  }
  if (!user.password) {
    return null
  }
  const isPasswordMatching = await bcrypt.compare(password, user.password.hash)
  if (isPasswordMatching) {
    return user.id
  }
  return null
}

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
  })
}

// Types
export type LoginOptions = {
  email: string
  password: string
}
