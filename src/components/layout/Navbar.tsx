"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-foreground text-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Simple E-commerce
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/products"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/products")
                    ? "border-white text-white"
                    : "border-transparent text-gray-300 hover:text-white hover:border-gray-300"
                }`}
              >
                Products
              </Link>
              <Link
                href="/invoices"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/invoices")
                    ? "border-white text-white"
                    : "border-transparent text-gray-300 hover:text-white hover:border-gray-300"
                }`}
              >
                Invoices
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/products"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/products")
                ? "bg-gray-700 border-white text-white"
                : "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white"
            }`}
          >
            Products
          </Link>
          <Link
            href="/invoices"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/invoices")
                ? "bg-gray-700 border-white text-white"
                : "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white"
            }`}
          >
            Invoices
          </Link>
        </div>
      </div>
    </nav>
  );
}
