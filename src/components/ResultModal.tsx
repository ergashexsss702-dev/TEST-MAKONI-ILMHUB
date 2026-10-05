import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Share2, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Award,
  ArrowRight,
  Send
} from 'lucide-react';
import { TestAttempt, TestItem } from '../types';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

interface ResultModalProps {
  attempt: TestAttempt;
  test?: TestItem;
  onRetake: () => void;
  onBackToDashboard: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  attempt,
  test,
  onRetake,
  onBackToDashboard,
}) => {
  const { exportResultsToExcel } = useData();
  const { t, settings } = useSettings();
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  // Confetti on mount if passed
  useEffect(() => {
    if (attempt.passed && !settings.reduceMotion) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#38bdf8', '#34d399', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Number animation
    let start = 0;
    const duration = 1000;
    const step = 20;
    const increment = attempt.percentage / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= attempt.percentage) {
        setAnimatedPercent(attempt.percentage);
        clearInterval(timer);
      } else {
        setAnimatedPercent(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [attempt.passed, attempt.percentage, settings.reduceMotion]);

  const totalQuestionsCount = test ? test.questions.length : 5;
  const correctAnswersCount = test 
    ? test.questions.filter(q => attempt.answers[q.id] === q.correctOptionId).length 
    : Math.round((attempt.percentage / 100) * totalQuestionsCount);
  
  const wrongAnswersCount = totalQuestionsCount - correctAnswersCount;

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🎯 ILMHUB TESTLAR MAKONI\n\nMen "${attempt.testTitle}" testini yakunladim!\nNatija: ${attempt.percentage}% (${attempt.score}/${attempt.maxScore} ball)\nHolat: ${attempt.passed ? 'PASSED ✅' : 'TRY AGAIN 🔄'}\n\nSiz ham o'z bilimingizni sinab ko'ring!`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${text}`, '_blank');
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Main Score Hero Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/[0.12] backdrop-blur-2xl shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none -z-10 ${
          attempt.passed ? 'bg-emerald-500/15' : 'bg-rose-500/15'
        }`} />

        {/* Top Trophy / Badge Icon */}
        <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border shadow-xl ${
          attempt.passed 
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
            : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
        }`}>
          {attempt.passed ? <Trophy className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-numbers">
            {attempt.subject}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {t.resultTitle}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {attempt.testTitle}
          </p>
        </div>

        {/* Percentage Ring & Big Numbers */}
        <div className="py-2">
          <div className="text-6xl sm:text-7xl font-extrabold tracking-tight font-mono-numbers bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {animatedPercent}%
          </div>
          
          <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${
            attempt.passed
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}>
            {attempt.passed ? t.passedStatus : t.failedStatus}
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto font-mono-numbers text-xs">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="text-slate-400 mb-1">{t.scoreText}</div>
            <div className="text-lg font-bold text-white">{attempt.score} / {attempt.maxScore}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="text-slate-400 mb-1">{t.correctAnswers}</div>
            <div className="text-lg font-bold text-emerald-400">{correctAnswersCount} ta</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="text-slate-400 mb-1">{t.wrongAnswers}</div>
            <div className="text-lg font-bold text-rose-400">{wrongAnswersCount} ta</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="text-slate-400 mb-1">{t.timeSpent}</div>
            <div className="text-lg font-bold text-cyan-300">
              {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={onRetake}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retakeTest}</span>
          </button>

          <button
            onClick={() => exportResultsToExcel(attempt.testId)}
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{t.exportXlsx}</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="px-5 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{copiedTelegram ? 'Ulashildi!' : t.shareTelegram}</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold border border-white/[0.06] transition-all cursor-pointer"
          >
            Bosh sahifa
          </button>
        </div>

      </div>

      {/* Question by question detailed breakdown */}
      {test && test.showResultsAfter && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{t.reviewAnswers}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 font-mono-numbers font-normal">
                {test.questions.length} ta savol
              </span>
            </h2>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{showBreakdown ? 'Yashirish' : 'Ko‘rsatish'}</span>
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showBreakdown && (
            <div className="space-y-4">
              {test.questions.map((q, idx) => {
                const userSelectedOptId = attempt.answers[q.id];
                const isCorrect = userSelectedOptId === q.correctOptionId;
                const correctOption = q.options.find(o => o.id === q.correctOptionId);
                const userOption = q.options.find(o => o.id === userSelectedOptId);

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border backdrop-blur-xl transition-all ${
                      isCorrect
                        ? 'bg-emerald-950/15 border-emerald-500/25'
                        : 'bg-rose-950/15 border-rose-500/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono-numbers ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isCorrect ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {isCorrect ? 'TO‘G‘RI (+ ' + q.points + ' ball)' : 'NOTO‘G‘RI (0 ball)'}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-3">
                      {q.text}
                    </h4>

                    {/* Options list showing right/wrong choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      {q.options.map(opt => {
                        const isThisCorrect = opt.id === q.correctOptionId;
                        const isThisUserPick = opt.id === userSelectedOptId;

                        let style = 'bg-white/[0.02] border-white/[0.06] text-slate-400';
                        if (isThisCorrect) {
                          style = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-semibold';
                        } else if (isThisUserPick && !isThisCorrect) {
                          style = 'bg-rose-500/20 border-rose-500/40 text-rose-200 line-through';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 ${style}`}
                          >
                            {isThisCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            {isThisUserPick && !isThisCorrect && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-indigo-300 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{t.explanation}:</span>
                        </span>
                        <p className="text-slate-300 leading-relaxed pl-4">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
