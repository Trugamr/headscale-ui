import { Authenticator, AuthorizationError } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { FormStrategy } from 'remix-auth-form'
import { login } from '~/models/user.server'
import invariant from 'tiny-invariant'

type User = Awaited<ReturnType<typeof login>>

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage)

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email')
    const password = form.get('password')

    invariant(typeof email === 'string', 'Email must be a string')
    invariant(typeof password === 'string', 'Password must be a string')

    const user = await login({ email, password })

    if (!user) {
      throw new AuthorizationError('Invalid email or password')
    }

    return user
  }),
  'email-password',
)
