import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  ChevronDown, 
  Layers, 
  SlidersHorizontal, 
  RotateCcw,
  Search,
  Check
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../mockData';

export const ShopPage: React.FC = () => {
  const { products, formatPrice } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All Categories';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<number>(60000);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [onlyPreOrders, setOnlyPreOrders] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL search query changes
  React.useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search !== null) setSearchKeyword(search);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All Categories' && p.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (p.price > priceRange) {
        return false;
      }
      // Search keyword filter
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSku) return false;
      }
      // Pre-order filter
      if (onlyPreOrders && !p.isPreOrder) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default newest
    });
  }, [products, selectedCategory, searchKeyword, priceRange, sortBy, onlyPreOrders]);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setSearchParams(prev => {
      if (catName === 'All Categories') {
        prev.delete('category');
      } else {
        prev.set('category', catName);
      }
      return prev;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSearchKeyword('');
    setPriceRange(60000);
    setSortBy('newest');
    setOnlyPreOrders(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2">
          <span>Home</span> <span className="mx-1.5">/</span> 
          <span>Shop</span> <span className="mx-1.5">/</span> 
          <span className="font-semibold text-slate-800">{selectedCategory}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {selectedCategory === 'All Categories' ? 'Product Catalogue' : selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> verified sourcing products
            </p>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-xs"
            >
              <Filter className="w-4 h-4 text-[#0070DC]" /> Filters
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-xs">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none text-slate-800 font-bold cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Sidebar Filters + Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-5 rounded-2xl border border-slate-200 h-fit shadow-xs`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0070DC]" /> Filter Products
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#0070DC] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search in Shop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="E.g. air fryer, sneakers..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full text-xs px-3 py-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0070DC]"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Categories
            </label>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 text-xs">
              <button
                type="button"
                onClick={() => handleCategorySelect('All Categories')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  selectedCategory === 'All Categories'
                    ? 'bg-blue-50 text-[#0070DC] font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'All Categories' && <Check className="w-3.5 h-3.5 text-[#0070DC]" />}
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                    selectedCategory === cat.name
                      ? 'bg-blue-50 text-[#0070DC] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCategory === cat.name && <Check className="w-3.5 h-3.5 text-[#0070DC]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-[#0070DC]">{formatPrice(priceRange)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="60000"
              step="2500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#0070DC] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₦5,000</span>
              <span>₦60,000+</span>
            </div>
          </div>

          {/* Sourcing Model Notice */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
            <p className="font-bold text-[#0070DC] mb-1">1688 Verified Sourcing</p>
            All listed products are procured directly from certified factories. Delivery timeline typically ranges from 10 to 18 working days.
          </div>
        </aside>

        {/* Right Products Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price filter or choosing a different category. You can also request custom sourcing via our AI Assistant.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#0070DC] text-white text-xs font-bold rounded-lg hover:bg-[#005BB5] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

