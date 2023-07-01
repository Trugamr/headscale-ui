import type { NavLinkProps } from '@remix-run/react'
import { Form } from '@remix-run/react'
import { Link, NavLink, Outlet } from '@remix-run/react'
import classNames from 'classnames'
import { FiServer, FiSettings, FiUser, FiUsers } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { requireUserId } from '~/utils/session.server'
import type { LoaderArgs } from '@remix-run/node'
import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'

export const loader = ({ request }: LoaderArgs) => {
  return requireUserId(request)
}

export default function AdminRoute() {
  return (
    <div>
      <div className="mb-6 bg-gray-100 pt-4">
        <div className="container mx-auto">
          <div>
            <header className="mb-4 flex items-center justify-between md:mb-6">
              <Link to="/admin">
                <h1 className="text-lg font-semibold">headscale</h1>
              </Link>

              <Menu>
                <Float
                  placement="bottom-end"
                  offset={8}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                >
                  <Menu.Button
                    as="button"
                    className="rounded-full border border-gray-200 bg-white p-2 hover:border-gray-300 focus:outline-none focus:ring focus:ring-primary-300"
                  >
                    <FiUser className="text-lg" />
                  </Menu.Button>
                  <Menu.Items
                    as={Form}
                    method="post"
                    action="/logout"
                    className="w-40 rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg focus:outline-none"
                  >
                    <Menu.Item
                      as="button"
                      className="w-full truncate text-ellipsis px-3 py-1.5 text-left ui-active:bg-gray-100 ui-disabled:text-gray-300"
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Items>
                </Float>
              </Menu>
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
