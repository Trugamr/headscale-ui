import type { Argument } from 'classnames'
import classNames from 'classnames'
import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'outline' | 'primary' | 'ghost'
  size?: 'base' | 'sm'
  danger?: boolean
}

function ButtonComponent(
  {
    children,
    className,
    size = 'base',
    variant = 'outline',
    danger,
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
    },
    {
      'button-base': size === 'base',
      'button-sm': size === 'sm',
    },
    {
      'button-danger': danger,
    },
  ]

  return (
    <button className={classNames(classes)} {...rest} ref={ref}>
      {children}
    </button>
  )
}

const Button = forwardRef(ButtonComponent)
Button.displayName = 'Button'

export default Button
