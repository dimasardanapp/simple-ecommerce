"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { mockApi } from "@/lib/api/mockApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Notification from "@/components/ui/Notification";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await mockApi.getProductById(productId);

        if (product) {
          setFormData({
            name: product.name,
            category: product.category,
            stock: product.stock.toString(),
            price: product.price.toString(),
            description: product.description,
          });
        } else {
          setNotification({
            message: "Product not found",
            type: "error",
          });
          setTimeout(() => router.push("/products"), 2000);
        }
      } catch (error) {
        setNotification({
          message: "Failed to fetch product",
          type: "error",
        });
        console.error(error);
        setTimeout(() => router.push("/products"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.stock) {
      newErrors.stock = "Stock is required";
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a positive number";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
      const updatedProduct = await mockApi.updateProduct(productId, {
        name: formData.name,
        category: formData.category,
        stock: Number(formData.stock),
        price: Number(formData.price),
        description: formData.description,
      });

      if (updatedProduct) {
        setNotification({
          message: "Product updated successfully",
          type: "success",
        });

        setTimeout(() => {
          router.push("/products");
        }, 800);
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      setNotification({
        message: "Failed to update product",
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
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Input
          label="Product Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Category"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          required
        />

        <Input
          label="Stock"
          id="stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
          required
        />

        <Input
          label="Price (IDR)"
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          required
        />

        <TextArea
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          rows={4}
          required
        />

        <div className="flex space-x-4 mt-6">
          <Button type="submit" isLoading={isSubmitting}>
            Update Product
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/products")}
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
