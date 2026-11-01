import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Check, 
  Minus, 
  Plus, 
  AlertCircle,
  Package,
  Layers,
  ChevronRight,
  Info,
  MessageCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { setPageMeta } from '../components/RouteSeo';
import { buildProductWhatsAppMessage, WHATSAPP_URL } from '../lib/whatsappMessages';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, formatPrice, addToCart, wishlist, toggleWishlist } = useApp();

  const product = products.find((p) => p.id === id);

  // Product title and description for the browser tab, bookmarks and search results
  useEffect(() => {
    if (product) setPageMeta(product.name, `${product.name}. Pre-order it from Helen’s Varieties and we source it, inspect it and deliver it to Nigeria. Price: ₦${product.price.toLocaleString()} (excludes international shipping and customs).`);
  }, [product?.id]);

  // States for variants & quantity
  const [selectedImage, setSelectedImage] = useState<string>(product?.primaryImage || '');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product && product.variants) {
      product.variants.forEach((v) => {
        if (v.options.length > 0) initial[v.name] = v.options[0];
      });
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'reviews'>('description');
  const [addedToast, setAddedToast] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The product you are looking for is either archived or unavailable.</p>
        <Link to="/shop" className="inline-block mt-4 px-6 py-2.5 bg-[#0070DC] text-white text-xs font-bold rounded-lg">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  };

  const handlePreOrder = () => {
    addToCart(product, selectedVariants, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariants, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-slate-800">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-800">
          {product.category}
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout matching reference mockup detail page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Left Thumbnails & Main Image Gallery */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] no-scrollbar">
            {(product.images || [product.primaryImage]).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-slate-50 transition ${
                  (selectedImage || product.primaryImage) === img
                    ? 'border-[#0070DC] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img src={img} alt={`${product.name} preview ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Primary Main Display */}
          <div className="flex-1 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 relative aspect-square flex items-center justify-center cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
            <img
              src={selectedImage || product.primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[9px] font-bold px-2 py-1 rounded">Click to zoom</span>
            <span className="absolute top-4 left-4 bg-[#0070DC] text-white text-[10px] font-extrabold px-2.5 py-1 rounded shadow uppercase tracking-wide">
              Verified 1688 Sourcing
            </span>
          </div>
        </div>

        {/* Right Product Details & Action Sidebar */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="uppercase font-bold tracking-wider text-[#0070DC]">{product.category}</span>
              <span className="font-mono text-slate-500">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & reviews count */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-500">({product.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-baseline justify-between">
            <div>
              <span className="font-heading text-4xl font-bold text-[#0070DC]">
                {formatPrice(product.price)}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-order procurement unit price (excl. intl shipping & customs)
              </p>
            </div>
            {product.supplierPriceRMB && (
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                  ¥{product.supplierPriceRMB} RMB source
                </span>
              </div>
            )}
          </div>

          {/* Key Specifications bullet points */}
          <div className="space-y-1.5 text-xs text-slate-600">
            {Object.entries(product.specifications || {}).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong className="text-slate-800">{key}:</strong> {value}</span>
              </div>
            ))}
          </div>

          {/* Variant Selectors */}
          {product.variants && product.variants.map((v) => (
            <div key={v.name} className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                {v.name}: <span className="font-normal text-slate-600">{selectedVariants[v.name]}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {v.options.map((option) => {
                  const isSelected = selectedVariants[v.name] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleVariantSelect(v.name, option)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        isSelected
                          ? 'border-[#0070DC] bg-[#0070DC] text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Quantity:
            </label>
            <div className="flex items-center border border-slate-200 rounded-lg w-fit overflow-hidden bg-slate-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-xs font-bold text-slate-800 bg-white py-2">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pre-Order Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handlePreOrder}
              className="w-full py-3.5 bg-[#0070DC] hover:bg-[#005BB5] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" /> Pre-Order Now ({formatPrice(product.price * quantity)})
            </button>

            <a
              href={
                (() => {
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                  const text = buildProductWhatsAppMessage({ product, selectedVariants, quantity, baseUrl });
                  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
                })()
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" /> Order on WhatsApp
            </a>
            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-[#191919] hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Direct Checkout
            </button>

            {addedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
                <span>Item successfully added to your Pre-Order Cart!</span>
                <Link to="/cart" className="font-bold underline text-emerald-900">
                  View Cart
                </Link>
              </div>
            )}
          </div>

          {/* Wishlist & Share action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex items-center gap-1.5 font-semibold transition ${
                isWishlisted ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <div className="flex items-center gap-2 text-slate-500">
              <span>Share:</span>
              <span className="hover:text-blue-600 cursor-pointer">FB</span>
              <span>•</span>
              <span className="hover:text-sky-500 cursor-pointer">TW</span>
              <span>•</span>
              <span className="hover:text-emerald-500 cursor-pointer">WA</span>
            </div>
          </div>

          {/* Mandatory Shipping Disclaimer Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-900 leading-normal">
              <strong>Transparent Sourcing Notice:</strong> Product price excludes international cargo freight and clearing charges unless stated. Final shipping fees will be weighed and communicated when your parcel reaches Lagos consolidation.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Shipping Info, Genuine Reviews */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto no-scrollbar text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3.5 transition border-b-2 relative ${
              activeTab === 'description'
                ? 'border-[#0070DC] text-[#0070DC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3.5 transition border-b-2 relative ${
              activeTab === 'specifications'
                ? 'border-[#0070DC] text-[#0070DC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3.5 transition border-b-2 relative ${
              activeTab === 'shipping'
                ? 'border-[#0070DC] text-[#0070DC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Shipping Info
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 transition border-b-2 relative ${
              activeTab === 'reviews'
                ? 'border-[#0070DC] text-[#0070DC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reviews ({product.reviewsCount})
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'description' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              <h4 className="font-bold text-slate-900 mt-4">Why Pre-Order this Item with Helen’s Varieties?</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Factory-direct procurement bypasses standard retail reseller markups.</li>
                <li>Physical quality inspection conducted in Guangzhou prior to packing.</li>
                <li>Comprehensive tracking number provided for cargo freight progress.</li>
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="py-2.5 px-4 font-bold text-slate-700 border-b border-slate-100 w-1/3">{key}</td>
                      <td className="py-2.5 px-4 text-slate-600 border-b border-slate-100">{val}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-700 border-b border-slate-100">Estimated Sourcing Time</td>
                    <td className="py-2.5 px-4 text-slate-600 border-b border-slate-100">{product.sourcingTimeframe}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Cargo & Freight Timelines:</h4>
                <p>• <strong>Air Cargo Freight:</strong> 10 - 15 working days following factory dispatch.</p>
                <p>• <strong>Sea Cargo Freight:</strong> 35 - 45 days (recommended for bulky machinery and large furniture).</p>
                <p>• <strong>Local Nigeria Delivery:</strong> Doorstep dispatch via GIG Logistics or pickup at our Lagos warehouse.</p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-800">Chinedu O.</span>
                  <span className="text-[11px] text-slate-500">Verified Pre-Order</span>
                </div>
                <div className="flex items-center text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600">
                  Item came exactly as pictured on 1688. The sourcing team checked it before flying it down. Very transparent process.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {lightboxOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button type="button" onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition" aria-label="Close zoom">
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedImage || product.primaryImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

