import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Grid, 
  Wand2, 
  Bookmark, 
  Camera
} from 'lucide-react';

export type ActiveTab = 'studio' | 'lineup' | 'nano_banana' | 'pro_shoot' | 'gallery';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white font-['Space_Grotesk']">
                MockupStudio
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                Pro
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Interactive 3D Product Mockup &amp; Merch Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-neutral-950/70 border border-neutral-800/80 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Mockup</span>
          </button>

          <button
            onClick={() => setActiveTab('lineup')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'lineup'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span>Merch Lineup</span>
          </button>

          <button
            onClick={() => setActiveTab('nano_banana')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'nano_banana'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Editor</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-mono hidden md:inline">
              nano-banana
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pro_shoot')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pro_shoot'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>4K Photoshoot</span>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.2 rounded font-mono hidden md:inline">
              gemini-3-pro
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 text-[10px] flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time 3D Canvas</span>
        </div>
      </div>
    </header>
  );
};
