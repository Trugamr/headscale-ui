import type { LoaderArgs } from '@remix-run/node'
import { requireUserId } from '~/utils/session.server'

export const loader = ({ request }: LoaderArgs) => {
  return requireUserId(request)
}

export default function SettingsRoute() {
  return (
    <main>
      <section>
        <header className="mb-8">
          <h3 className="text-3xl font-semibold">Settings</h3>
        </header>
        <div className="text-gray-500">Coming soon</div>
      </section>
    </main>
  )
}
