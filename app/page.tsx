import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center py-24 relative">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            New arrivals every week
          </div>

          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Shop the Future,{' '}
            <span className="gradient-text">Today</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Discover premium products from verified sellers. Fast delivery, secure payments, and an unmatched shopping experience.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-sm">
                Browse Products
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-3 border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/5 transition-colors text-sm">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { number: '10K+', label: 'Products' },
          { number: '5K+', label: 'Happy Customers' },
          { number: '500+', label: 'Verified Sellers' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
            <div className="text-gray-400">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          Why <span className="gradient-text">ShopApp</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⚡',
              title: 'Fast Delivery',
              description: 'Get your orders delivered quickly and safely to your doorstep.',
            },
            {
              icon: '🔐',
              title: 'Secure Payments',
              description: 'Multiple payment options with top-notch encryption.',
            },
            {
              icon: '⭐',
              title: 'Quality Products',
              description: 'All products verified and reviewed by real customers.',
            },
          ].map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="glass-card glow rounded-2xl p-16 text-center border-purple-500/20">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start <span className="gradient-text">Selling</span>?
        </h2>
        <p className="text-gray-400 mb-8">
          Join thousands of sellers and reach millions of customers.
        </p>
        <Link href="/register">
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            Become a Seller
          </button>
        </Link>
      </section>
    </div>
  );
}
