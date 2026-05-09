'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  function updateQuantity(productId: string, quantity: number) {
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  function removeItem(productId: string) {
    const updated = cart.filter((item) => item.productId !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  async function handleCheckout() {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: 'cash_on_delivery',
        shippingAddress: {
          street: 'Default Street',
          city: 'Cairo',
          country: 'Egypt',
        },
      }),
    });

    if (res.ok) {
      localStorage.removeItem('cart');
      setCart([]);
      router.push('/orders');
    }

    setLoading(false);
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-24">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-600" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some products to get started</p>
        <Link href="/products">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            Browse Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <span className="text-gray-400">({cart.length} items)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="glass-card rounded-2xl p-4 flex gap-4">
              <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🛍️</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-cyan-400 font-bold mt-1">${item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-white/10 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 hover:bg-white/10 transition-colors text-gray-400"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-white/10">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-white/10 transition-colors text-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-card rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-cyan-400">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
          <p className="text-xs text-gray-500 text-center">Cash on delivery</p>
        </div>
      </div>
    </div>
  );
}
