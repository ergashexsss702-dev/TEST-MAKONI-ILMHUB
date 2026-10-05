import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X, 
  LogOut, 
  LogIn, 
  UserCheck, 
  BookOpen, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  GraduationCap,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSettings,
  onOpenLogin,
}) => {
  const { currentUser, logout, quickSwitchUser } = useAuth();
  const { settings, t, toggleTheme, setLanguage } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === settings.language) || SUPPORTED_LANGUAGES[0];

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Single text element with glowing accent) */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer flex items-center gap-3 shrink-0 group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950/90 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              ILMHUB
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              TESTLAR MAKONI
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean text links with active state) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'home' 
                ? 'text-white bg-indigo-500/15 border border-indigo-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {t.dashboard}
          </button>
          
          <button
            onClick={() => handleNavClick('tests')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'tests' 
                ? 'text-white bg-indigo-500/15 border border-indigo-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {t.testsCatalog}
          </button>

          <button
            onClick={() => handleNavClick('results')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'results' 
                ? 'text-white bg-indigo-500/15 border border-indigo-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {t.myResults}
          </button>

          {/* Teacher panel link */}
          {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
            <button
              onClick={() => handleNavClick('teacher')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'teacher' 
                  ? 'text-white bg-indigo-500/15 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {t.teacherPanel}
            </button>
          )}

          {/* Admin panel link */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'admin' 
                  ? 'text-white bg-indigo-500/15 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {t.adminPanel}
            </button>
          )}
        </nav>

        {/* Zone 3: Actions (Language, Background Settings, Theme, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] transition-colors"
              title="Tilni o'zgartirish"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden md:inline font-mono uppercase">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 max-h-80 overflow-y-auto rounded-xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl p-1.5 z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Dunyo tillari (16+)
                </div>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      settings.language === lang.code
                        ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono opacity-60">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Background Settings trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] transition-colors group"
            title={t.backgroundSettings}
          >
            <Sliders className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] transition-colors"
            title={t.themeToggle}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* User profile / Quick Switch / Login */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[90px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-indigo-300 font-mono leading-tight uppercase">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl p-2 z-50">
                  <div className="px-2.5 py-1.5 border-b border-white/[0.08] mb-1">
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{currentUser.phone}</div>
                    <div className="text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold uppercase">
                      Rol: {currentUser.role}
                    </div>
                  </div>

                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Rolni almashtirish (Test uchun)
                  </div>
                  <button
                    onClick={() => { quickSwitchUser('student'); setRoleDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-white/[0.06] rounded-lg transition-colors"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Student roli</span>
                  </button>
                  <button
                    onClick={() => { quickSwitchUser('teacher'); setRoleDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-white/[0.06] rounded-lg transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Teacher roli</span>
                  </button>
                  <button
                    onClick={() => { quickSwitchUser('admin'); setRoleDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-white/[0.06] rounded-lg transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin roli</span>
                  </button>

                  <div className="border-t border-white/[0.08] mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setRoleDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl space-y-1">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'home' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            {t.dashboard}
          </button>
          <button
            onClick={() => handleNavClick('tests')}
            className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'tests' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            {t.testsCatalog}
          </button>
          <button
            onClick={() => handleNavClick('results')}
            className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'results' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            {t.myResults}
          </button>
          {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
            <button
              onClick={() => handleNavClick('teacher')}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                currentTab === 'teacher' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/[0.06]'
              }`}
            >
              {t.teacherPanel}
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                currentTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/[0.06]'
              }`}
            >
              {t.adminPanel}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
