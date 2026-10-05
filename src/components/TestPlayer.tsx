import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle,
  X
} from 'lucide-react';
import { TestItem, TestAttempt } from '../types';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

interface TestPlayerProps {
  test: TestItem;
  onFinishTest: (attempt: TestAttempt) => void;
  onCancelTest: () => void;
}

export const TestPlayer: React.FC<TestPlayerProps> = ({
  test,
  onFinishTest,
  onCancelTest,
}) => {
  const { submitTestAttempt } = useData();
  const { t, setIsTestActive } = useSettings();

  // Test active effect for slowing down starfield
  useEffect(() => {
    setIsTestActive(true);
    return () => setIsTestActive(false);
  }, [setIsTestActive]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [startedAt] = useState(new Date().toLocaleString('uz-UZ'));
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQuestion = test.questions[currentIndex];
  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleFinalSubmit = () => {
    const timeSpent = test.durationMinutes * 60 - timeLeft;
    const attempt = submitTestAttempt({
      testId: test.id,
      answers,
      timeSpentSeconds: Math.max(1, timeSpent),
      startedAt,
    });
    onFinishTest(attempt);
  };

  const isLowTime = timeLeft < 120; // under 2 minutes

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Sticky Test Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/[0.1] backdrop-blur-xl shadow-xl flex items-center justify-between gap-4">
        
        {/* Left: Test Subject & Question Tracker */}
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
            {test.subject}
          </span>
          <span className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md block">
            {test.title}
          </span>
        </div>

        {/* Center: Live Timer Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono-numbers text-sm font-bold shadow-lg transition-colors ${
          isLowTime 
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' 
            : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Right: Submit Button */}
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer whitespace-nowrap"
        >
          {t.finishTestBtn}
        </button>
      </div>

      {/* Progress Bar & Questions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono-numbers">
          <span>{t.questionNumber} {currentIndex + 1} / {totalQuestions}</span>
          <span>{answeredCount} yechildi ({progressPercent}%)</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Navigator Pill Grid */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {test.questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isFlagged = !!flagged[q.id];
            const isCurrent = idx === currentIndex;

            let btnStyle = 'bg-white/[0.05] text-slate-400 border-white/[0.08]';
            if (isCurrent) {
              btnStyle = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/30';
            } else if (isFlagged) {
              btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            } else if (isAnswered) {
              btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold font-mono-numbers shrink-0 border transition-all cursor-pointer flex items-center justify-center relative ${btnStyle}`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/[0.1] backdrop-blur-2xl shadow-2xl space-y-6">
        
        {/* Question Header & Flag toggle */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-400 font-mono-numbers">
              SAVOL #{currentIndex + 1} · {currentQuestion.points} BALL
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          <button
            onClick={() => toggleFlag(currentQuestion.id)}
            className={`p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
              flagged[currentQuestion.id]
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-slate-200'
            }`}
            title={flagged[currentQuestion.id] ? t.unflagQuestion : t.flagQuestion}
          >
            <Flag className={`w-4 h-4 ${flagged[currentQuestion.id] ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Options List (Large touch-friendly buttons for mobile & S20 5G) */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx); // A, B, C, D
            const isSelected = answers[currentQuestion.id] === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 cursor-pointer group select-none min-h-[60px] ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600/25 to-cyan-500/20 border-indigo-400/80 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.2]'
                }`}
              >
                {/* Option Badge */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border font-mono-numbers transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-white/[0.05] border-white/[0.1] text-slate-300 group-hover:text-white group-hover:border-white/[0.3]'
                }`}>
                  {letter}
                </div>

                {/* Option Text */}
                <span className={`text-sm sm:text-base leading-relaxed ${
                  isSelected ? 'font-bold text-white' : 'font-normal text-slate-200'
                }`}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
              currentIndex === 0
                ? 'opacity-40 pointer-events-none border-white/[0.04] text-slate-500'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-200 hover:bg-white/[0.08]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.prevQuestion}</span>
          </button>

          <span className="text-xs text-slate-500 font-mono-numbers hidden sm:inline">
            {test.subject}
          </span>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>{t.nextQuestion}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>{t.finishTestBtn}</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/[0.15] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">
              {t.finishConfirmTitle}
            </h3>

            <p className="text-xs text-slate-300">
              {t.finishConfirmDesc}
            </p>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono-numbers space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Jami savollar:</span>
                <span className="font-bold text-white">{totalQuestions} ta</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Belgilangan javoblar:</span>
                <span className="font-bold">{answeredCount} ta</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Qoldirilgan savollar:</span>
                <span className="font-bold">{totalQuestions - answeredCount} ta</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 border border-white/[0.08] transition-colors cursor-pointer"
              >
                {t.cancelBtn}
              </button>

              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit();
                }}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {t.confirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
