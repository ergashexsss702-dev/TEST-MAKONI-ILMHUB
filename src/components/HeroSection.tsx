import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Award, 
  Flame, 
  Layers, 
  Smartphone, 
  ShieldCheck 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface HeroSectionProps {
  onStartTests: () => void;
  onViewResults: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartTests,
  onViewResults,
}) => {
  const { t } = useSettings();

  return (
    <div className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      
      {/* Decorative Glow Ambient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-400/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Brand Kicker with Soft Glass & Glowing Border */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl mb-6 shadow-xl shadow-indigo-950/40">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-300 via-cyan-200 to-indigo-100 bg-clip-text text-transparent">
            {t.brandName}
          </span>
        </div>

        {/* Large Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] text-balance">
          {t.heroHeadline}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {t.heroSubheadline}
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartTests}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{t.startTestsBtn}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button
            onClick={onViewResults}
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-bold text-slate-200 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.myResultsBtn}</span>
          </button>
        </div>

        {/* Live Features / Trust Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05]">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center mb-3 text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white font-mono-numbers">100% Real</div>
            <div className="text-xs text-slate-400 mt-0.5">Server-side aniq tekshiruv</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05]">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center mb-3 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white font-mono-numbers">0.1s</div>
            <div className="text-xs text-slate-400 mt-0.5">Tezkor natija va tahlil</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center mb-3 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white font-mono-numbers">16+ Tillarda</div>
            <div className="text-xs text-slate-400 mt-0.5">Global ko‘p tilli tizim</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center mb-3 text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white font-mono-numbers">S20 5G Tayyor</div>
            <div className="text-xs text-slate-400 mt-0.5">Lag-siz 60fps tezlik</div>
          </div>
        </div>

      </div>
    </div>
  );
};
