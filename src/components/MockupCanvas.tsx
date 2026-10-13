import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ProductConfig, 
  ProductAngle, 
  LightingCondition, 
  BackgroundScene, 
  LogoSettings,
  SavedMockup
} from '../types/mockup';
import { renderMockupToCanvas } from '../utils/canvasRenderer';
import { downloadDataUrl, copyImageToClipboard } from '../utils/imageProcessing';
import { 
  Download, 
  Copy, 
  Bookmark, 
  Sun, 
  RotateCcw, 
  Check, 
  Maximize2, 
  Minimize2,
  Move,
  Eye,
  Palette
} from 'lucide-react';

interface MockupCanvasProps {
  product: ProductConfig;
  productColor: string;
  angle: ProductAngle;
  setAngle: (angle: ProductAngle) => void;
  lighting: LightingCondition;
  setLighting: (lighting: LightingCondition) => void;
  scene: BackgroundScene;
  setScene: (scene: BackgroundScene) => void;
  logoImg: HTMLImageElement | null;
  logoSettings: LogoSettings;
  setLogoSettings: React.Dispatch<React.SetStateAction<LogoSettings>>;
  onSaveMockup: (mockup: SavedMockup) => void;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  product,
  productColor,
  angle,
  setAngle,
  lighting,
  setLighting,
  scene,
  setScene,
  logoImg,
  logoSettings,
  setLogoSettings,
  onSaveMockup,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialLogoOffset, setInitialLogoOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSceneMenu, setShowSceneMenu] = useState(false);

  // Render canvas whenever dependencies change
  const render = useCallback(() => {
    if (!canvasRef.current) return;
    renderMockupToCanvas(canvasRef.current, {
      product,
      productColor,
      angle,
      lighting,
      scene,
      logoImg,
      logoSettings,
      width: 1200,
      height: 1200,
    });
  }, [product, productColor, angle, lighting, scene, logoImg, logoSettings]);

  useEffect(() => {
    render();
  }, [render]);

  // Handle Dragging Logo Directly on Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!logoImg) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialLogoOffset({ x: logoSettings.x, y: logoSettings.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !logoImg) return;
    const deltaX = (e.clientX - dragStart.x) * 1.5;
    const deltaY = (e.clientY - dragStart.y) * 1.5;

    setLogoSettings((prev) => ({
      ...prev,
      x: Math.max(-150, Math.min(150, Math.round(initialLogoOffset.x + deltaX))),
      y: Math.max(-150, Math.min(150, Math.round(initialLogoOffset.y + deltaY))),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Support for mobile/tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!logoImg || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setInitialLogoOffset({ x: logoSettings.x, y: logoSettings.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !logoImg || e.touches.length !== 1) return;
    const deltaX = (e.touches[0].clientX - dragStart.x) * 1.5;
    const deltaY = (e.touches[0].clientY - dragStart.y) * 1.5;

    setLogoSettings((prev) => ({
      ...prev,
      x: Math.max(-150, Math.min(150, Math.round(initialLogoOffset.x + deltaX))),
      y: Math.max(-150, Math.min(150, Math.round(initialLogoOffset.y + deltaY))),
    }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Download High-Res PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const filename = `${product.id}-mockup-${Date.now()}.png`;
    downloadDataUrl(dataUrl, filename);
  };

  // Copy to Clipboard
  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const success = await copyImageToClipboard(dataUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Save to Mockup Gallery
  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const newMockup: SavedMockup = {
      id: `saved-${Date.now()}`,
      title: `${product.name} Mockup`,
      productType: product.id,
      productName: product.name,
      color: productColor,
      angle,
      scene,
      dataUrl,
      createdAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onSaveMockup(newMockup);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Center / Reset Logo
  const handleResetPosition = () => {
    setLogoSettings((prev) => ({
      ...prev,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
    }));
  };

  const scenesList: { id: BackgroundScene; name: string }[] = [
    { id: 'white', name: 'Studio White' },
    { id: 'dark_studio', name: 'Dark Studio' },
    { id: 'warm_studio', name: 'Warm Sun Studio' },
    { id: 'office_desk', name: 'Office Desk' },
    { id: 'outdoor_sun', name: 'Outdoor Garden' },
    { id: 'urban_concrete', name: 'Urban Concrete' },
    { id: 'transparent', name: 'Transparent' },
  ];

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col items-center bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all shadow-xl ${
        isFullscreen ? 'fixed inset-4 z-50 bg-neutral-950 p-6' : 'w-full'
      }`}
    >
      {/* Top Floating Controls Bar */}
      <div className="w-full px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Product Angle & Lighting Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Angles */}
          {product.availableAngles.length > 1 && (
            <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-lg border border-neutral-800">
              <span className="text-[11px] text-neutral-400 px-1 font-medium flex items-center gap-1">
                <Eye className="w-3 h-3 text-neutral-400" />
                Angle:
              </span>
              {product.availableAngles.map((ang) => (
                <button
                  key={ang}
                  onClick={() => setAngle(ang)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-colors font-medium ${
                    angle === ang
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {ang}
                </button>
              ))}
            </div>
          )}

          {/* Lighting */}
          <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-lg border border-neutral-800">
            <span className="text-[11px] text-neutral-400 px-1 font-medium flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              Light:
            </span>
            {product.availableLighting.map((light) => (
              <button
                key={light}
                onClick={() => setLighting(light)}
                className={`px-2 py-1 rounded text-xs capitalize transition-colors font-medium ${
                  lighting === light
                    ? 'bg-neutral-800 text-amber-300 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {light}
              </button>
            ))}
          </div>

          {/* Background Scene Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSceneMenu(!showSceneMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span className="capitalize text-xs">
                Scene: {scene.replace('_', ' ')}
              </span>
            </button>

            {showSceneMenu && (
              <div className="absolute left-0 top-full mt-1 w-44 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl py-1 z-30">
                {scenesList.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setScene(sc.id);
                      setShowSceneMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      scene === sc.id
                        ? 'bg-neutral-800 text-amber-300 font-semibold'
                        : 'text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>{sc.name}</span>
                    {scene === sc.id && <Check className="w-3 h-3 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Reset & Action Buttons */}
        <div className="flex items-center gap-1.5">
          {logoImg && (
            <button
              onClick={handleResetPosition}
              title="Reset Logo Center"
              className="p-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full aspect-square max-w-[560px] flex items-center justify-center p-2 select-none ${
          isDragging ? 'cursor-grabbing' : logoImg ? 'cursor-grab' : 'cursor-default'
        } ${scene === 'transparent' ? 'bg-[linear-gradient(45deg,#1f1f23_25%,transparent_25%),linear-gradient(-45deg,#1f1f23_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f1f23_75%),linear-gradient(-45deg,transparent_75%,#1f1f23_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]' : ''}`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-xl shadow-inner pointer-events-none"
        />

        {/* Reposition Drag Badge Hint */}
        {logoImg && !isDragging && (
          <div className="absolute bottom-4 left-4 bg-neutral-950/85 backdrop-blur-md border border-neutral-800/90 text-neutral-300 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none">
            <Move className="w-3 h-3 text-amber-400" />
            <span>Drag logo to reposition</span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="w-full px-4 py-3 bg-neutral-900 border-t border-neutral-800/80 flex items-center justify-between gap-3">
        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <span className="font-medium text-neutral-200">{product.name}</span>
          <span>·</span>
          <span>1200×1200 px HD</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy to Clipboard */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors border border-neutral-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Save to Mockup Gallery */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors border border-neutral-700"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-300">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Download PNG */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold rounded-lg transition-all shadow-md shadow-amber-500/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
