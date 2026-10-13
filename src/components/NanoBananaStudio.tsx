import React, { useState } from 'react';
import { AspectRatio } from '../types/mockup';
import { loadImage, downloadDataUrl } from '../utils/imageProcessing';
import { 
  Wand2, 
  Sparkles, 
  Download, 
  Check, 
  Loader2, 
  ArrowRight,
  AlertCircle,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';

interface NanoBananaStudioProps {
  currentMockupDataUrl: string;
  rawLogoDataUrl: string;
  onApplyAsLogo: (img: HTMLImageElement, dataUrl: string) => void;
}

export const NanoBananaStudio: React.FC<NanoBananaStudioProps> = ({
  currentMockupDataUrl,
  rawLogoDataUrl,
  onApplyAsLogo,
}) => {
  const [subMode, setSubMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedSource, setSelectedSource] = useState<'mockup' | 'logo'>('mockup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  // Quick Prompt Inspiration for Creation
  const creationPrompts = [
    'Minimalist geometric mountain emblem with copper and midnight navy',
    'Vintage coffee roaster badge with wheat and hand-drawn cup',
    'Modern streetwear bold typography icon with gradient lightning bolt',
    'Organic botanical line art logo with monstera leaf in emerald green',
    'Cyberpunk neon hexagon crest with futuristic circuit patterns',
  ];

  // Quick Prompt Inspiration for Editing
  const editPrompts = [
    'Place this mug on a rustic café wooden counter with steam and morning sunlight',
    'Put this t-shirt worn by a model in a vibrant urban streetwear lookbook',
    'Add vintage distressed fade and subtle analog film texture',
    'Place on a sunny Mediterranean terrace table overlooking the sea',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a text prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const payload: any = {
        prompt: prompt.trim(),
        aspectRatio,
      };

      if (subMode === 'edit') {
        const sourceData = selectedSource === 'mockup' ? currentMockupDataUrl : rawLogoDataUrl;
        if (!sourceData) {
          throw new Error(`No ${selectedSource} image available to edit.`);
        }
        payload.imageBase64 = sourceData;
        payload.mimeType = 'image/png';
      }

      const res = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed.');
      }

      if (data.imageUrl) {
        setResultImage(data.imageUrl);
      } else {
        throw new Error('No image was returned by gemini-nano-banana-2.1.');
      }
    } catch (err: any) {
      console.error('Error with gemini-nano-banana-2.1:', err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyLogo = async () => {
    if (!resultImage) return;
    try {
      const img = await loadImage(resultImage);
      onApplyAsLogo(img, resultImage);
      setApplied(true);
      setTimeout(() => setApplied(false), 2500);
    } catch (e) {
      console.error('Failed to apply logo:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                AI Image Creation &amp; Editing
              </h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                gemini-nano-banana-2.1
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Generate custom vector-style brand logos from scratch or edit existing mockups using text prompts.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              onClick={() => {
                setSubMode('create');
                setResultImage(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                subMode === 'create'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Create Logo</span>
            </button>

            <button
              onClick={() => {
                setSubMode('edit');
                setResultImage(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                subMode === 'edit'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Scene / Image</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
          {/* Source Selector (When Editing) */}
          {subMode === 'edit' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Image Source to Edit:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedSource('mockup')}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    selectedSource === 'mockup'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-semibold">Current Mockup</div>
                    <div className="text-[10px] text-neutral-400">Place in full lifestyle scene</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedSource('logo')}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    selectedSource === 'logo'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  <Wand2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-semibold">Active Logo</div>
                    <div className="text-[10px] text-neutral-400">Modify logo artwork</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              {subMode === 'create' ? 'Describe the logo you want to create:' : 'Describe changes or scene context:'}
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                subMode === 'create'
                  ? 'e.g. Minimalist coffee shop emblem with steaming cup and wheat stalk, vector style, white background...'
                  : 'e.g. Place this mug on a warm wooden coffee shop counter with morning sunlight and blurred barista background...'
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Quick Prompts */}
          <div>
            <div className="text-[11px] text-neutral-400 mb-1.5">Inspiration Prompts:</div>
            <div className="flex flex-wrap gap-1.5">
              {(subMode === 'create' ? creationPrompts : editPrompts).map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-neutral-950 hover:bg-neutral-800 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['1:1', '3:4', '4:3', '16:9', '9:16'] as AspectRatio[]).map((ar) => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    aspectRatio === ar
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating with gemini-nano-banana-2.1...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>
                  {subMode === 'create' ? 'Create Image with Nano Banana' : 'Edit Image with Nano Banana'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Preview */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
              <span>Result Preview</span>
              {resultImage && (
                <span className="text-[10px] text-emerald-400 font-mono">
                  Ready
                </span>
              )}
            </div>

            <div className="w-full aspect-square rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-center overflow-hidden relative">
              {isLoading ? (
                <div className="text-center p-4">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
                  <div className="text-xs font-semibold text-neutral-200">Processing with Nano Banana</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Applying prompt to model...</div>
                </div>
              ) : resultImage ? (
                <img
                  src={resultImage}
                  alt="Generated Result"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-neutral-400">
                  <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <div className="text-xs">Your generated image will appear here</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons for Result */}
          {resultImage && (
            <div className="mt-4 space-y-2">
              {subMode === 'create' && (
                <button
                  onClick={handleApplyLogo}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {applied ? (
                    <>
                      <Check className="w-4 h-4 text-neutral-950" />
                      <span>Applied to Mockups!</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Apply as Logo to Mockups</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => downloadDataUrl(resultImage, `nano-banana-${Date.now()}.png`)}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Generated PNG</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
