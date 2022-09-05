import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import classNames from 'classnames'

export type ButtonProps = ComponentProps<'button'>

function ButtonComponent(
  { children, className, ...rest }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button className={classNames(className)} {...rest} ref={ref}>
      {children}
    </button>
  )
}

const Button = forwardRef(ButtonComponent)
Button.displayName = 'Button'

export default Button
