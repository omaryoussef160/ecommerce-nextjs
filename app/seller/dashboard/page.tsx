'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Plus, TrendingUp, ShoppingBag } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
}

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any).role !== 'seller') {
      router.push('/');
    }
  }, [session, status]);

  useEffect(() => {
    async function fetchMyProducts() {
      const res = await fetch('/api/seller/products');
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    }
    if (session) fetchMyProducts();
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/5 rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {session?.user?.name}</p>
        </div>
        <Link href="/seller/products/add">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-sm">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Package className="h-6 w-6 text-cyan-400" />,
            label: 'Total Products',
            value: products.length,
            bg: 'bg-cyan-500/10',
          },
          {
            icon: <ShoppingBag className="h-6 w-6 text-green-400" />,
            label: 'Active Products',
            value: products.filter((p) => p.isActive).length,
            bg: 'bg-green-500/10',
          },
          {
            icon: <TrendingUp className="h-6 w-6 text-purple-400" />,
            label: 'Out of Stock',
            value: products.filter((p) => p.stock === 0).length,
            bg: 'bg-purple-500/10',
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-6">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">My Products</h2>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No products yet</p>
            <Link href="/seller/products/add">
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                Add your first product
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Product</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Category</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Price</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Stock</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-gray-400 text-sm">{product.category}</td>
                    <td className="p-4 text-cyan-400 font-medium">${product.price}</td>
                    <td className="p-4">
                      <span className={product.stock === 0 ? 'text-red-400' : 'text-green-400'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
