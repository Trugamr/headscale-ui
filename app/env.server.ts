import { z } from 'zod'

export function getEnv() {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    HEADSCALE_API_KEY: z.string(),
    HEADSCALE_API_URL: z.string(),
    SESSION_SECRET: z.string(),
  })

  return schema.parse(process.env)
}
