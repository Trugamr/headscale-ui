import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  Key,
  ReactNode,
} from 'react'
import classNames from 'classnames'

type TableColumn<Row> = Pick<ComponentProps<'th'>, 'className'> & {
  key: string
  title: ReactNode
  render: (row: Row) => ReactNode
}

export type TableProps<Row> = Pick<
  ComponentPropsWithoutRef<'table'>,
  'className'
> & {
  columns: TableColumn<Row>[]
  rows: Row[]
  rowKey: (row: Row) => Key
}

export default function TableComponent<Row = unknown>({
  rows,
  className,
  columns,
  rowKey,
  ...rest
}: TableProps<Row>) {
  return (
    <table className={classNames(className)} {...rest}>
      <thead>
        <tr className="space-x-3 border-b border-b-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
          {columns.map(({ key, title }) => {
            return (
              <th key={key} className="py-2 px-2">
                {title}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          return (
            <tr
              className="border-b border-b-gray-200 hover:bg-gray-50"
              key={rowKey(row)}
            >
              {columns.map((column, index) => {
                return (
                  <td
                    key={column.key}
                    className={classNames('py-2 px-2', column.className)}
                  >
                    {column.render(row)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
