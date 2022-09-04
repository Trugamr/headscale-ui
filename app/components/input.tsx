import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

export type InputProps = ComponentProps<'input'>

function InputComponent(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return <input {...props} ref={ref} />
}

const Input = forwardRef(InputComponent)
Input.displayName = 'Input'

export default Input
