import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  Eye, 
  Search, 
  Filter,
  BarChart3
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { TestAttempt } from '../types';

interface MyResultsViewProps {
  onViewAttempt: (attempt: TestAttempt) => void;
  onExploreTests: () => void;
}

export const MyResultsView: React.FC<MyResultsViewProps> = ({
  onViewAttempt,
  onExploreTests,
}) => {
  const { attempts, exportResultsToExcel } = useData();
  const { currentUser } = useAuth();
  const { t } = useSettings();

  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Student specific attempts or all if not logged in
  const userAttempts = currentUser 
    ? attempts.filter(a => a.studentId === currentUser.id)
    : attempts;

  const filtered = userAttempts.filter(a => {
    const matchesSearch = 
      a.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'passed') return matchesSearch && a.passed;
    if (filterStatus === 'failed') return matchesSearch && !a.passed;
    return matchesSearch;
  });

  const totalTests = userAttempts.length;
  const passedCount = userAttempts.filter(a => a.passed).length;
  const avgScore = totalTests > 0 
    ? Math.round(userAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalTests) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Quick Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.myResults}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Barcha topshirilgan testlar tarixi, to‘plangan ballar va batafsil tahlil.
          </p>
        </div>

        <button
          onClick={() => exportResultsToExcel()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t.exportXlsx}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-medium mb-1">Topshirilgan testlar</div>
          <div className="text-3xl font-extrabold text-white font-mono-numbers">{totalTests} ta</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-medium mb-1">Muvaffaqiyatli (Passed)</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono-numbers">{passedCount} ta</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-medium mb-1">O‘rtacha natija</div>
          <div className="text-3xl font-extrabold text-cyan-300 font-mono-numbers">{avgScore}%</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.06]'
            }`}
          >
            Barchasi ({userAttempts.length})
          </button>
          <button
            onClick={() => setFilterStatus('passed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'passed'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.06]'
            }`}
          >
            O‘tilganlar ({passedCount})
          </button>
          <button
            onClick={() => setFilterStatus('failed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'failed'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.06]'
            }`}
          >
            Qayta topshirish ({userAttempts.length - passedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Natijalardan qidirish..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Attempts List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(att => (
            <div
              key={att.id}
              onClick={() => onViewAttempt(att)}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {att.subject}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    att.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {att.passed ? 'PASSED' : 'TRY AGAIN'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {att.testTitle}
                </h3>
                <div className="text-xs text-slate-400 font-mono-numbers flex items-center gap-3">
                  <span>Topshirildi: {att.completedAt}</span>
                  <span>·</span>
                  <span>Vaqt: {Math.floor(att.timeSpentSeconds / 60)} daq {att.timeSpentSeconds % 60} soniya</span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <div className={`text-xl font-extrabold font-mono-numbers ${
                    att.passed ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {att.percentage}%
                  </div>
                  <div className="text-xs text-slate-400 font-mono-numbers">
                    {att.score} / {att.maxScore} ball
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAttempt(att);
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-indigo-300 border border-white/[0.1] transition-colors"
                  title="Batafsil ko'rish"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
            <p className="text-xs text-slate-400">
              Hech qanday natija topilmadi.
            </p>
            <button
              onClick={onExploreTests}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer shadow"
            >
              Testlar Katalogiga O‘tish
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
