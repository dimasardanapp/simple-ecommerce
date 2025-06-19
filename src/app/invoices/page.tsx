"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockApi, Invoice } from "@/lib/api/mockApi";
import { formatCurrency, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Notification from "@/components/ui/Notification";
import { useRouter } from "next/navigation";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const router = useRouter();

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getInvoices(currentPage, itemsPerPage);
      setInvoices(response.invoices);
      setTotalItems(response.total);
    } catch (error) {
      setNotification({
        message: "Failed to fetch invoices",
        type: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage]);

  const columns = [
    {
      header: "No.",
      accessor: (invoice: Invoice, index: number) =>
        (currentPage - 1) * itemsPerPage + index + 1,
    },
    { header: "Order Number", accessor: "orderNumber" as keyof Invoice },
    { header: "Customer", accessor: "customerName" as keyof Invoice },
    {
      header: "Date",
      accessor: (invoice: Invoice) => formatDate(invoice.date),
    },
    {
      header: "Total Amount",
      accessor: (invoice: Invoice) => formatCurrency(invoice.totalAmount),
    },
    {
      header: "Custom Price",
      accessor: (invoice: Invoice) =>
        invoice.customPrice ? formatCurrency(invoice.customPrice) : "-",
    },
    {
      header: "Status",
      accessor: (invoice: Invoice) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            invoice.status === "Paid"
              ? "bg-green-100 text-green-800"
              : invoice.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {invoice.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link href="/invoices/create">
          <Button>Create New Invoice</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
        </div>
      ) : (
        <>
          <Table
            data={invoices}
            columns={columns}
            onRowClick={(invoice) => {
              router.push(`/invoices/${invoice.id}`);
            }}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
