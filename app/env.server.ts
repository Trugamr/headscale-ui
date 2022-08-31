import invariant from 'tiny-invariant'

export function getEnv() {
  invariant(process.env.HEADSCALE_API_KEY, 'HEADSCALE_API_KEY not set')
  invariant(process.env.HEADSCALE_API_URL, 'HEADSCALE_API_URL not set')

  return {
    HEADSCALE_API_KEY: process.env.HEADSCALE_API_KEY,
    HEADSCALE_API_URL: process.env.HEADSCALE_API_URL,
  }
}
