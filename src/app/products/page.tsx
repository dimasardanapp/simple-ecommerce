"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockApi, Product } from "@/lib/api/mockApi";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Notification from "@/components/ui/Notification";
import Input from "@/components/ui/Input";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Product | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getProducts(
        currentPage,
        itemsPerPage,
        searchTerm,
        sortBy as string,
        sortOrder
      );
      setProducts(response.products);
      setTotalItems(response.total);
    } catch (error) {
      setNotification({
        message: "Failed to fetch products",
        type: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const success = await mockApi.deleteProduct(id);
      if (success) {
        setNotification({
          message: "Product deleted successfully",
          type: "success",
        });
        fetchProducts();
      }
    } catch (error) {
      setNotification({
        message: "Failed to delete product",
        type: "error",
      });
      console.error(error);
    }
  };

  const handleSort = (column: keyof Product, direction: "asc" | "desc") => {
    setSortBy(column);
    setSortOrder(direction);
  };

  const columns = [
    {
      header: "No.",
      accessor: (product: Product, index: number) =>
        (currentPage - 1) * itemsPerPage + index + 1,
    },
    { header: "Name", accessor: "name" as keyof Product, sortable: true },
    {
      header: "Category",
      accessor: "category" as keyof Product,
      sortable: true,
    },
    { header: "Stock", accessor: "stock" as keyof Product, sortable: true },
    {
      header: "Price",
      accessor: (product: Product) => formatCurrency(product.price),
      sortable: true,
    },
    {
      header: "Description",
      accessor: (product: Product) => (
        <div className="max-w-xs truncate" title={product.description}>
          {product.description}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (product: Product) => (
        <div className="flex space-x-2">
          <Link href={`/products/edit/${product.id}`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteProduct(product.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/create">
          <Button>Add New Product</Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
        </div>
      ) : (
        <>
          <Table
            data={products}
            columns={columns}
            onSort={handleSort}
            currentSortColumn={sortBy}
            currentSortDirection={sortOrder}
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
