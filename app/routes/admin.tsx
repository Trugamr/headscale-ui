import type { NavLinkProps } from '@remix-run/react'
import { Link, NavLink, Outlet } from '@remix-run/react'
import classNames from 'classnames'

export default function AdminRoute() {
  return (
    <div>
      <div>
        <div>
          <header className="flex p-4">
            <Link to="/admin">
              <h1>headscale</h1>
            </Link>
          </header>
        </div>
        <nav className="flex gap-x-2 border px-4">
          <StyledNavLink to="namespaces">Namespaces</StyledNavLink>
          <StyledNavLink to="machines">Machines</StyledNavLink>
          <StyledNavLink to="settings">Settings</StyledNavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}

// Components
function StyledNavLink({ children, className, ...rest }: NavLinkProps) {
  return (
    <NavLink
      className={props => {
        const _className =
          typeof className === 'function' ? className(props) : className

        return classNames(props.isActive ? 'underline' : undefined, _className)
      }}
      {...rest}
    >
      {children}
    </NavLink>
  )
}
