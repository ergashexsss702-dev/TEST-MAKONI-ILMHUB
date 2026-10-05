import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Award, 
  Play, 
  BookOpen, 
  Layers, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import { TestItem } from '../types';

interface TestCatalogProps {
  onStartTest: (test: TestItem) => void;
}

export const TestCatalog: React.FC<TestCatalogProps> = ({ onStartTest }) => {
  const { tests } = useData();
  const { t } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Extract unique subjects
  const subjects = ['all', ...Array.from(new Set(tests.map(t => t.subject)))];

  // Filter tests
  const filteredTests = tests.filter(test => {
    const matchesSearch = 
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || test.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.testsCatalog}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Barcha fanlar va mavzular bo‘yicha bilimingizni sinab ko‘ring.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchTests}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs / Subject Pill bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subjects.map(subj => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === subj
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
            }`}
          >
            {subj === 'all' ? t.allSubjects : subj}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.length > 0 ? (
          filteredTests.map(test => (
            <div
              key={test.id}
              className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {test.subject}
                  </span>
                  
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                    test.difficulty === 'hard' 
                      ? 'bg-rose-500/20 text-rose-300' 
                      : test.difficulty === 'medium' 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {test.difficulty}
                  </span>
                </div>

                {/* Title and topic */}
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors mb-1.5">
                  {test.title}
                </h3>
                <div className="text-xs text-slate-400 font-medium mb-3">
                  Mavzu: {test.topic}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-6">
                  {test.description}
                </p>

                {/* Info Spec Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/20 border border-white/[0.05] mb-6 font-mono-numbers text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{test.durationMinutes} {t.durationLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{test.questions.length} {t.questionsCount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{test.maxScore} {t.maxScoreLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{test.passingPercent}% o'tish</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                  Muallif: {test.authorName}
                </span>

                <button
                  onClick={() => onStartTest(test)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 group-hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{t.startBtn}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            Mos keluvchi testlar topilmadi. Qidiruv so'zini o'zgartirib ko'ring.
          </div>
        )}
      </div>

    </div>
  );
};
