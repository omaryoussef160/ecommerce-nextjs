'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    else if (session && (session.user as any).role !== 'admin') router.push('/');
  }, [session, status]);

  useEffect(() => {
    async function fetchData() {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
      ]);
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      setStats(statsData);
      setUsers(usersData.users || []);
      setLoading(false);
    }
    if (session && (session.user as any).role === 'admin') fetchData();
  }, [session]);

  async function toggleUser(userId: string, isActive: boolean) {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setUsers(users.map((u) => u._id === userId ? { ...u, isActive: !isActive } : u));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/5 rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage your platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <Users className="h-6 w-6 text-cyan-400" />, label: 'Total Users', value: stats?.totalUsers || 0, bg: 'bg-cyan-500/10' },
          { icon: <Package className="h-6 w-6 text-green-400" />, label: 'Total Products', value: stats?.totalProducts || 0, bg: 'bg-green-500/10' },
          { icon: <ShoppingBag className="h-6 w-6 text-purple-400" />, label: 'Total Orders', value: stats?.totalOrders || 0, bg: 'bg-purple-500/10' },
          { icon: <TrendingUp className="h-6 w-6 text-yellow-400" />, label: 'Revenue', value: `$${stats?.totalRevenue || 0}`, bg: 'bg-yellow-500/10' },
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

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Users Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Name</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Role</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-400 text-sm">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                      user.role === 'seller' ? 'bg-cyan-500/10 text-cyan-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleUser(user._id, user.isActive)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        user.isActive
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
