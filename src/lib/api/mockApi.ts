export interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  description: string;
}

export interface Invoice {
  id: number;
  orderNumber: string;
  customerName: string;
  date: string;
  items: Product[];
  totalAmount: number;
  customPrice?: number;
  status: "Pending" | "Paid" | "Cancelled";
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    stock: 10,
    price: 15000000,
    description: "High-performance laptop",
  },
  {
    id: 2,
    name: "Smartphone",
    category: "Electronics",
    stock: 20,
    price: 5000000,
    description: "Latest smartphone model",
  },
  {
    id: 3,
    name: "T-shirt",
    category: "Clothing",
    stock: 50,
    price: 150000,
    description: "Cotton t-shirt",
  },
  {
    id: 4,
    name: "Jeans",
    category: "Clothing",
    stock: 30,
    price: 300000,
    description: "Denim jeans",
  },
  {
    id: 5,
    name: "Headphones",
    category: "Electronics",
    stock: 15,
    price: 500000,
    description: "Wireless headphones",
  },
  {
    id: 6,
    name: "Watch",
    category: "Accessories",
    stock: 25,
    price: 1000000,
    description: "Luxury watch",
  },
  {
    id: 7,
    name: "Sneakers",
    category: "Footwear",
    stock: 40,
    price: 800000,
    description: "Sports sneakers",
  },
  {
    id: 8,
    name: "Backpack",
    category: "Accessories",
    stock: 35,
    price: 400000,
    description: "Travel backpack",
  },
  {
    id: 9,
    name: "Keyboard",
    category: "Electronics",
    stock: 20,
    price: 350000,
    description: "Mechanical keyboard",
  },
  {
    id: 10,
    name: "Mouse",
    category: "Electronics",
    stock: 25,
    price: 200000,
    description: "Wireless mouse",
  },
];

const mockInvoices: Invoice[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customerName: "John Doe",
    date: "2023-05-15",
    items: [mockProducts[0], mockProducts[4]],
    totalAmount: 15500000,
    customPrice: 15000000,
    status: "Paid",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customerName: "Jane Smith",
    date: "2023-05-16",
    items: [mockProducts[1], mockProducts[5]],
    totalAmount: 6000000,
    customPrice: 5800000,
    status: "Pending",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customerName: "Bob Johnson",
    date: "2023-05-17",
    items: [mockProducts[2], mockProducts[3], mockProducts[6]],
    totalAmount: 1250000,
    status: "Paid",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getProducts: async (
    page = 1,
    limit = 5,
    search = "",
    sortBy = "",
    sortOrder = "asc"
  ): Promise<{ products: Product[]; total: number }> => {
    await delay(500);

    let filteredProducts = [...mockProducts];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    if (sortBy) {
      filteredProducts.sort((a: any, b: any) => {
        if (sortOrder === "asc") {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
    }

    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(
      startIndex,
      startIndex + limit
    );

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
    };
  },

  getProductById: async (id: number): Promise<Product | null> => {
    await delay(300);
    const product = mockProducts.find((p) => p.id === id);
    return product || null;
  },

  createProduct: async (product: Omit<Product, "id">): Promise<Product> => {
    await delay(700);
    const newProduct = {
      ...product,
      id: Math.max(...mockProducts.map((p) => p.id)) + 1,
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (
    id: number,
    updates: Partial<Product>
  ): Promise<Product | null> => {
    await delay(500);
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    mockProducts[index] = { ...mockProducts[index], ...updates };
    return mockProducts[index];
  },

  deleteProduct: async (id: number): Promise<boolean> => {
    await delay(600);
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    mockProducts.splice(index, 1);
    return true;
  },

  getInvoices: async (
    page = 1,
    limit = 5
  ): Promise<{ invoices: Invoice[]; total: number }> => {
    await delay(500);

    const startIndex = (page - 1) * limit;
    const paginatedInvoices = mockInvoices.slice(
      startIndex,
      startIndex + limit
    );

    return {
      invoices: paginatedInvoices,
      total: mockInvoices.length,
    };
  },

  getInvoiceById: async (id: number): Promise<Invoice | null> => {
    await delay(300);
    const invoice = mockInvoices.find((i) => i.id === id);
    return invoice || null;
  },

  createInvoice: async (invoice: Omit<Invoice, "id">): Promise<Invoice> => {
    await delay(700);
    const newInvoice = {
      ...invoice,
      id: Math.max(...mockInvoices.map((i) => i.id)) + 1,
    };
    mockInvoices.push(newInvoice);
    return newInvoice;
  },

  updateInvoice: async (
    id: number,
    updates: Partial<Invoice>
  ): Promise<Invoice | null> => {
    await delay(500);
    const index = mockInvoices.findIndex((i) => i.id === id);
    if (index === -1) return null;

    mockInvoices[index] = { ...mockInvoices[index], ...updates };
    return mockInvoices[index];
  },
};
