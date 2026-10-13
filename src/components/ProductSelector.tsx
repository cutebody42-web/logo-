import React, { useState } from 'react';
import { ProductConfig, ProductType } from '../types/mockup';
import { PRODUCTS } from '../data/products';
import { 
  Coffee, 
  Shirt, 
  ShoppingBag, 
  Smartphone, 
  Sparkles, 
  Smile, 
  Layers, 
  Flame 
} from 'lucide-react';

interface ProductSelectorProps {
  selectedProduct: ProductConfig;
  onSelectProduct: (product: ProductConfig) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProduct,
  onSelectProduct,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Drinkware', 'Apparel', 'Headwear', 'Accessories', 'Stationery'];

  const filteredProducts = filterCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === filterCategory);

  const getProductIcon = (id: ProductType) => {
    switch (id) {
      case 'mug':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'tshirt':
        return <Shirt className="w-4 h-4 text-blue-400" />;
      case 'hat':
        return <Smile className="w-4 h-4 text-emerald-400" />;
      case 'tote':
        return <ShoppingBag className="w-4 h-4 text-rose-400" />;
      case 'phonecase':
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'sticker':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'hoodie':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'tumbler':
        return <Flame className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {filteredProducts.map((product) => {
          const isSelected = selectedProduct.id === product.id;
          return (
            <button
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'border-amber-500/80 bg-neutral-900/90 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900/40 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/10' : 'bg-neutral-900'}`}>
                  {getProductIcon(product.id)}
                </div>
                <span className="text-[10px] text-neutral-400">
                  {product.category}
                </span>
              </div>

              <div>
                <div className="font-semibold text-xs text-neutral-200 group-hover:text-white transition-colors">
                  {product.name}
                </div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {product.colors.length} colors · {product.availableAngles.length} angles
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
