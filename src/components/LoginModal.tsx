import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  User, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithPhone, quickSwitchUser } = useAuth();
  const { t } = useSettings();

  const [phone, setPhone] = useState('+998 ');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Mask and format input as +998 XX XXX XX XX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }

    // Extract digits after +998
    const digits = val.slice(4).replace(/\D/g, '').slice(0, 9);
    
    // Format: +998 XX XXX XX XX
    let formatted = '+998';
    if (digits.length > 0) formatted += ' ' + digits.slice(0, 2);
    if (digits.length >= 2) formatted += ' ' + digits.slice(2, 5);
    if (digits.length >= 5) formatted += ' ' + digits.slice(5, 7);
    if (digits.length >= 7) formatted += ' ' + digits.slice(7, 9);

    setPhone(formatted);
    if (error) setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phone.slice(4).replace(/\D/g, '');
    if (cleanDigits.length < 9) {
      setError('Iltimos, to‘liq 9 xonali telefon raqamingizni kiriting (+998 XX XXX XX XX)');
      return;
    }

    const success = loginWithPhone(phone);
    if (success) {
      onClose();
    } else {
      setError('Kirishda xatolik yuz berdi. Raqamni tekshiring.');
    }
  };

  const handleTelegramQuickLogin = () => {
    // Simulate quick Telegram authorization
    loginWithPhone('+998901234567', 'Jasur Aliyev (Telegram)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/[0.12] shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t.brandName}
          </h2>

          <p className="text-xs text-slate-300">
            {t.brandSubtitle}
          </p>
        </div>

        {/* Seamless Notice: No separate register page required */}
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {t.autoCreatedAccountNotice}
          </span>
        </div>

        {/* Phone Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t.enterPhone}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 90 123 45 67"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono-numbers tracking-wide focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            {error && (
              <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
          >
            <span>{t.loginBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Telegram Login */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">
              Yoki
            </span>
          </div>

          <button
            type="button"
            onClick={handleTelegramQuickLogin}
            className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t.telegramQuickLogin}</span>
          </button>
        </div>

        {/* Demo Fast Account Quick Switch for Testing */}
        <div className="pt-3 border-t border-white/[0.08]">
          <div className="text-[10px] text-center text-slate-400 uppercase font-semibold mb-2">
            Tezkor test hisoblari:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { quickSwitchUser('student'); onClose(); }}
              className="py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-semibold text-slate-300 cursor-pointer"
            >
              🎓 Student
            </button>
            <button
              onClick={() => { quickSwitchUser('teacher'); onClose(); }}
              className="py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-semibold text-slate-300 cursor-pointer"
            >
              📚 Teacher
            </button>
            <button
              onClick={() => { quickSwitchUser('admin'); onClose(); }}
              className="py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-semibold text-slate-300 cursor-pointer"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
