import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  Key,
  ReactNode,
} from 'react'
import classNames from 'classnames'
import { FiHardDrive } from 'react-icons/fi'

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
  emptyText?: string
}

export default function TableComponent<Row = unknown>({
  rows,
  className,
  columns,
  rowKey,
  emptyText = 'No data',
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
        {rows.length === 0 ? (
          <tr className="rounded-md border border-gray-200 bg-gray-50">
            <td colSpan={columns.length}>
              <div className="flex items-center justify-center px-3 py-6">
                <div className="flex flex-col items-center gap-y-1">
                  <FiHardDrive className="text-4xl text-gray-400" />
                  <p className="text-medium text-gray-400">{emptyText}</p>
                </div>
              </div>
            </td>
          </tr>
        ) : null}
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
