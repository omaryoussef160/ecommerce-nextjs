'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, LogOut, Package, Store } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">ShopApp</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
              Products
            </Link>
            {session?.user && (session.user as any).role === 'seller' && (
              <Link href="/seller/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
            {session?.user && (session.user as any).role === 'admin' && (
              <Link href="/admin/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                <Link href="/cart">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </Link>
                <Link href="/orders">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Package className="h-5 w-5" />
                  </button>
                </Link>
                <Link href="/profile">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <User className="h-5 w-5" />
                  </button>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}