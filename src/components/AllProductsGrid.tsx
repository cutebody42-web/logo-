import React, { useEffect, useRef } from 'react';
import { 
  ProductConfig, 
  ProductAngle, 
  LightingCondition, 
  BackgroundScene, 
  LogoSettings 
} from '../types/mockup';
import { PRODUCTS } from '../data/products';
import { renderMockupToCanvas } from '../utils/canvasRenderer';
import { downloadDataUrl } from '../utils/imageProcessing';
import { Download, ArrowRight } from 'lucide-react';

interface AllProductsGridProps {
  productColor: string;
  angle: ProductAngle;
  lighting: LightingCondition;
  scene: BackgroundScene;
  logoImg: HTMLImageElement | null;
  logoSettings: LogoSettings;
  onSelectProduct: (product: ProductConfig) => void;
}

export const AllProductsGrid: React.FC<AllProductsGridProps> = ({
  productColor,
  angle,
  lighting,
  scene,
  logoImg,
  logoSettings,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Complete Merch Lineup
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Preview your logo across all 8 products simultaneously. Click any product to fine-tune placement.
          </p>
        </div>
      </div>

      {/* Grid of All Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRODUCTS.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            productColor={productColor}
            angle={angle}
            lighting={lighting}
            scene={scene}
            logoImg={logoImg}
            logoSettings={logoSettings}
            onSelect={() => onSelectProduct(prod)}
          />
        ))}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: ProductConfig;
  productColor: string;
  angle: ProductAngle;
  lighting: LightingCondition;
  scene: BackgroundScene;
  logoImg: HTMLImageElement | null;
  logoSettings: LogoSettings;
  onSelect: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productColor,
  angle,
  lighting,
  scene,
  logoImg,
  logoSettings,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Fallback to supported angle if product doesn't support the current global angle
    const chosenAngle = product.availableAngles.includes(angle)
      ? angle
      : product.availableAngles[0];

    renderMockupToCanvas(canvasRef.current, {
      product,
      productColor,
      angle: chosenAngle,
      lighting,
      scene,
      logoImg,
      logoSettings,
      width: 600,
      height: 600,
    });
  }, [product, productColor, angle, lighting, scene, logoImg, logoSettings]);

  const handleDownloadSingle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    downloadDataUrl(dataUrl, `${product.id}-mockup.png`);
  };

  return (
    <div
      onClick={onSelect}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
    >
      {/* Canvas Mockup Preview */}
      <div className="relative aspect-square w-full bg-neutral-950 p-3 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-xl"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 bg-neutral-900/90 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5 border border-neutral-700">
            <span>Customize</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <button
            onClick={handleDownloadSingle}
            title="Download PNG"
            className="p-2 bg-neutral-900/90 text-neutral-300 hover:text-white rounded-lg shadow-lg border border-neutral-700 hover:bg-neutral-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-3.5 bg-neutral-900 border-t border-neutral-800/80 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-neutral-200 group-hover:text-amber-400 transition-colors">
            {product.name}
          </div>
          <div className="text-[11px] text-neutral-400">
            {product.category}
          </div>
        </div>
        <span className="text-[10px] text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded font-mono">
          {product.availableAngles.length} angles
        </span>
      </div>
    </div>
  );
};
