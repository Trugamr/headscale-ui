import classNames from 'classnames'
import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

export type SelectProps = ComponentProps<'select'>

function SelectComponent(
  { className, children, ...rest }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  return (
    <select
      className={classNames(
        'appearance-none rounded-md border border-gray-200 py-1.5 pl-3 pr-7 leading-tight hover:border-gray-400 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300',
        className,
      )}
      {...rest}
      ref={ref}
    >
      {children}
    </select>
  )
}

export type SelectOptionProps = ComponentProps<'option'>

function SelectOptionComponent(
  { children, ...rest }: SelectOptionProps,
  ref: ForwardedRef<HTMLOptionElement>,
) {
  return (
    <option {...rest} ref={ref}>
      {children}
    </option>
  )
}

const Select = forwardRef(SelectComponent)
Select.displayName = 'Select'

const SelectOption = forwardRef(SelectOptionComponent)
SelectOption.displayName = 'SelectOption'

export default Object.assign(Select, {
  Option: SelectOption,
})
