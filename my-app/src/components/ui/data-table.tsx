"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    FilterFn,
    SortingFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    sortingFns,
} from "@tanstack/react-table"

import { ModeToggle } from "@/app/page"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState, useEffect, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DataTableViewOptions } from "../DataTableViewOption"



export function PaginationDemo({ currentPage, totalPages, setCurrentPage, setTotalPages }){
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
          onClick={() => setCurrentPage(currentPage - 1)} 
           />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive={currentPage === 1}>{currentPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => setCurrentPage(currentPage + 1)}  />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

 
function DebouncedInput({
      value: initialValue,
      onChange,
      debounce = 500,
      ...props
    }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)
  
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
    }, [value])
  
    return (
      <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}
  
declare module '@tanstack/react-table' {
    //add fuzzy filter to the filterFns
    interface FilterFns {
      fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
      itemRank: RankingInfo
    }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
  
    // Store the itemRank info
    addMeta({
      itemRank,
    })
  
    // Return if the item should be filtered in/out
    return itemRank.passed
}

  export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0
  
    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
        rowA.columnFiltersMeta[columnId]?.itemRank!,
        rowB.columnFiltersMeta[columnId]?.itemRank!
      )
    }
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

// Sorting with side panel
function SortPanel({ onSortChange }) {
  const handleSortChange = (event) => {
    const { value } = event.target;
    onSortChange([{ id: value, desc: false }]);
  };

  return (
    <div className="absolute right-0 top-0 mt-11 mr-8 bg-black border border-gray-600 rounded-lg p-2 text-white">
      <h6 style={{ fontSize: '0.8rem' }}>Sort By:</h6>
      <select onChange={handleSortChange} className="bg-black" style={{ fontSize: '0.8rem', width: '150px'}}>
        <option value="category">Category</option>
        <option value="subCategory">Sub Category</option>
        <option value="createdAt">Created At</option>
        <option value="updatedAt">Updated At</option>
        <option value="price">Price</option>
        <option value="salePrice">Sale Price</option>
      </select>
    </div>
  );
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ 
  columns,
  data,

}: DataTableProps<TData, TValue>) {
   
    const [currentPage, setCurrentPage] = useState(1); // Add state for current page
    const [totalPages, setTotalPages] = useState(Math.ceil(data.length / 10));
        const [sorting, setSorting] = useState<SortingState>([])
      const [globalFilter, setGlobalFilter] = useState('')
      const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
      )

    const table = useReactTable({
        data,
        columns,
        enableSorting: true, 
        initialState: { sorting }, // Initialize with sorting state
        
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'fuzzy',
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter,
            columnFilters,
        },
        filterFns: {
            fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
          }
    })

  
  return (
    <>
    
    <SortPanel onSortChange={setSorting} />
    <DataTableViewOptions table={table} />
    <div className="flex items-center justify-end py-4 ">
    <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block rounded-md text-black"
          placeholder="Search all columns..."
        />
    </div>
   
    <div className="rounded-md border text-center">

      <Table >
        <TableHeader >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
    <PaginationDemo
        currentPage={currentPage}
        totalPages={totalPages}
        
        setCurrentPage={(page) => {
          if (page >= 1) {
            setCurrentPage(page);
            // Sync with react-table's pagination state
            table.setPageIndex(page - 1);
          }
        }}
        setTotalPages={(pages) => setTotalPages(pages)}
      />
  </div>
  </>
  )
}

