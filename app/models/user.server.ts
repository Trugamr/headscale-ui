import { prisma } from '~/db.server'
import bcrypt from 'bcrypt'

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
    return {
      id: user.id,
      email: user.email,
    }
  }
  return null
}

// Types
export type LoginOptions = {
  email: string
  password: string
}
