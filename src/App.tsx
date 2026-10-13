/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ProductConfig, 
  ProductAngle, 
  LightingCondition, 
  BackgroundScene, 
  LogoSettings, 
  SavedMockup 
} from './types/mockup';
import { PRODUCTS } from './data/products';
import { SAMPLE_LOGOS, svgToDataUrl } from './data/sampleLogos';
import { loadImage } from './utils/imageProcessing';
import { renderMockupToCanvas } from './utils/canvasRenderer';
import { Header, ActiveTab } from './components/Header';
import { ProductSelector } from './components/ProductSelector';
import { MockupCanvas } from './components/MockupCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { AllProductsGrid } from './components/AllProductsGrid';
import { NanoBananaStudio } from './components/NanoBananaStudio';
import { ProStudioPhotoshoot } from './components/ProStudioPhotoshoot';
import { SavedGallery } from './components/SavedGallery';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');

  // Product Selection & Customization
  const [selectedProduct, setSelectedProduct] = useState<ProductConfig>(PRODUCTS[0]);
  const [productColor, setProductColor] = useState<string>(PRODUCTS[0].defaultColor);
  const [angle, setAngle] = useState<ProductAngle>(PRODUCTS[0].availableAngles[0]);
  const [lighting, setLighting] = useState<LightingCondition>('studio');
  const [scene, setScene] = useState<BackgroundScene>('warm_studio');

  // Logo State
  const [rawLogoDataUrl, setRawLogoDataUrl] = useState<string>('');
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    x: 0,
    y: 0,
    scale: 0.9,
    rotation: 0,
    opacity: 0.95,
    saturation: 1.0,
    brightness: 1.0,
    contrast: 1.0,
    blendMode: 'multiply',
    colorTint: 'original',
    customTintColor: '#3B82F6',
    removeBgTolerance: 25,
    removeBgColor: 'white',
  });

  // Current Mockup Snapshot DataUrl for AI pipelines
  const [currentMockupDataUrl, setCurrentMockupDataUrl] = useState<string>('');

  // Saved Mockups in LocalStorage
  const [savedMockups, setSavedMockups] = useState<SavedMockup[]>(() => {
    try {
      const stored = localStorage.getItem('mockupstudio_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Initialize with the first sample logo so the user sees a live preview immediately
  useEffect(() => {
    const initLogo = async () => {
      try {
        const firstSample = SAMPLE_LOGOS[0];
        const dataUrl = svgToDataUrl(firstSample.svg);
        setRawLogoDataUrl(dataUrl);
        const img = await loadImage(dataUrl);
        setLogoImg(img);
      } catch (err) {
        console.error('Failed to initialize sample logo:', err);
      }
    };
    initLogo();
  }, []);

  // Sync angle and product color when product changes
  const handleSelectProduct = (product: ProductConfig) => {
    setSelectedProduct(product);
    setProductColor(product.defaultColor);
    setAngle(product.availableAngles[0]);
    // Switch to studio tab if in lineup or gallery
    if (activeTab === 'lineup' || activeTab === 'gallery') {
      setActiveTab('studio');
    }
  };

  // Render a hidden snapshot canvas to produce currentMockupDataUrl for AI tabs
  useEffect(() => {
    const hiddenCanvas = document.createElement('canvas');
    renderMockupToCanvas(hiddenCanvas, {
      product: selectedProduct,
      productColor,
      angle,
      lighting,
      scene,
      logoImg,
      logoSettings,
      width: 1024,
      height: 1024,
    });
    setCurrentMockupDataUrl(hiddenCanvas.toDataURL('image/png'));
  }, [selectedProduct, productColor, angle, lighting, scene, logoImg, logoSettings]);

  // Save Mockup Handler
  const handleSaveMockup = (newMockup: SavedMockup) => {
    setSavedMockups((prev) => {
      const updated = [newMockup, ...prev];
      try {
        localStorage.setItem('mockupstudio_saved', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  // Delete Mockup Handler
  const handleDeleteMockup = (id: string) => {
    setSavedMockups((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('mockupstudio_saved', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  // Apply Generated Logo from AI Studio
  const handleApplyAiLogo = (img: HTMLImageElement, dataUrl: string) => {
    setLogoImg(img);
    setRawLogoDataUrl(dataUrl);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedMockups.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Tab 1: Studio Mockup (Primary interactive workspace) */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Product Selector */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4">
              <div className="text-xs font-semibold text-neutral-300 mb-2.5">
                Select Product Mockup:
              </div>
              <ProductSelector
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            {/* Studio Workspace: Canvas + Controls Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Mockup Canvas */}
              <div className="lg:col-span-7">
                <MockupCanvas
                  product={selectedProduct}
                  productColor={productColor}
                  angle={angle}
                  setAngle={setAngle}
                  lighting={lighting}
                  setLighting={setLighting}
                  scene={scene}
                  setScene={setScene}
                  logoImg={logoImg}
                  logoSettings={logoSettings}
                  setLogoSettings={setLogoSettings}
                  onSaveMockup={handleSaveMockup}
                />
              </div>

              {/* Right Column: Comprehensive Customization Controls */}
              <div className="lg:col-span-5">
                <ControlsPanel
                  product={selectedProduct}
                  productColor={productColor}
                  setProductColor={setProductColor}
                  logoSettings={logoSettings}
                  setLogoSettings={setLogoSettings}
                  rawLogoDataUrl={rawLogoDataUrl}
                  setRawLogoDataUrl={setRawLogoDataUrl}
                  setLogoImg={setLogoImg}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: All Products Merch Lineup */}
        {activeTab === 'lineup' && (
          <AllProductsGrid
            productColor={productColor}
            angle={angle}
            lighting={lighting}
            scene={scene}
            logoImg={logoImg}
            logoSettings={logoSettings}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Tab 3: AI Creation & Editing with gemini-nano-banana-2.1 */}
        {activeTab === 'nano_banana' && (
          <NanoBananaStudio
            currentMockupDataUrl={currentMockupDataUrl}
            rawLogoDataUrl={rawLogoDataUrl}
            onApplyAsLogo={handleApplyAiLogo}
          />
        )}

        {/* Tab 4: 4K High-Quality Commercial Photoshoot with gemini-3-pro-image-preview */}
        {activeTab === 'pro_shoot' && (
          <ProStudioPhotoshoot
            currentMockupDataUrl={currentMockupDataUrl}
          />
        )}

        {/* Tab 5: Saved Mockups Collection */}
        {activeTab === 'gallery' && (
          <SavedGallery
            savedMockups={savedMockups}
            onDeleteMockup={handleDeleteMockup}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}
      </main>
    </div>
  );
}
