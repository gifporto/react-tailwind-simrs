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
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle>Daftar Employees</CardTitle>
          <Button onClick={() => navigate("/employee/create")}>
            + Tambah Employee
          </Button>
        </div>

        <Input
          placeholder="Cari nama..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
      </CardHeader>

      <CardContent>
        {loading ? (
          <LoadingSkeleton lines={6} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Tidak ada data</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell>{(page - 1) * perPage + (i + 1)}</TableCell>
                    <TableCell>{emp.user.name}</TableCell>
                    <TableCell>{emp.user.email}</TableCell>
                    <TableCell>{emp.phone_number}</TableCell>
                    <TableCell>{emp.address_domicile}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/employee/detail/${emp.id}`)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {pages.map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < lastPage && setPage(page + 1)}
                    className={
                      page === lastPage ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  );
}
