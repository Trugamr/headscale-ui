import type { NavLinkProps } from '@remix-run/react'
import { Link, NavLink, Outlet } from '@remix-run/react'
import classNames from 'classnames'
import { FiServer, FiSettings, FiUsers } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { requireUserId } from '~/utils/session.server'
import type { LoaderArgs } from '@remix-run/node'

export const loader = ({ request }: LoaderArgs) => {
  return requireUserId(request)
}

export default function AdminRoute() {
  return (
    <div>
      <div className="mb-6 bg-gray-100 pt-4">
        <div className="container mx-auto">
          <div>
            <header className="mb-4 flex md:mb-6">
              <Link to="/admin">
                <h1 className="text-lg font-semibold">headscale</h1>
              </Link>
            </header>
          </div>
          <nav className="flex gap-x-2.5 md:gap-x-4">
            <StyledNavLink to="machines" icon={FiServer}>
              Machines
            </StyledNavLink>
            <StyledNavLink to="users" icon={FiUsers}>
              Users
            </StyledNavLink>
            <StyledNavLink to="settings" icon={FiSettings}>
              Settings
            </StyledNavLink>
          </nav>
        </div>
      </div>
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  )
}

// Components
type StyledNavLinkProps = Omit<NavLinkProps, 'children'> & {
  children: string
  icon: IconType
}

function StyledNavLink({
  children,
  className,
  icon: Icon,
  ...rest
}: StyledNavLinkProps) {
  return (
    <NavLink
      className={props => {
        const _className =
          typeof className === 'function' ? className(props) : className

        return classNames(
          props.isActive ? 'border-primary-500 text-primary-500' : undefined,
          'gap-x-1 border-b-2 px-0.5 pb-2 align-middle text-base md:gap-x-1.5 md:pb-3',
          _className,
        )
      }}
      {...rest}
    >
      <Icon className="mr-1.5 hidden align-middle text-lg sm:inline" />
      <span className="align-middle">{children}</span>
    </NavLink>
  )
}
