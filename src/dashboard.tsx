import { useEffect, useState } from "react";
import { REST } from "./lib/constants";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "./components/ui/input";

export interface Applicant {
  student_id: string;
  name: string;
  semester: string;
  personal_email: string;
  bracu_email: string;
  mobile: string;
  address: string;
  bio: string;
  date_of_birth: string; // ISO 8601 date string, e.g., "2025-03-04T00:00:00+00:00"
  gender: string;
  rs: string;
  preferred_departments: string[];
  facebook_profile_link: string;
  linkedin_profile_link?: string;
  github_profile_link?: string;
}

export const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: "student_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "personal_email",
    header: "Email",
  },
  {
    accessorKey: "bracu_email",
    header: "BRACU mail",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "bio",
    header: "Bio",
  },
  {
    accessorKey: "date_of_birth",
    header: "Birthday",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "rs",
    header: "RS batch",
  },
  {
    accessorKey: "preferred_departments",
    header: "Preferred Departments",
  },
  {
    accessorKey: "facebook_profile_link",
    header: "Facebook Profile Link",
  },
];

export default function Dashboard() {
  const [data, setData] = useState<Applicant[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    per_page: number;
  }>({
    total: 0,
    page: 1,
    per_page: 50,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [page, setPage] = useState(1);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    fetch(`${REST}/applicants?page=${page}&per_page=50`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
        }

        return res.json();
      })
      .then((data) => {
        setData(data.items);
        setMeta({
          total: data.total,
          page: data.page,
          per_page: data.per_page,
        });
      });
  }, [page]);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
          <CardDescription>
            List of applicants who have applied for the program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Download as .xlsx</Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between ">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={
              (table.getColumn("personal_email")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("personal_email")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center justify-end space-x-4 py-4">
          <span>
            Showing {meta.per_page * (page - 1) + 1} -{" "}
            {Math.min(meta.per_page * page, meta.total)} of {meta.total} results
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (page === 1) {
                return;
              }

              setPage(page - 1);

              table.previousPage();
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (page === Math.ceil(meta.total / meta.per_page)) {
                return;
              }
              setPage(page + 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
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
                );
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
  );
}
