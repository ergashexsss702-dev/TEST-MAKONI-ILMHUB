import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Sun, 
  Moon, 
  Sliders, 
  Check, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { BackgroundPreset, BackgroundIntensity } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresetOption {
  id: BackgroundPreset;
  name: string;
  emoji: string;
  previewBg: string;
}

const PRESET_OPTIONS: PresetOption[] = [
  { id: 'galaxy', name: 'Galaxy', emoji: '🌌', previewBg: 'radial-gradient(ellipse at top, #1e1b4b 0%, #090d16 100%)' },
  { id: 'flying_stars', name: 'Flying Stars', emoji: '⭐', previewBg: 'radial-gradient(circle, #312e81 0%, #030712 100%)' },
  { id: 'deep_space', name: 'Deep Space', emoji: '🌌', previewBg: 'radial-gradient(circle, #0c1024 0%, #020617 100%)' },
  { id: 'aurora', name: 'Aurora', emoji: '🌈', previewBg: 'linear-gradient(135deg, #064e3b 0%, #082f49 50%, #090d16 100%)' },
  { id: 'neon_blue', name: 'Neon Blue', emoji: '🔵', previewBg: 'linear-gradient(135deg, #0369a1 0%, #0f172a 100%)' },
  { id: 'purple_galaxy', name: 'Purple Galaxy', emoji: '🟣', previewBg: 'radial-gradient(circle, #581c87 0%, #090514 100%)' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊', previewBg: 'linear-gradient(180deg, #0e7490 0%, #041824 100%)' },
  { id: 'sunset', name: 'Sunset', emoji: '🌅', previewBg: 'radial-gradient(circle, #be123c 0%, #1c0516 100%)' },
  { id: 'glass_gradient', name: 'Glass Gradient', emoji: '💎', previewBg: 'linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #0f172a 100%)' },
  { id: 'minimal_dark', name: 'Minimal Dark', emoji: '⚫', previewBg: '#090d16' },
  { id: 'minimal_light', name: 'Minimal Light', emoji: '⚪', previewBg: '#f8fafc' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    t, 
    setPreset, 
    setIntensity, 
    setReduceMotion, 
    toggleTheme, 
    handleFileUpload,
    updateCustomBackground 
  } = useSettings();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Custom background sliders state
  const customConfig = settings.customBackground || {
    imageUrl: '',
    brightness: 100,
    blur: 0,
    opacity: 85,
    zoom: 100,
  };

  if (!isOpen) return null;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const result = await handleFileUpload(file);
    if (!result.success) {
      setUploadError(result.error || 'Xatolik');
    } else {
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/[0.12] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {t.backgroundSettings}
              </h2>
              <p className="text-xs text-slate-400">
                Orqa fon, animatsiya tezligi va displey rejimlarini moslashtiring.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 11 Live Background Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              11 ta Tayyor Background Presetlari
            </span>
            <span className="text-[11px] text-indigo-400 font-medium">
              Live Preview
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {PRESET_OPTIONS.map(preset => {
              const isSelected = settings.backgroundPreset === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => setPreset(preset.id)}
                  className={`p-3 rounded-2xl border text-left relative overflow-hidden transition-all duration-200 cursor-pointer group ${
                    isSelected 
                      ? 'border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20' 
                      : 'border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                  style={{ background: preset.previewBg }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{preset.emoji}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-bold drop-shadow ${preset.id === 'minimal_light' ? 'text-slate-900' : 'text-white'}`}>
                    {preset.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Background Upload & Fine-Tuning */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t.uploadCustomBg}
              </span>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Rasm tanlash</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />
          </div>

          {uploadError && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Rasm muvaffaqiyatli yuklandi va backgroundga o‘rnatildi!</span>
            </div>
          )}

          {/* Custom image controls (Zoom, Brightness, Blur, Opacity) */}
          {customConfig.imageUrl && (
            <div className="space-y-3 pt-3 border-t border-white/[0.06]">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Rasm sozlamalari (Tuning)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{t.brightness}</span>
                    <span className="font-mono-numbers">{customConfig.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={160}
                    value={customConfig.brightness}
                    onChange={e => updateCustomBackground({ ...customConfig, brightness: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{t.blur}</span>
                    <span className="font-mono-numbers">{customConfig.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={customConfig.blur}
                    onChange={e => updateCustomBackground({ ...customConfig, blur: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{t.opacity}</span>
                    <span className="font-mono-numbers">{customConfig.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={customConfig.opacity}
                    onChange={e => updateCustomBackground({ ...customConfig, opacity: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{t.zoom}</span>
                    <span className="font-mono-numbers">{customConfig.zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={150}
                    value={customConfig.zoom}
                    onChange={e => updateCustomBackground({ ...customConfig, zoom: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Animation Intensity (Low, Medium, High) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              {t.animationIntensity}
            </span>
            <span className="text-indigo-400 font-mono font-bold capitalize">
              {settings.backgroundIntensity}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as BackgroundIntensity[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => setIntensity(lvl)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  settings.backgroundIntensity === lvl
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'low' ? t.intensityLow : lvl === 'medium' ? t.intensityMedium : t.intensityHigh}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility & Display toggles */}
        <div className="pt-2 border-t border-white/[0.08] space-y-3">
          
          {/* Reduce motion toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-xs font-bold text-white">{t.reduceMotion}</div>
              <div className="text-[11px] text-slate-400">Yulduzlar va particlelar harakatini to‘xtatadi / kamaytiradi</div>
            </div>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={e => setReduceMotion(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
            />
          </div>

          {/* Theme mode toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2">
              {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="text-xs font-bold text-white">Rejim: {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer"
            >
              Almashtirish
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            {t.saveSettings}
          </button>
        </div>

      </div>
    </div>
  );
};
