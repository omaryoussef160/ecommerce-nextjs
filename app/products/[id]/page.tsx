'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  ratings: { average: number; count: number };
  seller: { name: string; email: string };
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data.product);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  function addToCart() {
    if (!session) {
      router.push('/login');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product?._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product?._id,
        name: product?.name,
        price: product?.price,
        image: product?.images[0] || '',
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-xl h-96 animate-pulse" />
        <div className="space-y-4">
          <div className="bg-gray-100 h-8 rounded animate-pulse" />
          <div className="bg-gray-100 h-4 rounded animate-pulse" />
          <div className="bg-gray-100 h-4 rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">Product not found</p>
        <Button className="mt-4" onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image */}
      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-8xl">🛍️</span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4">
        <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.ratings.average)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.ratings.count} reviews)</span>
        </div>

        <p className="text-gray-600">{product.description}</p>

        <div className="text-3xl font-bold text-blue-600">${product.price}</div>

        <p className="text-sm text-gray-500">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
          ) : (
            <span className="text-red-500 font-medium">✗ Out of Stock</span>
          )}
        </p>

        <p className="text-sm text-gray-500">
          Sold by: <span className="font-medium">{product.seller?.name}</span>
        </p>

        {/* Quantity */}
        {product.stock > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={addToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
