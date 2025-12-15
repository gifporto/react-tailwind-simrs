"use client";

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmployeeAPI } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { toast } from "sonner";

export default function EmployeePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [employees, setEmployees] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);

  const perPage = 15;
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  // Params dari URL
  const deleted = searchParams.get("deleted");
  const created = searchParams.get("created");
  const updated = searchParams.get("updated");

  // Handle Toast untuk created / deleted / updated
  React.useEffect(() => {
    if (deleted === "1") toast.success("Employee berhasil dihapus!");
    if (created === "1") toast.success("Employee berhasil dibuat!");
    if (updated === "1") toast.success("Employee berhasil diperbarui!");

    if (deleted === "1" || created === "1" || updated === "1") {
      const t = setTimeout(() => {
        navigate("/employee", { replace: true });
      }, 500);

      return () => clearTimeout(t);
    }
  }, [deleted, created, updated]);

  // Load API
  React.useEffect(() => {
    const loadEmployees = async () => {
      try {
        const result: any = await EmployeeAPI.getList(page, perPage);

        setEmployees(result.data);
        setLastPage(result.meta.last_page);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [page]);

  const filtered = employees.filter((emp) =>
    emp.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-row justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-primary">Employee Management</CardTitle>
            <p className="text-sm text-muted-foreground">Manage hospital staff and employee records</p>
          </div>
          <Button 
            onClick={() => navigate("/employee/create")}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            + Add New Employee
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'employee' : 'employees'} found
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <LoadingSkeleton lines={6} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No employees found</div>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or add a new employee</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">No</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Address</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((emp, i) => (
                    <TableRow key={emp.id} className="table-row-hover">
                      <TableCell className="font-medium text-muted-foreground">{(page - 1) * perPage + (i + 1)}</TableCell>
                      <TableCell className="font-medium">{emp.user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.user.email}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.phone_number || '-'}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">{emp.address_domicile || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/employee/detail/${emp.id}`)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} employees
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary hover:text-primary-foreground"}
                    />
                  </PaginationItem>

                  {pages.slice(Math.max(0, page - 3), Math.min(lastPage, page + 2)).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={page === p}
                        onClick={() => setPage(p)}
                        className={`cursor-pointer ${
                          page === p 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "hover:bg-muted"
                        }`}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < lastPage && setPage(page + 1)}
                      className={
                        page === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
