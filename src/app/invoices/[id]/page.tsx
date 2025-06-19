"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { mockApi, Invoice } from "@/lib/api/mockApi";
import { formatCurrency, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";

interface InvoiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const invoiceId = parseInt(resolvedParams.id);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await mockApi.getInvoiceById(invoiceId);
        if (data) {
          setInvoice(data);
        } else {
          setNotification({
            message: "Invoice not found",
            type: "error",
          });
          setTimeout(() => router.push("/invoices"), 2000);
        }
      } catch (error) {
        setNotification({
          message: "Failed to fetch invoice",
          type: "error",
        });
        console.error(error);
        setTimeout(() => router.push("/invoices"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, router]);

  const handleUpdateStatus = async (
    status: "Pending" | "Paid" | "Cancelled"
  ) => {
    if (!invoice) return;

    try {
      const updatedInvoice = await mockApi.updateInvoice(invoiceId, { status });
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
        setNotification({
          message: "Invoice status updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      setNotification({
        message: "Failed to update invoice status",
        type: "error",
      });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium">Invoice not found</h2>
        <Button className="mt-4" onClick={() => router.push("/invoices")}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Details</h1>
        <Button variant="secondary" onClick={() => router.push("/invoices")}>
          Back to Invoices
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Invoice #{invoice.id}</h2>
            <p className="text-gray-600">Order: {invoice.orderNumber}</p>
            <p className="text-gray-600">Date: {formatDate(invoice.date)}</p>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                invoice.status === "Paid"
                  ? "bg-green-100 text-green-800"
                  : invoice.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Customer Information</h3>
          <p className="text-gray-600">{invoice.customerName}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm">{item.name}</td>
                    <td className="px-4 py-2 text-sm">{item.category}</td>
                    <td className="px-4 py-2 text-sm">
                      {formatCurrency(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span>Total Amount:</span>
            <span className="font-medium">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>
          {invoice.customPrice !== undefined && (
            <div className="flex justify-between">
              <span>Custom Price:</span>
              <span className="font-medium">
                {formatCurrency(invoice.customPrice)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Update Status</h3>
        <div className="flex space-x-4">
          <Button
            variant={invoice.status === "Pending" ? "primary" : "secondary"}
            onClick={() => handleUpdateStatus("Pending")}
            disabled={invoice.status === "Pending"}
          >
            Mark as Pending
          </Button>
          <Button
            variant={invoice.status === "Paid" ? "primary" : "secondary"}
            onClick={() => handleUpdateStatus("Paid")}
            disabled={invoice.status === "Paid"}
          >
            Mark as Paid
          </Button>
          <Button
            variant={invoice.status === "Cancelled" ? "danger" : "secondary"}
            onClick={() => handleUpdateStatus("Cancelled")}
            disabled={invoice.status === "Cancelled"}
          >
            Mark as Cancelled
          </Button>
        </div>
      </div>

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
