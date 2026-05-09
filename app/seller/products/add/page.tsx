'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: ''
  });

  // دالة موحدة للتعامل مع تغيير المدخلات وتجنب خطأ TypeScript e: any
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          images: formData.images.split(',').map(url => url.trim()).filter(url => url !== '')
        }),
      });

      if (res.ok) {
        alert('Product listed successfully!');
        router.push('/seller/dashboard');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to add product'}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/seller/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <Card className="shadow-lg border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <UploadCloud className="text-blue-500" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Product Title</label>
              <Input 
                id="name"
                placeholder="e.g. Wireless Bluetooth Headphones" 
                value={formData.name}
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description"
                placeholder="Describe your product features, materials, etc." 
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                <Input 
                  id="price"
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={formData.price}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">Stock Inventory</label>
                <Input 
                  id="stock"
                  type="number" 
                  placeholder="Quantity available" 
                  value={formData.stock}
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Input 
                id="category"
                placeholder="e.g. Electronics, Home, Fashion" 
                value={formData.category}
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <label htmlFor="images" className="text-sm font-medium">Image URLs</label>
              <Input 
                id="images"
                placeholder="Paste URLs separated by commas (URL1, URL2...)" 
                value={formData.images}
                onChange={handleChange} 
              />
              <p className="text-[12px] text-muted-foreground italic">
                Tip: You can use online image hosting for your product photos.
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-colors" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Product'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}