'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: string;
  address?: { street: string; city: string; country: string };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status]);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data.user);
      setLoading(false);
    }
    if (session) fetchProfile();
  }, [session]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: {
          street: formData.get('street'),
          city: formData.get('city'),
          country: formData.get('country'),
        },
      }),
    });

    if (res.ok) setSuccess(true);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-8 bg-white/5 rounded animate-pulse w-48" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{profile?.name}</h1>
          <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-medium capitalize">
            {profile?.role}
          </span>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm">
              ✓ Profile updated successfully!
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <User className="h-4 w-4" /> Full Name
            </label>
            <input
              name="name"
              defaultValue={profile?.name}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </label>
            <input
              value={profile?.email}
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Phone className="h-4 w-4" /> Phone
            </label>
            <input
              name="phone"
              defaultValue={profile?.phone}
              placeholder="+20 1234567890"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Address
            </label>
            <input
              name="street"
              defaultValue={profile?.address?.street}
              placeholder="Street address"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                defaultValue={profile?.address?.city}
                placeholder="City"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <input
                name="country"
                defaultValue={profile?.address?.country}
                placeholder="Country"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
