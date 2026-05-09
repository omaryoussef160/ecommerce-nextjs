'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Star, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

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
        <div className="bg-white/5 rounded-2xl h-96 animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 h-8 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-600" />
        <p className="text-xl text-gray-400">Product not found</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link href="/products">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white/5 rounded-2xl h-96 flex items-center justify-center overflow-hidden border border-white/10">
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
        <div className="space-y-5">
          <span className="text-sm text-cyan-400 font-medium bg-cyan-500/10 px-3 py-1 rounded-full">
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
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">({product.ratings.count} reviews)</span>
          </div>

          <p className="text-gray-400 leading-relaxed">{product.description}</p>

          <div className="text-4xl font-bold text-cyan-400">${product.price}</div>

          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-400 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                Out of Stock
              </span>
            )}
          </div>

          <p className="text-sm text-gray-400">
            Sold by <span className="text-white font-medium">{product.seller?.name}</span>
          </p>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Quantity:</span>
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-5 py-2 border-x border-white/10 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-30 flex items-center justify-center gap-2 text-lg"
          >
            <ShoppingCart className="h-5 w-5" />
            {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
