import React, { useState } from 'react';
import { ImageResolution, AspectRatio } from '../types/mockup';
import { downloadDataUrl } from '../utils/imageProcessing';
import { 
  Camera, 
  Sparkles, 
  Download, 
  Loader2, 
  AlertCircle, 
  Maximize2,
  Check,
  CheckCircle2
} from 'lucide-react';

interface ProStudioPhotoshootProps {
  currentMockupDataUrl: string;
}

export const ProStudioPhotoshoot: React.FC<ProStudioPhotoshootProps> = ({
  currentMockupDataUrl,
}) => {
  const [imageSize, setImageSize] = useState<ImageResolution>('2K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [prompt, setPrompt] = useState('');
  const [includeReference, setIncludeReference] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [generatedSize, setGeneratedSize] = useState<string | null>(null);

  // Commercial Studio Shoot Presets
  const photoshootPresets = [
    {
      title: 'Minimalist Apple-Style Studio',
      prompt: 'High-end commercial product photography of this merchandise floating against a clean neutral soft-grey studio background, diffused rim lighting, subtle soft cast shadow, 8k resolution, razor sharp detail',
    },
    {
      title: 'Warm Scandinavian Café Lifestyle',
      prompt: 'Commercial lifestyle photoshoot of this product on a rustic natural oak café table with warm morning sunlight streaming through windows, soft background bokeh of coffee roastery',
    },
    {
      title: 'Urban Neon Streetwear Editorial',
      prompt: 'Fashion editorial lookbook photo of this merchandise in a rainy Tokyo street at twilight, glowing neon reflections on wet asphalt, cinematic direct flash photography',
    },
    {
      title: 'Botanical Travertine Flat-Lay',
      prompt: 'Artisanal product flat-lay on textured warm travertine stone slab, organic raw linen fabric folds, olive branch casting soft natural sunlight shadows',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a photoshoot prompt or choose a preset.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const payload: any = {
        prompt: prompt.trim(),
        imageSize, // Explicit 1K, 2K, 4K affordance
        aspectRatio,
      };

      if (includeReference && currentMockupDataUrl) {
        payload.referenceImageBase64 = currentMockupDataUrl;
        payload.mimeType = 'image/png';
      }

      const res = await fetch('/api/generate-high-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'High-quality generation failed.');
      }

      if (data.imageUrl) {
        setResultImage(data.imageUrl);
        setGeneratedSize(data.imageSize || imageSize);
      } else {
        throw new Error('No image was returned by gemini-3-pro-image-preview.');
      }
    } catch (err: any) {
      console.error('Error generating with gemini-3-pro-image-preview:', err);
      setError(err.message || 'An error occurred during high-quality rendering.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                High-Quality Commercial Photoshoot
              </h2>
              <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md font-mono">
                gemini-3-pro-image-preview
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Transform your product mockups into photorealistic studio ad campaigns with configurable 1K, 2K, and 4K ultra-high resolution.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Settings & Prompts */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-5">
          {/* Explicit Affordance for Image Size: 1K, 2K, 4K */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-200">
                Resolution &amp; Image Size
              </label>
              <span className="text-[11px] text-amber-400 font-mono font-medium">
                Target: {imageSize}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  size: '1K' as ImageResolution,
                  title: '1K Standard',
                  desc: '1024×1024 Fast Commercial',
                },
                {
                  size: '2K' as ImageResolution,
                  title: '2K High-Def',
                  desc: '2048×2048 Crisp Print',
                },
                {
                  size: '4K' as ImageResolution,
                  title: '4K Ultra HD',
                  desc: '4096×4096 Cinema Billboard',
                },
              ].map((item) => (
                <button
                  key={item.size}
                  onClick={() => setImageSize(item.size)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    imageSize === item.size
                      ? 'border-rose-500 bg-rose-500/10 shadow-sm ring-1 ring-rose-500/30'
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        imageSize === item.size ? 'text-rose-300' : 'text-neutral-200'
                      }`}
                    >
                      {item.title}
                    </span>
                    {imageSize === item.size && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['1:1', '4:3', '3:4', '16:9', '9:16'] as AspectRatio[]).map((ar) => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    aspectRatio === ar
                      ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Include Reference Toggle */}
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 flex items-center justify-center">
                {currentMockupDataUrl ? (
                  <img src={currentMockupDataUrl} alt="Ref" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-4 h-4 text-neutral-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-200">
                  Use Current Mockup as Visual Reference
                </div>
                <div className="text-[10px] text-neutral-400">
                  Maintains accurate product shape and logo artwork
                </div>
              </div>
            </div>

            <button
              onClick={() => setIncludeReference(!includeReference)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                includeReference ? 'bg-rose-500 justify-end' : 'bg-neutral-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Studio Presets */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Studio Lighting &amp; Scene Presets:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {photoshootPresets.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => setPrompt(preset.prompt)}
                  className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-800/60 hover:border-neutral-700 text-left transition-all group"
                >
                  <div className="text-xs font-medium text-neutral-200 group-hover:text-rose-400 transition-colors">
                    {preset.title}
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {preset.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Box */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Photoshoot Vision &amp; Commercial Prompt:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe lighting, environment, materials, camera lens (e.g. 85mm f/1.4 lens, natural diffuse morning light)..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-rose-500 transition-colors resize-none"
            />
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering {imageSize} with gemini-3-pro-image-preview...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Generate {imageSize} High-Quality Photoshoot</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview Output */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
              <span>Commercial Render Output</span>
              {generatedSize && (
                <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                  {generatedSize} Resolution
                </span>
              )}
            </div>

            <div className="w-full aspect-square rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-center overflow-hidden relative">
              {isLoading ? (
                <div className="text-center p-6 space-y-2">
                  <Loader2 className="w-9 h-9 text-rose-500 animate-spin mx-auto" />
                  <div className="text-xs font-semibold text-neutral-200">
                    Crafting {imageSize} Commercial Render
                  </div>
                  <div className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                    Computing photorealistic reflections, shadows, and textures with gemini-3-pro-image-preview...
                  </div>
                </div>
              ) : resultImage ? (
                <img
                  src={resultImage}
                  alt="Commercial Photoshoot"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-neutral-400">
                  <Camera className="w-9 h-9 text-neutral-400 mx-auto mb-2" />
                  <div className="text-xs font-medium">Your high-resolution photoshoot render will appear here</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Select 1K, 2K, or 4K to begin</div>
                </div>
              )}
            </div>
          </div>

          {resultImage && (
            <div className="mt-4 space-y-2">
              <button
                onClick={() => downloadDataUrl(resultImage, `photoshoot-${generatedSize || imageSize}-${Date.now()}.png`)}
                className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download {generatedSize || imageSize} High-Res Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
