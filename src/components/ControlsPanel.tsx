import React, { useRef, useState } from 'react';
import { 
  ProductConfig, 
  LogoSettings, 
  SampleLogo, 
  BlendMode, 
  LogoColorTint 
} from '../types/mockup';
import { SAMPLE_LOGOS, svgToDataUrl } from '../data/sampleLogos';
import { fileToDataUrl, loadImage, removeImageBackground } from '../utils/imageProcessing';
import { 
  Upload, 
  Sliders, 
  Palette, 
  Sparkles, 
  Wand2, 
  RotateCcw, 
  Check, 
  Sun,
  Contrast,
  Image as ImageIcon
} from 'lucide-react';

interface ControlsPanelProps {
  product: ProductConfig;
  productColor: string;
  setProductColor: (color: string) => void;
  logoSettings: LogoSettings;
  setLogoSettings: React.Dispatch<React.SetStateAction<LogoSettings>>;
  rawLogoDataUrl: string;
  setRawLogoDataUrl: (dataUrl: string) => void;
  setLogoImg: (img: HTMLImageElement | null) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  product,
  productColor,
  setProductColor,
  logoSettings,
  setLogoSettings,
  rawLogoDataUrl,
  setRawLogoDataUrl,
  setLogoImg,
}) => {
  const [activeTab, setActiveTab] = useState<'transform' | 'color' | 'product_color' | 'logo_source'>('transform');
  const [isApplyingBgRemoval, setIsApplyingBgRemoval] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setRawLogoDataUrl(dataUrl);
      const img = await loadImage(dataUrl);
      setLogoImg(img);
    } catch (err) {
      console.error('Error reading uploaded logo:', err);
    }
  };

  // Sample Logo Select Handler
  const handleSelectSampleLogo = async (sample: SampleLogo) => {
    const dataUrl = svgToDataUrl(sample.svg);
    setRawLogoDataUrl(dataUrl);
    const img = await loadImage(dataUrl);
    setLogoImg(img);
  };

  // Magic Wand: Remove Background
  const handleApplyBgRemoval = async () => {
    if (!rawLogoDataUrl) return;
    setIsApplyingBgRemoval(true);
    try {
      const originalImg = await loadImage(rawLogoDataUrl);
      const cleanedDataUrl = removeImageBackground(
        originalImg,
        logoSettings.removeBgColor,
        logoSettings.removeBgTolerance
      );
      const cleanedImg = await loadImage(cleanedDataUrl);
      setLogoImg(cleanedImg);
    } catch (err) {
      console.error('Failed to remove logo background:', err);
    } finally {
      setIsApplyingBgRemoval(false);
    }
  };

  // Quick Scale Presets
  const scalePresets = [
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1.0 },
    { label: '150%', value: 1.5 },
  ];

  // Quick Alignment Presets
  const setAlignment = (x: number, y: number) => {
    setLogoSettings((prev) => ({ ...prev, x, y }));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-5">
      {/* Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-950/80 rounded-xl border border-neutral-800">
        <button
          onClick={() => setActiveTab('transform')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'transform'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Size &amp; Position</span>
        </button>

        <button
          onClick={() => setActiveTab('color')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'color'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-blue-400" />
          <span>Color &amp; Tint</span>
        </button>

        <button
          onClick={() => setActiveTab('product_color')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'product_color'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: productColor }} />
          <span>Product Color</span>
        </button>

        <button
          onClick={() => setActiveTab('logo_source')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'logo_source'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span>Upload / Logos</span>
        </button>
      </div>

      {/* Tab 1: Size & Repositioning */}
      {activeTab === 'transform' && (
        <div className="space-y-4">
          {/* Resize Scale */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-300 font-medium">Resize / Scale</span>
              <span className="text-amber-400 font-mono font-semibold">
                {Math.round(logoSettings.scale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.15"
              max="2.5"
              step="0.05"
              value={logoSettings.scale}
              onChange={(e) =>
                setLogoSettings((prev) => ({
                  ...prev,
                  scale: parseFloat(e.target.value),
                }))
              }
              className="w-full accent-amber-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
            />
            {/* Scale Presets */}
            <div className="flex items-center gap-1.5 mt-2">
              {scalePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    setLogoSettings((prev) => ({ ...prev, scale: preset.value }))
                  }
                  className={`flex-1 py-1 rounded text-[11px] font-medium border transition-colors ${
                    Math.abs(logoSettings.scale - preset.value) < 0.05
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reposition X & Y */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-400">Position X (Horizontal)</span>
                <span className="text-neutral-200 font-mono text-[11px]">
                  {logoSettings.x > 0 ? `+${logoSettings.x}` : logoSettings.x}px
                </span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                value={logoSettings.x}
                onChange={(e) =>
                  setLogoSettings((prev) => ({
                    ...prev,
                    x: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-amber-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-400">Position Y (Vertical)</span>
                <span className="text-neutral-200 font-mono text-[11px]">
                  {logoSettings.y > 0 ? `+${logoSettings.y}` : logoSettings.y}px
                </span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                value={logoSettings.y}
                onChange={(e) =>
                  setLogoSettings((prev) => ({
                    ...prev,
                    y: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-amber-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          {/* Quick Alignment Buttons */}
          <div>
            <div className="text-[11px] text-neutral-400 mb-1.5">Quick Placement:</div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setAlignment(0, 0)}
                className="py-1 px-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-md transition-colors"
              >
                Center
              </button>
              <button
                onClick={() => setAlignment(-35, -20)}
                className="py-1 px-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-md transition-colors"
              >
                Chest Left
              </button>
              <button
                onClick={() => setAlignment(0, -50)}
                className="py-1 px-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-md transition-colors"
              >
                Top Pocket
              </button>
              <button
                onClick={() => setAlignment(0, 50)}
                className="py-1 px-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-md transition-colors"
              >
                Bottom
              </button>
            </div>
          </div>

          {/* Rotation */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-300 font-medium">Rotation</span>
              <span className="text-neutral-400 font-mono text-[11px]">
                {logoSettings.rotation}°
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-180"
                max="180"
                value={logoSettings.rotation}
                onChange={(e) =>
                  setLogoSettings((prev) => ({
                    ...prev,
                    rotation: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-amber-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
              />
              {logoSettings.rotation !== 0 && (
                <button
                  onClick={() => setLogoSettings((p) => ({ ...p, rotation: 0 }))}
                  className="p-1 rounded bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 text-[10px]"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Color, Tint, Saturation & Blend Mode */}
      {activeTab === 'color' && (
        <div className="space-y-4">
          {/* Color Tint & Invert */}
          <div>
            <div className="text-xs text-neutral-300 font-medium mb-2">
              Logo Color Tint &amp; Invert
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'original', label: 'Original Colors' },
                { id: 'white', label: 'Monochrome White' },
                { id: 'black', label: 'Monochrome Black' },
                { id: 'gold', label: 'Gold Foil' },
                { id: 'silver', label: 'Silver Foil' },
                { id: 'custom', label: 'Custom Tint' },
              ].map((tint) => (
                <button
                  key={tint.id}
                  onClick={() =>
                    setLogoSettings((prev) => ({
                      ...prev,
                      colorTint: tint.id as LogoColorTint,
                    }))
                  }
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                    logoSettings.colorTint === tint.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300 shadow-xs'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {tint.id === 'white' && <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-400" />}
                    {tint.id === 'black' && <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700" />}
                    {tint.id === 'gold' && <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                    {tint.id === 'silver' && <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />}
                    {tint.id === 'custom' && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-neutral-400"
                        style={{ backgroundColor: logoSettings.customTintColor || '#3B82F6' }}
                      />
                    )}
                    <span className="truncate">{tint.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Tint Picker */}
            {logoSettings.colorTint === 'custom' && (
              <div className="mt-2.5 p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400">Custom Brand Tint:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logoSettings.customTintColor || '#3B82F6'}
                    onChange={(e) =>
                      setLogoSettings((prev) => ({
                        ...prev,
                        customTintColor: e.target.value,
                      }))
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-700 bg-transparent"
                  />
                  <span className="font-mono text-xs text-neutral-300 uppercase">
                    {logoSettings.customTintColor || '#3B82F6'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Color Saturation */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-300 font-medium">Color Saturation</span>
              <span className="text-blue-400 font-mono text-[11px]">
                {Math.round(logoSettings.saturation * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2.0"
              step="0.05"
              value={logoSettings.saturation}
              onChange={(e) =>
                setLogoSettings((prev) => ({
                  ...prev,
                  saturation: parseFloat(e.target.value),
                }))
              }
              className="w-full accent-blue-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>0% Grayscale</span>
              <span>100% Normal</span>
              <span>200% Vibrant</span>
            </div>
          </div>

          {/* Brightness & Contrast */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" />
                  Brightness
                </span>
                <span className="text-neutral-300 font-mono text-[11px]">
                  {Math.round(logoSettings.brightness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={logoSettings.brightness}
                onChange={(e) =>
                  setLogoSettings((prev) => ({
                    ...prev,
                    brightness: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-amber-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Contrast className="w-3 h-3 text-cyan-400" />
                  Contrast
                </span>
                <span className="text-neutral-300 font-mono text-[11px]">
                  {Math.round(logoSettings.contrast * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={logoSettings.contrast}
                onChange={(e) =>
                  setLogoSettings((prev) => ({
                    ...prev,
                    contrast: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-cyan-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          {/* Opacity & Blend Mode */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-300 font-medium">Logo Opacity</span>
                <span className="text-neutral-400 font-mono text-[11px]">
                  {Math.round(logoSettings.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={logoSettings.opacity}
                onChange={(e) =>
                  setLogoSettings((prev) => ({
                    ...prev,
                    opacity: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-amber-500 bg-neutral-950 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="text-xs text-neutral-300 font-medium mb-1.5">
                Surface Blend Mode
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'normal', label: 'Normal' },
                  { id: 'multiply', label: 'Multiply (Fabric)' },
                  { id: 'overlay', label: 'Overlay' },
                  { id: 'screen', label: 'Screen' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() =>
                      setLogoSettings((prev) => ({
                        ...prev,
                        blendMode: mode.id as BlendMode,
                      }))
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      logoSettings.blendMode === mode.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Tip: Use "Multiply" for natural ink absorption into cotton fabric and ceramic glaze.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Product Color Palette */}
      {activeTab === 'product_color' && (
        <div className="space-y-4">
          <div>
            <div className="text-xs text-neutral-300 font-medium mb-2">
              Preset Color Swatches for {product.name}
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {product.colors.map((color) => {
                const isActive = productColor.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    onClick={() => setProductColor(color.hex)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                      isActive
                        ? 'border-amber-500 bg-neutral-950 ring-2 ring-amber-500/30'
                        : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-neutral-700 shadow-md relative flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isActive && (
                        <Check
                          className={`w-4 h-4 ${
                            color.textColor === 'light' ? 'text-white' : 'text-neutral-950'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-300 truncate w-full">
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Color Picker */}
          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
            <div>
              <div className="text-xs font-semibold text-neutral-200">
                Custom Color Picker
              </div>
              <div className="text-[11px] text-neutral-400">
                Match exact hex Pantone or brand palette
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-neutral-700 bg-transparent"
              />
              <span className="font-mono text-xs text-neutral-300 uppercase">
                {productColor}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Upload Custom Logo & Sample Library */}
      {activeTab === 'logo_source' && (
        <div className="space-y-4">
          {/* File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-700 hover:border-amber-500/80 bg-neutral-950/80 hover:bg-neutral-950 p-5 rounded-xl cursor-pointer text-center transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-neutral-900 group-hover:bg-amber-500/10 text-neutral-400 group-hover:text-amber-400 flex items-center justify-center mx-auto mb-2 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-neutral-200 group-hover:text-white">
              Upload Custom Logo
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              PNG (transparent recommended), SVG, JPG, WebP
            </p>
          </div>

          {/* Background Removal Magic Wand */}
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span>Remove Logo Background</span>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                Magic Wand
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() =>
                  setLogoSettings((prev) => ({ ...prev, removeBgColor: 'white' }))
                }
                className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                  logoSettings.removeBgColor === 'white'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                    : 'border-neutral-800 text-neutral-400'
                }`}
              >
                White Background
              </button>
              <button
                onClick={() =>
                  setLogoSettings((prev) => ({ ...prev, removeBgColor: 'black' }))
                }
                className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                  logoSettings.removeBgColor === 'black'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                    : 'border-neutral-800 text-neutral-400'
                }`}
              >
                Black Background
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                <span>Color Tolerance Threshold:</span>
                <span className="font-mono text-purple-400">{logoSettings.removeBgTolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={logoSettings.removeBgTolerance}
                onChange={(e) =>
                  setLogoSettings((prev) => ({
                    ...prev,
                    removeBgTolerance: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-purple-500 bg-neutral-900 rounded-lg cursor-pointer h-2"
              />
            </div>

            <button
              onClick={handleApplyBgRemoval}
              disabled={isApplyingBgRemoval || !rawLogoDataUrl}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isApplyingBgRemoval ? 'Removing...' : 'Apply Background Removal'}</span>
            </button>
          </div>

          {/* Instant Sample Logos Library */}
          <div>
            <div className="text-xs text-neutral-300 font-medium mb-2 flex items-center justify-between">
              <span>Instant Sample Logos</span>
              <span className="text-[11px] text-neutral-400">Click to apply</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_LOGOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSampleLogo(sample)}
                  className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-600 hover:bg-neutral-900/60 transition-all text-center group flex flex-col items-center"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-1.5"
                    dangerouslySetInnerHTML={{ __html: sample.svg }}
                  />
                  <div className="text-xs font-medium text-neutral-200 group-hover:text-white truncate w-full">
                    {sample.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate w-full">
                    {sample.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
