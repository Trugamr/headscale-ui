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
        'rounded border border-gray-200 py-1 px-2 hover:border-gray-400 focus:border-gray-200 focus:outline-none focus:ring-2',
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
