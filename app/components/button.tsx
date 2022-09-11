import type { Argument } from 'classnames'
import classNames from 'classnames'
import type { ComponentProps, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'outline' | 'primary' | 'ghost' | 'subtle'
  size?: 'base' | 'sm'
  danger?: boolean
  icon?: ReactNode
}

function ButtonComponent(
  {
    children,
    className,
    size = 'base',
    variant = 'outline',
    danger,
    icon,
    ...rest
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const classes: Argument[] = [
    'button',
    {
      'button-outline': variant == 'outline',
      'button-primary': variant == 'primary',
      'button-ghost': variant == 'ghost',
      'button-subtle': variant == 'subtle',
    },
    {
      'button--base': size === 'base',
      'button--sm': size === 'sm',
    },
    {
      'button--square': typeof children === 'undefined',
    },
    {
      'button--danger': danger,
    },
  ]

  return (
    <button className={classNames(classes)} {...rest} ref={ref}>
      {icon}
      {typeof children === 'string' ? <span>{children}</span> : children}
    </button>
  )
}

const Button = forwardRef(ButtonComponent)
Button.displayName = 'Button'

export default Button
