import redaxios from 'redaxios'
import { getEnv } from '~/env.server'

const { HEADSCALE_API_KEY, HEADSCALE_API_URL } = getEnv()

export const client = redaxios.create({
  baseURL: HEADSCALE_API_URL,
  headers: {
    Authorization: `Bearer ${HEADSCALE_API_KEY}`,
  },
})
