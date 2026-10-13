import React, { useState } from 'react';
import JSZip from 'jszip';
import { SavedMockup } from '../types/mockup';
import { downloadDataUrl } from '../utils/imageProcessing';
import { 
  Download, 
  Trash2, 
  Bookmark, 
  ArrowRight, 
  Archive, 
  Loader2, 
  Check, 
  CheckSquare, 
  Square 
} from 'lucide-react';

interface SavedGalleryProps {
  savedMockups: SavedMockup[];
  onDeleteMockup: (id: string) => void;
  onSelectSavedMockup?: (mockup: SavedMockup) => void;
  onGoToStudio: () => void;
}

export const SavedGallery: React.FC<SavedGalleryProps> = ({
  savedMockups,
  onDeleteMockup,
  onGoToStudio,
}) => {
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportComplete, setExportComplete] = useState(false);

  // Toggle selection for a single mockup
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all or deselect all
  const toggleSelectAll = () => {
    if (selectedIds.length === savedMockups.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(savedMockups.map((m) => m.id));
    }
  };

  // Batch Export with JSZip
  const handleBatchExportZip = async (exportAll: boolean = true) => {
    const targetMockups = exportAll || selectedIds.length === 0
      ? savedMockups
      : savedMockups.filter((m) => selectedIds.includes(m.id));

    if (targetMockups.length === 0) return;

    setIsExportingZip(true);
    setZipProgress(10);
    setExportComplete(false);

    try {
      const zip = new JSZip();
      const folder = zip.folder('mockups') || zip;

      // Add each image file to the ZIP archive
      targetMockups.forEach((mockup, index) => {
        // Strip data:image/png;base64, prefix
        const base64Data = mockup.dataUrl.replace(/^data:image\/\w+;base64,/, '');
        const cleanColor = mockup.color.replace('#', '');
        const filename = `${String(index + 1).padStart(2, '0')}_${mockup.productType}_${cleanColor}_${mockup.angle}_${mockup.scene}.png`;
        folder.file(filename, base64Data, { base64: true });
      });

      // Include a metadata manifest file
      const manifestLines = [
        '========================================',
        '       MockupStudio Collection Export   ',
        '========================================',
        `Generated: ${new Date().toLocaleString()}`,
        `Total Mockups: ${targetMockups.length}`,
        '',
        'Itemized List:',
        ...targetMockups.map((m, i) => {
          return `${String(i + 1).padStart(2, '0')}. Product: ${m.productName} [${m.productType}] | Color: ${m.color} | Angle: ${m.angle} | Scene: ${m.scene.replace('_', ' ')} | Date: ${m.createdAt}`;
        }),
      ];
      zip.file('manifest.txt', manifestLines.join('\n'));

      // Generate the ZIP blob with progress callback
      const zipBlob = await zip.generateAsync(
        { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
        (metadata) => {
          setZipProgress(Math.round(metadata.percent));
        }
      );

      // Trigger client-side download
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `mockups-collection-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (err) {
      console.error('Failed to create ZIP archive with JSZip:', err);
    } finally {
      setIsExportingZip(false);
      setZipProgress(0);
    }
  };

  const isAllSelected = savedMockups.length > 0 && selectedIds.length === savedMockups.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Gallery Header with Batch Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Saved Mockup Collection
            </h2>
            <span className="text-xs bg-purple-500/10 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-mono">
              {savedMockups.length} {savedMockups.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your saved merchandise designs or export them all together in a single ZIP package.
          </p>
        </div>

        {/* Batch Export Button */}
        {savedMockups.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Select All Toggle */}
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-xl border border-neutral-700 transition-colors"
            >
              {isAllSelected ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Select All ({selectedIds.length > 0 ? selectedIds.length : savedMockups.length})</span>
                </>
              )}
            </button>

            {/* Batch Download ZIP Button */}
            <button
              onClick={() => handleBatchExportZip(selectedIds.length === 0)}
              disabled={isExportingZip}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 text-neutral-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/10 transition-all cursor-pointer"
            >
              {isExportingZip ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compressing ZIP ({zipProgress}%)...</span>
                </>
              ) : exportComplete ? (
                <>
                  <Check className="w-4 h-4 text-neutral-950" />
                  <span>ZIP Downloaded!</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  <span>
                    {selectedIds.length > 0
                      ? `Export Selected (${selectedIds.length}) as ZIP`
                      : `Download All (${savedMockups.length}) as ZIP`}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedMockups.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <Bookmark className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-200">No saved mockups yet</h3>
          <p className="text-xs text-neutral-400 mt-1 mb-5">
            Customize your logo on any product in the Studio Mockup tab and click "Save" to build your merchandise lookbook.
          </p>
          <button
            onClick={onGoToStudio}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Studio Mockup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Grid of Mockups */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedMockups.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-neutral-900 border rounded-2xl overflow-hidden group flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-amber-500/80 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Image Container with Select Checkbox */}
                <div className="relative aspect-square w-full bg-neutral-950 p-2 flex items-center justify-center">
                  <img
                    src={item.dataUrl}
                    alt={item.title}
                    className="w-full h-full object-contain rounded-xl"
                  />

                  {/* Top Checkbox Overlay */}
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className="absolute top-3 left-3 p-1.5 rounded-lg bg-neutral-900/85 backdrop-blur-md border border-neutral-700/80 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    title={isSelected ? 'Deselect' : 'Select for ZIP'}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                </div>

                {/* Info & Action Footer */}
                <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-900">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-xs text-neutral-200 truncate">
                      {item.productName}
                    </div>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0"
                      style={{ backgroundColor: item.color }}
                      title={`Color: ${item.color}`}
                    />
                  </div>

                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mb-3">
                    <span className="capitalize">{item.angle}</span>
                    <span>·</span>
                    <span className="capitalize">{item.scene.replace('_', ' ')}</span>
                    <span>·</span>
                    <span>{item.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        downloadDataUrl(
                          item.dataUrl,
                          `${item.productType}-saved-${Date.now()}.png`
                        )
                      }
                      className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => onDeleteMockup(item.id)}
                      title="Delete Mockup"
                      className="p-1.5 bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 rounded-lg border border-neutral-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
