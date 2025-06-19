# Simple E-Commerce Dashboard

A modern e-commerce dashboard built with Next.js 14, TypeScript, and Tailwind CSS. This application provides a complete interface for managing products, orders, and invoices with a clean, responsive design.

## 🚀 Features

- **Product Management**: Create, read, update, and delete products
- **Invoice Management**: Generate and track invoices with status updates
- **Search & Filtering**: Advanced search and sorting capabilities
- **Pagination**: Efficient data pagination for large datasets
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom reusable components
- **Icons**: Lucide React / Heroicons
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router
- **Data**: Mock API with local storage simulation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/simple-ecommerce-dashboard.git
   cd simple-ecommerce-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                                # Next.js App Router pages
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout component
│   ├── page.tsx                        # Home page
│   ├── invoices/                       # Invoice management
│   │   ├── page.tsx                    # Invoices list page
│   │   ├── create/                     # Create invoice page
│   │   └── [id]/                       # Invoice detail page
│   └── products/                       # Product management
│       ├── page.tsx                    # Products list page
│       ├── create/                     # Create product page
│       └── edit/[id]/                  # Edit product page
├── components/                         # Reusable UI components
│   ├── layout/                         # Layout components
│   │   ├── Navbar.tsx                  # Application header Navbar
|   └── providers/                      # Providers components
│       ├── NotificationProvider.tsx    # Toast notifications
│   └── ui/                             # UI components
│       ├── Button.tsx                  # Button component
│       ├── Input.tsx                   # Input field component
│       ├── Table.tsx                   # Data table component
│       ├── Pagination.tsx              # Pagination component
│       ├── Notification.tsx            # Toast notifications
│       └── Modal.tsx                   # Modal dialog component
│       └── TextArea.tsx                # Text Area field component
└── lib/                                # Utility functions and APIs
    ├── api/                            # API layer
    │   └── mockApi.ts                  # Mock API implementation
    └── utils.ts                        # Utility functions
```

## 🎨 UI Components

### Core Components

- **Button**: Customizable button with multiple variants (primary, secondary, danger)
- **Input**: Form input fields with validation support
- **TextArea**: Text Area input fields with validation support
- **Table**: Advanced data table with sorting, pagination, and row click events
- **Pagination**: Navigation component for paginated data
- **Notification**: Toast notification system
- **Modal**: Reusable modal dialog component

### Layout Components

- **Navbar**: Application header with navigation and user menu

## 📊 Data Management

The application uses a mock API system that simulates real backend operations:

- **Products**: CRUD operations for product management
- **Invoices**: Invoice generation and status updates

## 🎯 Key Features Explained

### Product Management

- Add new products with name, category, price, stock, and description
- Edit existing products with form validation
- Delete products with confirmation dialog
- Search products by name or category
- Sort products by various fields

### Invoice Management

- Generate invoices from orders
- Track invoice status (Pending, Paid, Cancelled)
- View detailed invoice information
- Update invoice status
- Custom pricing support

### Table Component Features

- **Sortable columns**: Click headers to sort data
- **Row click events**: Navigate to detail pages
- **Custom cell rendering**: Support for complex cell content
- **Empty state handling**: Graceful handling of no data

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🎨 Styling

The project uses Tailwind CSS for styling with:

- **Custom Components**: Consistent design system
- **Utility Classes**: Rapid development with utility-first CSS

### Color Scheme

- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for secondary actions
- **Success**: Green for positive actions
- **Warning**: Yellow for warnings
- **Danger**: Red for destructive actions

## 🔧 Customization

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add `page.tsx` for the main page
3. Update navigation in `Navbar.tsx`

### Creating New Components

1. Add component file in `src/components/ui/`
2. Follow existing component patterns
3. Export from component index if needed

### Extending the API

1. Update `mockApi.ts` with new endpoints
2. Add corresponding TypeScript types
3. Update components to use new API methods

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

---

**Happy Coding!** 🎉
