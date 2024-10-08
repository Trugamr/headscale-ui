import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { requireUserId } from '~/utils/session.server'

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request)
  return redirect('/admin')
}
