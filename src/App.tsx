import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { DataProvider, useData } from './context/DataContext';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StudentDashboard } from './components/StudentDashboard';
import { TestCatalog } from './components/TestCatalog';
import { TestPlayer } from './components/TestPlayer';
import { ResultModal } from './components/ResultModal';
import { TeacherPanel } from './components/TeacherPanel';
import { AdminPanel } from './components/AdminPanel';
import { MyResultsView } from './components/MyResultsView';
import { SettingsModal } from './components/SettingsModal';
import { LoginModal } from './components/LoginModal';
import { TestItem, TestAttempt } from './types';
import { Sparkles, Shield, Heart } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser } = useAuth();
  const { settings, t, isTestActive } = useSettings();
  const { tests } = useData();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<'home' | 'tests' | 'results' | 'teacher' | 'admin' | 'taking_test' | 'test_result'>('home');
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<TestAttempt | null>(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Handler: Start a test
  const handleStartTest = (test: TestItem) => {
    setActiveTest(test);
    setCurrentTab('taking_test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Test finished
  const handleFinishTest = (attempt: TestAttempt) => {
    setActiveAttempt(attempt);
    setCurrentTab('test_result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Cancel test
  const handleCancelTest = () => {
    setActiveTest(null);
    setCurrentTab('tests');
  };

  // Handler: Retake test
  const handleRetakeTest = () => {
    if (activeTest) {
      setCurrentTab('taking_test');
    } else {
      setCurrentTab('tests');
    }
  };

  // Handler: View past attempt result
  const handleViewAttemptResult = (attempt: TestAttempt) => {
    const matchedTest = tests.find(t => t.id === attempt.testId);
    setActiveTest(matchedTest || null);
    setActiveAttempt(attempt);
    setCurrentTab('test_result');
  };

  return (
    <div className={`relative min-h-screen text-slate-100 flex flex-col transition-colors duration-500 ${
      settings.theme === 'light' ? 'text-slate-800' : 'text-slate-100'
    }`}>
      
      {/* 60fps Starfield and Background Canvas */}
      <BackgroundCanvas
        preset={settings.backgroundPreset}
        intensity={settings.backgroundIntensity}
        reduceMotion={settings.reduceMotion}
        theme={settings.theme}
        customConfig={settings.customBackground}
        isTestActive={currentTab === 'taking_test'}
      />

      {/* Primary Top Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (currentTab === 'taking_test') {
            if (!confirm('Test hali yakunlanmadi. Boshqa sahifaga o‘tishni xohlaysizmi?')) return;
          }
          setCurrentTab(tab as any);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        
        {/* View: Home / Dashboard */}
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onStartTests={() => setCurrentTab('tests')}
              onViewResults={() => setCurrentTab('results')}
            />
            <StudentDashboard
              onStartTest={handleStartTest}
              onViewAllTests={() => setCurrentTab('tests')}
              onViewAttemptResult={handleViewAttemptResult}
            />
          </div>
        )}

        {/* View: Tests Catalog */}
        {currentTab === 'tests' && (
          <TestCatalog onStartTest={handleStartTest} />
        )}

        {/* View: Taking Test */}
        {currentTab === 'taking_test' && activeTest && (
          <TestPlayer
            test={activeTest}
            onFinishTest={handleFinishTest}
            onCancelTest={handleCancelTest}
          />
        )}

        {/* View: Test Result */}
        {currentTab === 'test_result' && activeAttempt && (
          <ResultModal
            attempt={activeAttempt}
            test={activeTest || undefined}
            onRetake={handleRetakeTest}
            onBackToDashboard={() => setCurrentTab('home')}
          />
        )}

        {/* View: My Results History */}
        {currentTab === 'results' && (
          <MyResultsView
            onViewAttempt={handleViewAttemptResult}
            onExploreTests={() => setCurrentTab('tests')}
          />
        )}

        {/* View: Teacher Panel */}
        {currentTab === 'teacher' && (
          <TeacherPanel />
        )}

        {/* View: Admin Panel */}
        {currentTab === 'admin' && (
          <AdminPanel />
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] backdrop-blur-md bg-slate-950/70 py-8 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-wider">ILMHUB TESTLAR MAKONI</span>
            <span>·</span>
            <span>{t.brandSubtitle}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Server-side Verified</span>
            <span>·</span>
            <span>S20 5G Optimized</span>
            <span>·</span>
            <span className="text-indigo-400">© 2026 ILMHUB</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Phone Login Modal (No registration page needed!) */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
