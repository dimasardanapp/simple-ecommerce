"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockApi } from "@/lib/api/mockApi";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsResponse = await mockApi.getProducts(1, 1000);

        const invoicesResponse = await mockApi.getInvoices(1, 1000);

        const totalProducts = productsResponse.total;
        const totalInvoices = invoicesResponse.total;

        const totalRevenue = invoicesResponse.invoices.reduce(
          (sum, invoice) => {
            return invoice.status === "Paid"
              ? sum + (invoice.customPrice || invoice.totalAmount)
              : sum;
          },
          0
        );

        const pendingInvoices = invoicesResponse.invoices.filter(
          (invoice) => invoice.status === "Pending"
        ).length;

        setStats({
          totalProducts,
          totalInvoices,
          totalRevenue,
          pendingInvoices,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">E-commerce Dashboard</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Manage your products and create invoices with custom pricing and
          backdated options.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Total Products
            </h2>
            <p className="text-3xl font-bold text-[#00a5c9]">
              {stats.totalProducts}
            </p>
            <Link
              href="/products"
              className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              View all products →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Total Invoices
            </h2>
            <p className="text-3xl font-bold text-[#00a5c9]">
              {stats.totalInvoices}
            </p>
            <Link
              href="/invoices"
              className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              View all invoices →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Total Revenue
            </h2>
            <p className="text-3xl font-bold text-[#00a5c9]">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Pending Invoices
            </h2>
            <p className="text-3xl font-bold text-[#00a5c9]">
              {stats.pendingInvoices}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-[#00a5c9]">
          <h2 className="text-xl font-bold mb-4">Product Management</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Manage your product inventory with features for creating, editing,
            and deleting products.
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Create and manage products</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Search and filter products</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Sort and paginate product listings</span>
            </div>
          </div>
          <Link href="/products">
            <button className="mt-4 px-4 py-2 bg-foreground text-background rounded hover:bg-gray-700 transition-colors">
              Manage Products
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-[#00a5c9]">
          <h2 className="text-xl font-bold mb-4">Invoice Management</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Create and manage invoices with custom pricing and backdated
            options.
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Create invoices with custom pricing</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Set backdated invoices</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Track invoice status</span>
            </div>
          </div>
          <Link href="/invoices">
            <button className="mt-4 px-4 py-2 bg-foreground text-background rounded hover:bg-gray-700 transition-colors">
              Manage Invoices
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
