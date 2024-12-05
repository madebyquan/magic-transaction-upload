'use client'

import { useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import { ExtractedData } from '@/types'
import { ArrowUpDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { format, isValid, parseISO } from 'date-fns'

const columnHelper = createColumnHelper<ExtractedData>()

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString)
    return isValid(date) ? format(date, 'yyyy-MM-dd') : dateString
  } catch {
    return dateString
  }
}

const columns = [
  columnHelper.accessor('stockTicker', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock Ticker
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }),
  columnHelper.accessor('numberOfShares', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shares
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }),
  columnHelper.accessor('purchasePrice', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ getValue }) => {
      const value = getValue()
      const numericValue = typeof value === 'string' ? parseFloat(value) : value
      return typeof numericValue === 'number' && !isNaN(numericValue) 
        ? `$${numericValue.toFixed(2)}`
        : '$0.00'
    },
  }),
  columnHelper.accessor('purchaseDate', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date (YYYY-MM-DD)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  columnHelper.accessor('transactionType', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ getValue }) => (
      <span className={`capitalize ${getValue() === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
        {getValue()}
      </span>
    ),
  }),
]

interface DataTableProps {
  data: ExtractedData[]
}

export default function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 