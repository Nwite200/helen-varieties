import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Globe2, 
  ShieldCheck, 
  CreditCard, 
  Headphones,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Plane,
  Clock,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../mockData';

export const HomePage: React.FC = () => {
  const { products } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero banners matching reference visual identity
  const banners = [
    {
      badge: "Welcome To Helen’s Varieties",
      title: "Quality Products from Around the World",
      subtitle: "Discover amazing products from 1688, China and other global suppliers. Place your pre-order and get them delivered to your doorstep.",
      button1: { text: "Shop Products", link: "/shop" },
      button2: { text: "How Pre-Order Works", link: "/pre-order" },
      tag: "Pre-Order Now • Get the Best Deals!",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80"
    },
    {
      badge: "Direct Factory Procurement",
      title: "Wholesale 1688 Pricing Without The Hassle",
      subtitle: "We handle supplier negotiation, quality inspection at Guangzhou consolidation warehouses, international customs, and local dispatch.",
      button1: { text: "Explore Pre-Orders", link: "/shop" },
      button2: { text: "Track An Order", link: "/track" },
      tag: "Verified 1688 Gold Suppliers",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=80"
    },
    {
      badge: "Transparent Sourcing System",
      title: "Electronics, Fashion & Household Essentials",
      subtitle: "Over 5,000+ sourced items delivered across Nigeria with real-time status updates from procurement to doorstep delivery.",
      button1: { text: "Start Sourcing", link: "/shop" },
      button2: { text: "View Guarantees", link: "/about" },
      tag: "Safe & Insured Air Freight",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&auto=format&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const moreProducts = products.filter(p => !p.isTrending && !p.isFeatured).slice(0, 8);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SLIDER SECTION */}
      <section className="relative bg-[#0070DC] text-white overflow-hidden shadow-lg">
        {/* Decorative background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-[#0070DC]/90 to-blue-800/80 z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase text-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{banners[currentSlide].badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {banners[currentSlide].title}
              </h1>

              <p className="text-sm sm:text-base text-blue-100/90 max-w-xl leading-relaxed">
                {banners[currentSlide].subtitle}
              </p>

              {/* 4 Feature bullets under hero as in mockup */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/95">
                  <Globe2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Global Sourcing (1688 & more)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/95">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span>Trusted Process</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/95">
                  <CreditCard className="w-4 h-4 text-blue-200 flex-shrink-0" />
                  <span>Pay After Confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/95">
                  <Headphones className="w-4 h-4 text-rose-300 flex-shrink-0" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  to={banners[currentSlide].button1.link}
                  className="px-6 py-3 bg-white text-[#0070DC] hover:bg-blue-50 font-extrabold text-sm rounded-xl shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  {banners[currentSlide].button1.text}
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to={banners[currentSlide].button2.link}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold text-sm rounded-xl border border-white/30 transition-all flex items-center gap-2"
                >
                  {banners[currentSlide].button2.text}
                </Link>
              </div>
            </div>

            {/* Right Graphic/Banner Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src={banners[currentSlide].image}
                  alt="Helen’s Varieties International Cargo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-5">
                  <div className="bg-[#0070DC] text-white text-xs font-extrabold px-3 py-1 rounded-md self-start mb-1.5 shadow">
                    {banners[currentSlide].tag}
                  </div>
                  <p className="text-xs text-slate-200">
                    Inspected in Guangzhou & safely air-freighted directly to Lagos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. FOUR CORE TRUST PILLARS (Matching Mockup Middle Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0070DC] flex items-center justify-center flex-shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Wide Range of Products</h4>
              <p className="text-xs text-slate-500 mt-1">Electronics, fashion, home, beauty and more from verified suppliers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0070DC] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Easy Pre-Order Process</h4>
              <p className="text-xs text-slate-500 mt-1">Choose, submit pre-order payment, and we handle the sourcing & clearance.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0070DC] flex items-center justify-center flex-shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Global Sourcing (1688 & More)</h4>
              <p className="text-xs text-slate-500 mt-1">Direct access to wholesale manufacturers at competitive exchange rates.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0070DC] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Customer Support Always Here</h4>
              <p className="text-xs text-slate-500 mt-1">We're here to help every step of the way via chat and phone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Shop by Category</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore our wide range of products from trusted suppliers around the world.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#0070DC] hover:underline flex items-center gap-1"
          >
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.slice(0, 8).map((cat) => {
            const previewImages: Record<string, string> = {
              'electronics-gadgets': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
              'phones-accessories': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80',
              'fashion-accessories': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop&q=80',
              'home-kitchen': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&auto=format&fit=crop&q=80',
              'beauty-personal-care': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
              'baby-kids': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&auto=format&fit=crop&q=80',
              'sports-outdoors': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
              'automotive-accessories': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&auto=format&fit=crop&q=80',
            };

            return (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-xl border border-slate-200 p-3 flex flex-col items-center text-center hover:border-[#0070DC] hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-100 mb-2.5 relative flex items-center justify-center">
                  <img
                    src={previewImages[cat.id] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300&auto=format&fit=crop&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#0070DC] transition line-clamp-2 leading-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Featured Products</h2>
              <span className="bg-red-100 text-[#C90016] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Trending Sourcing
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Top picks for you. Quality products at great value. (Shipping not included)
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#0070DC] hover:underline flex items-center gap-1"
          >
            View All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. BLUE CTA MIDDLE BANNER (Matches mockup bottom promo banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#0070DC] text-white overflow-hidden shadow-lg p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 text-white">
              <Plane className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                We source, you pre-order, we deliver.
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                Direct wholesale quality products from 1688, China & global suppliers straight to Nigeria.
              </p>
            </div>
          </div>

          <div className="z-10 flex-shrink-0">
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-[#0070DC] hover:bg-blue-50 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Background graphical elements */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-900/40 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* 6. TRANSPARENT SOURCING & SHIPPING EXPLANATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl mb-8">
            <span className="text-[#0070DC] text-xs font-bold uppercase tracking-wider">
              Transparency Guarantee
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              How International Pre-Ordering Works at Helen’s Varieties
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Unlike regular retail stores carrying dead stock, Helen’s Varieties leverages an agile pre-order model. 
              We purchase goods directly on your behalf at manufacturing costs, eliminating inflated retail markups.
            </p>
          </div>

          {/* Step-by-step pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-extrabold text-[#0070DC]/20 absolute top-3 right-4">01</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0070DC] flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-800">Select & Place Pre-Order</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Choose your desired item variants. Pay the product pre-order cost securely to confirm your procurement ticket.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-extrabold text-[#0070DC]/20 absolute top-3 right-4">02</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0070DC] flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-800">Guangzhou Inspection</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Our China sourcing office purchases from verified 1688 factories, checks physical specs, and confirms packaging.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-extrabold text-[#0070DC]/20 absolute top-3 right-4">03</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0070DC] flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-800">Cargo Flight / Sea Transit</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Orders are consolidated into secured air cargo (10-15 working days). Live milestones reflect in your customer portal.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-extrabold text-[#0070DC]/20 absolute top-3 right-4">04</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0070DC] flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-800">Lagos Landing & Dispatch</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Upon arrival and customs clearance, actual parcel weight is measured, waybill settled, and delivered to your doorstep.
              </p>
            </div>
          </div>

          {/* Clear Callout Regarding Shipping */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Shipping Transparency Policy: </span>
              In strict accordance with Helen’s Varieties policy, product prices displayed online cover only the manufacturing procurement price. 
              International shipping and clearing fees vary by actual cargo weight (measured in KG) and will be billed separately when cargo lands at our Lagos warehouse.
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Trending Now</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              High-demand gadgets, accessories and apparel trending this week.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#0070DC] hover:underline flex items-center gap-1"
          >
            Explore More <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. MORE PRODUCTS FROM OTHER CATEGORIES */}
      {moreProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">More to Discover</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Explore products across other categories on Helen's Varieties.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-bold text-[#0070DC] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {moreProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

