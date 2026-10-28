import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { formatPrice, wishlist, toggleWishlist, addToCart } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const handlePreOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant if exists
    const defaultVariants: Record<string, string> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        if (v.options.length > 0) {
          defaultVariants[v.name] = v.options[0];
        }
      });
    }
    addToCart(product, defaultVariants, 1);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.isNewArrival && (
          <span className="bg-[#0070DC] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
            New
          </span>
        )}
        {product.isTrending && (
          <span className="bg-[#C90016] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
            Hot
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600'
            : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white'
        }`}
        aria-label="Add to wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative block w-full pt-[95%] bg-slate-50 overflow-hidden">
        <img
          src={product.primaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute inset-x-3 bottom-3 py-1.5 bg-slate-900/85 hover:bg-slate-950 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1 truncate">
            {product.category}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-sm text-slate-800 hover:text-[#0070DC] transition line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-600">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-base font-extrabold text-[#0070DC]">
                {formatPrice(product.price)}
              </span>
              <p className="text-[10px] text-slate-600">Excl. intl shipping</p>
            </div>
            {product.sourcingTimeframe && (
              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                {product.sourcingTimeframe.split(' ')[0]}-{product.sourcingTimeframe.split(' ')[2]} days
              </span>
            )}
          </div>

          <button
            onClick={handlePreOrderClick}
            className="w-full py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Pre-Order
          </button>
        </div>
      </div>
    </div>
  );
};

