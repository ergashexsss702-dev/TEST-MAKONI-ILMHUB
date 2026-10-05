import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Trophy, 
  TrendingUp, 
  Flame, 
  ArrowRight, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import { TestItem, TestAttempt } from '../types';

interface StudentDashboardProps {
  onStartTest: (test: TestItem) => void;
  onViewAllTests: () => void;
  onViewAttemptResult: (attempt: TestAttempt) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartTest,
  onViewAllTests,
  onViewAttemptResult,
}) => {
  const { currentUser } = useAuth();
  const { tests, attempts } = useData();
  const { t } = useSettings();

  // Compute student stats
  const studentAttempts = attempts.filter(a => a.studentId === currentUser?.id);
  const totalCompleted = studentAttempts.length;
  const bestScore = studentAttempts.reduce((max, a) => Math.max(max, a.percentage), 0);
  const avgScore = totalCompleted > 0 
    ? Math.round(studentAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalCompleted) 
    : 0;
  const streak = currentUser?.streakDays || 1;

  // Recommended tests (take tests the student has not yet taken or has lower score)
  const recommendedTests = tests.slice(0, 3);
  const recentAttempts = studentAttempts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-slate-900/40 to-slate-950/60 border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            <span>{t.greetingTitle}</span>
            <span className="text-indigo-400 font-bold">{currentUser?.name || 'Talaba'}</span>
          </div>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            {t.greetingSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
            <div className="text-left">
              <div className="text-xs font-semibold uppercase tracking-wider">{t.statStreakDays}</div>
              <div className="text-base font-extrabold font-mono-numbers">{streak} kun</div>
            </div>
          </div>

          <button
            onClick={onViewAllTests}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            {t.testsCatalog}
          </button>
        </div>
      </div>

      {/* 5 Core Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: Jami testlar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.06] hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.statTotalTests}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
            {tests.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Platformadagi barcha testlar</div>
        </div>

        {/* Card 2: Yechilgan testlar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.06] hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.statCompletedTests}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
            {totalCompleted}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Muvaffaqiyatli topshirilgan</div>
        </div>

        {/* Card 3: Eng yuqori natija */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.06] hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.statHighestScore}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono-numbers">
            {bestScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Shaxsiy rekord natija</div>
        </div>

        {/* Card 4: O'rtacha natija */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.06] hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.statAverageScore}</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono-numbers">
            {avgScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Barcha topshirilgan testlar</div>
        </div>

        {/* Card 5: Ketma-ket kunlar */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.06] hover:border-rose-500/30 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.statStreakDays}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono-numbers">
            {streak} <span className="text-xs font-normal text-slate-400">kun</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Kunlik faollik zanjiri</div>
        </div>

      </div>

      {/* Main Content Split: Recommended Tests & Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Recommended Tests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Tavsiya etilgan testlar</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
                {recommendedTests.length} ta
              </span>
            </h2>
            <button
              onClick={onViewAllTests}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Barchasini ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedTests.map(test => (
              <div
                key={test.id}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-indigo-400">{test.subject}</span>
                    <span className="text-slate-400 font-mono-numbers">{test.durationMinutes} {t.durationLabel}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1 mb-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {test.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono-numbers">
                    <span>{test.questions.length} {t.questionsCount}</span>
                    <span className="mx-1.5 opacity-40">·</span>
                    <span>{test.maxScore} ball</span>
                  </div>

                  <button
                    onClick={() => onStartTest(test)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{t.startBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 Col): So'nggi natijalar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">So'nggi natijalar</h2>
            <span className="text-xs text-slate-400 font-mono-numbers">{studentAttempts.length} ta yechilgan</span>
          </div>

          <div className="space-y-3">
            {recentAttempts.length > 0 ? (
              recentAttempts.map(att => (
                <div
                  key={att.id}
                  onClick={() => onViewAttemptResult(att)}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/[0.15] cursor-pointer transition-all duration-200 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <div className="text-xs font-bold text-white truncate">{att.testTitle}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono-numbers">
                      <span>{att.completedAt.split(' ')[0]}</span>
                      <span>·</span>
                      <span>{Math.floor(att.timeSpentSeconds / 60)} daq</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-sm font-extrabold font-mono-numbers ${att.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {att.percentage}%
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {att.passed ? 'Passed' : 'Try Again'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-slate-400 text-xs">
                Siz hali test topshirmadingiz. Testlar katalogidan birinchi testingizni boshlang!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
