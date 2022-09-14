import classNames from 'classnames'
import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

type OptionProps = ComponentProps<'option'>

type SelectOption = Pick<OptionProps, 'value' | 'key'> & {
  label: string
}

export type SelectProps = Omit<ComponentProps<'select'>, 'children'> & {
  options: SelectOption[]
}

function SelectComponent(
  { className, options, ...rest }: SelectProps,
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
      {options.map(item => {
        return (
          <option key={item.key} value={item.value} title={item.label}>
            {item.label}
          </option>
        )
      })}
    </select>
  )
}

const Select = forwardRef(SelectComponent)
Select.displayName = 'Select'

export default Select
