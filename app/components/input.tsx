import classNames from 'classnames'
import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

export type InputProps = ComponentProps<'input'>

function InputComponent(
  { className, ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      className={classNames(
        'rounded-md border border-gray-200 py-1.5 px-3 leading-tight hover:border-gray-400 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300',
        className,
      )}
      {...rest}
      ref={ref}
    />
  )
}

const Input = forwardRef(InputComponent)
Input.displayName = 'Input'

export default Input
