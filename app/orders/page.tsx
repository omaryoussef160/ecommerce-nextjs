'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

interface Order {
  _id: string;
  items: { product: { name: string; images: string[] }; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  processing: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  shipped: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  delivered: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    }
    if (session) fetchOrders();
  }, [session]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-600" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-400 mb-8">Start shopping to see your orders here</p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {orders.map((order) => {
        const config = statusConfig[order.status] || statusConfig.pending;
        const Icon = config.icon;

        return (
          <div key={order._id} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>
              <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                <Icon className="h-4 w-4" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="text-cyan-400">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-xl font-bold text-cyan-400">${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
