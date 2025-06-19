"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockApi, Product } from "@/lib/api/mockApi";
import { formatCurrency, getTodayDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Notification from "@/components/ui/Notification";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    (Product & { quantity: number })[]
  >([]);
  const [formData, setFormData] = useState({
    customerName: "",
    date: getTodayDate(),
    customPrice: "",
    status: "Pending",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await mockApi.getProducts(1, 100);
        setProducts(response.products);
      } catch (error) {
        setNotification({
          message: "Failed to fetch products",
          type: "error",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal();
    if (total > 0 && !formData.customPrice) {
      setFormData((prev) => ({ ...prev, customPrice: total.toString() }));
    }
  }, [selectedProducts]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingIndex = selectedProducts.findIndex((p) => p.id === productId);

    if (existingIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex] = {
        ...updatedProducts[existingIndex],
        quantity: updatedProducts[existingIndex].quantity + 1,
      };
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return;

    const updatedProducts = selectedProducts.map((product) =>
      product.id === productId ? { ...product, quantity } : product
    );

    setSelectedProducts(updatedProducts);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();

      if (selectedDate > today) {
        newErrors.date = "Invoice date cannot be in the future";
      }
    }

    if (selectedProducts.length === 0) {
      newErrors.products = "At least one product must be selected";
    }

    if (!formData.customPrice) {
      newErrors.customPrice = "Custom price is required";
    } else if (
      isNaN(Number(formData.customPrice)) ||
      Number(formData.customPrice) < 0
    ) {
      newErrors.customPrice = "Custom price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const invoiceData = {
        orderNumber: `ORD-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        customerName: formData.customerName,
        date: formData.date,
        items: selectedProducts.map((p) => ({ ...p, quantity: undefined })),
        totalAmount: calculateTotal(),
        customPrice: Number(formData.customPrice),
        status: formData.status as "Pending" | "Paid" | "Cancelled",
      };

      await mockApi.createInvoice(invoiceData);

      setNotification({
        message: "Invoice created successfully",
        type: "success",
      });

      setTimeout(() => {
        router.push("/invoices");
      }, 800);
    } catch (error) {
      setNotification({
        message: "Failed to create invoice",
        type: "error",
      });
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Customer Name"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              error={errors.customerName}
              required
            />

            <Input
              label="Invoice Date"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
              max={getTodayDate()}
            />

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Add Products
              </label>
              <div className="flex">
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={(e) => handleAddProduct(Number(e.target.value))}
                  value=""
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="px-4 py-2 bg-foreground text-background rounded-r-md hover:bg-[#00a5c9]"
                  onClick={() => {
                    const select = document.querySelector(
                      "select"
                    ) as HTMLSelectElement;
                    if (select.value) {
                      handleAddProduct(Number(select.value));
                      select.value = "";
                    }
                  }}
                >
                  Add
                </button>
              </div>
              {errors.products && (
                <p className="mt-1 text-sm text-red-500">{errors.products}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Selected Products
              </label>
              <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                {selectedProducts.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Subtotal
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-2 text-sm">{product.name}</td>
                          <td className="px-4 py-2 text-sm">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-l"
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    product.quantity - 1
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="px-3 py-1 bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600">
                                {product.quantity}
                              </span>
                              <button
                                type="button"
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-r"
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    product.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {formatCurrency(product.price * product.quantity)}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No products selected
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold">
                {formatCurrency(calculateTotal())}
              </span>
            </div>

            <Input
              label="Custom Price (IDR)"
              id="customPrice"
              name="customPrice"
              type="number"
              value={formData.customPrice}
              onChange={handleChange}
              error={errors.customPrice}
              required
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" isLoading={isSubmitting}>
            Create Invoice
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/invoices")}
          >
            Cancel
          </Button>
        </div>
      </form>

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
