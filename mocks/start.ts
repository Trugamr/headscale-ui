import { setupServer } from 'msw/node'

const server = setupServer()

server.listen({ onUnhandledRequest: 'warn' })
console.info('🔶 Mock server installed')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())
