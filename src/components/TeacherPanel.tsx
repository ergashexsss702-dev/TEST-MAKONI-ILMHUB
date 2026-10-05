import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  FileText, 
  Users, 
  BookOpen, 
  BarChart3, 
  Check, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileSpreadsheet,
  Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Question, QuestionType, TestItem } from '../types';

export const TeacherPanel: React.FC = () => {
  const { tests, attempts, groups, createTest, deleteTest, exportResultsToExcel, parseQuestionsFromText } = useData();
  const { currentUser } = useAuth();
  const { t } = useSettings();

  const [activeTab, setActiveTab] = useState<'tests' | 'create' | 'results' | 'groups' | 'import'>('tests');
  const [searchStudent, setSearchStudent] = useState('');

  // New test state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Matematika');
  const [newTopic, setNewTopic] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState(20);
  const [newPassingPercent, setNewPassingPercent] = useState(70);
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-temp-1',
      text: '',
      type: 'mcq',
      options: [
        { id: 'opt-a', text: '' },
        { id: 'opt-b', text: '' },
        { id: 'opt-c', text: '' },
        { id: 'opt-d', text: '' },
      ],
      correctOptionId: 'opt-a',
      points: 20,
      explanation: '',
    },
  ]);

  // DOCX / Text Import state
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: 'q-temp-' + (prev.length + 1),
        text: '',
        type: 'mcq',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
          { id: 'opt-c', text: '' },
          { id: 'opt-d', text: '' },
        ],
        correctOptionId: 'opt-a',
        points: 20,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveTest = () => {
    if (!newTitle.trim()) {
      alert('Iltimos, test nomini kiriting');
      return;
    }

    createTest({
      title: newTitle,
      subject: newSubject,
      topic: newTopic || newSubject,
      description: newDescription || 'O‘qituvchi tomonidan yaratilgan test savollari.',
      durationMinutes: Number(newDuration),
      passingPercent: Number(newPassingPercent),
      maxScore: questions.reduce((sum, q) => sum + Number(q.points), 0),
      questions,
      authorId: currentUser?.id || 'teacher-1',
      authorName: currentUser?.name || 'O‘qituvchi',
      difficulty: newDifficulty,
      attemptsAllowed: 3,
      shuffleQuestions: true,
      showResultsAfter: true,
      isPublished: true,
    });

    // Reset and switch to tests view
    setNewTitle('');
    setNewTopic('');
    setNewDescription('');
    setActiveTab('tests');
  };

  const handleImportQuestions = () => {
    if (!importText.trim()) return;
    const parsed = parseQuestionsFromText(importText);
    if (parsed.length === 0) {
      setImportStatus('Savollar formati mos kelmadi. Namuna bo‘yicha tekshirib ko‘ring.');
      return;
    }
    setQuestions(parsed);
    setImportStatus(`${parsed.length} ta savol muvaffaqiyatli import qilindi! Test yaratish oynasiga o‘tildi.`);
    setTimeout(() => {
      setActiveTab('create');
      setImportStatus(null);
    }, 1200);
  };

  const filteredAttempts = attempts.filter(a => 
    a.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
    a.studentPhone.includes(searchStudent) ||
    a.testTitle.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Teacher Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              {currentUser?.role === 'admin' ? 'Admin & Teacher Center' : t.teacherPanel}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Test va Natijalar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Testlar tuzing, savollarni import qiling va o‘quvchilar natijalarini Excel formatida yuklab oling.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-black/30 p-1.5 rounded-2xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tests' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mening Testlarim
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            + Yangi Test
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'import' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            DOCX Import
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'results' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Natijalar & Excel
          </button>
        </div>
      </div>

      {/* View: Tests List */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Platformadagi barcha testlar ({tests.length})</h2>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi test qo‘shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map(test => (
              <div
                key={test.id}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-400">{test.subject}</span>
                    <span className="text-slate-400 font-mono-numbers">{test.durationMinutes} daqiqa</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{test.title}</h3>
                  <div className="text-xs text-slate-400 mb-2">Mavzu: {test.topic}</div>
                  <div className="text-xs text-slate-500 font-mono-numbers">
                    {test.questions.length} ta savol · O‘tish: {test.passingPercent}% · Maks: {test.maxScore} ball
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => exportResultsToExcel(test.id)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Natijalar Excel</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`"${test.title}" testini o‘chirishni tasdiqlaysizmi?`)) {
                        deleteTest(test.id);
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Create New Test */}
      {activeTab === 'create' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/[0.1] backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h2 className="text-xl font-bold text-white">Yangi Test Yaratish</h2>
            <button
              onClick={() => setActiveTab('import')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Savollarni matndan import qilish</span>
            </button>
          </div>

          {/* Test Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Test Nomi *</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Masalan: Fizika: Termodinamika Qonunlari"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fan</label>
              <select
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Matematika">Matematika</option>
                <option value="Fizika">Fizika</option>
                <option value="Ingliz tili">Ingliz tili</option>
                <option value="Ona tili va Adabiyot">Ona tili va Adabiyot</option>
                <option value="Informatika va IT">Informatika va IT</option>
                <option value="Tarix">Tarix</option>
                <option value="Kimyo">Kimyo</option>
                <option value="Biologiya">Biologiya</option>
                <option value="Mantiqiy savollar">Mantiqiy savollar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mavzu / Bo‘lim</label>
              <input
                type="text"
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                placeholder="Masalan: Ideal gaz holati"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Davomiyligi (daqiqa)</label>
              <input
                type="number"
                value={newDuration}
                onChange={e => setNewDuration(Number(e.target.value))}
                min={5}
                max={180}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono-numbers focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">O‘tish bali (%)</label>
              <input
                type="number"
                value={newPassingPercent}
                onChange={e => setNewPassingPercent(Number(e.target.value))}
                min={10}
                max={100}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono-numbers focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Qiyinlik darajasi</label>
              <select
                value={newDifficulty}
                onChange={e => setNewDifficulty(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="easy">Oson (Easy)</option>
                <option value="medium">O‘rtacha (Medium)</option>
                <option value="hard">Murakkab (Hard)</option>
              </select>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-6 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Savollar ro‘yxati ({questions.length} ta)
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Savol qo‘shish</span>
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-indigo-400 font-mono-numbers">
                    SAVOL #{qIndex + 1}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span>Ball:</span>
                      <input
                        type="number"
                        value={q.points}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setQuestions(prev => prev.map((item, i) => i === qIndex ? { ...item, points: val } : item));
                        }}
                        className="w-16 px-2 py-1 rounded bg-black/40 border border-white/[0.1] text-center font-mono-numbers text-xs"
                      />
                    </div>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        title="Savolni o‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={q.text}
                    onChange={e => {
                      const text = e.target.value;
                      setQuestions(prev => prev.map((item, i) => i === qIndex ? { ...item, text } : item));
                    }}
                    placeholder={`Savol matnini kiriting...`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Options A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIndex) => {
                    const letter = String.fromCharCode(65 + optIndex);
                    const isCorrect = q.correctOptionId === opt.id;

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border ${
                          isCorrect ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/[0.08] bg-black/20'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setQuestions(prev => prev.map((item, i) => i === qIndex ? { ...item, correctOptionId: opt.id } : item));
                          }}
                          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono-numbers shrink-0 flex items-center justify-center cursor-pointer transition-colors ${
                            isCorrect ? 'bg-emerald-500 text-white' : 'bg-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                          title="To‘g‘ri javob qilib belgilash"
                        >
                          {letter}
                        </button>

                        <input
                          type="text"
                          value={opt.text}
                          onChange={e => {
                            const val = e.target.value;
                            setQuestions(prev => prev.map((item, i) => {
                              if (i !== qIndex) return item;
                              const updatedOpts = item.options.map((o, oi) => oi === optIndex ? { ...o, text: val } : o);
                              return { ...item, options: updatedOpts };
                            }));
                          }}
                          placeholder={`Variant ${letter} matni...`}
                          className="w-full px-2 py-1 bg-transparent text-xs text-white focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={e => {
                      const exp = e.target.value;
                      setQuestions(prev => prev.map((item, i) => i === qIndex ? { ...item, explanation: exp } : item));
                    }}
                    placeholder="Savol uchun izoh / to‘g‘ri javob tushuntirishi (ixtiyoriy)..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Save Action */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleSaveTest}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Testni Saqlash va Nashr Qilish
            </button>
          </div>
        </div>
      )}

      {/* View: DOCX / Text Import */}
      {activeTab === 'import' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/[0.1] backdrop-blur-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">DOCX va Matndan Savollarni Import Qilish</h2>
            <p className="text-xs text-slate-400 mt-1">
              Word (DOCX) hujjatidan yoki matnli fayldan savollarni quyidagi formatda nusxalab joylang.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 space-y-1 font-mono">
            <div className="text-indigo-400 font-bold mb-1">Format namunasi:</div>
            <div>1. O‘zbekiston Respublikasi Konstitutsiyasi qachon qabul qilingan?</div>
            <div>A) 1992-yil 8-dekabr</div>
            <div>B) 1991-yil 1-sentabr</div>
            <div>C) 1993-yil 2-iyul</div>
            <div>D) 1990-yil 20-iyun</div>
            <div>Javob: A</div>
            <div>Tushuntirish: Konstitutsiya 1992-yil 8-dekabrda qabul qilingan.</div>
          </div>

          <div>
            <textarea
              rows={12}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="DOCX faylingizdagi savollar matnini shu yerga qo‘ying..."
              className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{importStatus}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Orqaga
            </button>
            <button
              onClick={handleImportQuestions}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Savollarni Ajratib Olish (Import)
            </button>
          </div>
        </div>
      )}

      {/* View: Results & Excel Export */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Topshirilgan Testlar Natijalari</h2>
              <p className="text-xs text-slate-400">Barcha o‘quvchilar natijalari va statistikasi</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={e => setSearchStudent(e.target.value)}
                  placeholder="O‘quvchi yoki telefon..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>

              <button
                onClick={() => exportResultsToExcel()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Barchasini Excel (.xlsx) ga yuklash</span>
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-400 uppercase font-semibold border-b border-white/[0.08]">
                  <tr>
                    <th className="px-4 py-3">O‘quvchi</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">Test</th>
                    <th className="px-4 py-3">Ball</th>
                    <th className="px-4 py-3">Foiz</th>
                    <th className="px-4 py-3">Holat</th>
                    <th className="px-4 py-3">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-200">
                  {filteredAttempts.map(att => (
                    <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{att.studentName}</td>
                      <td className="px-4 py-3 font-mono-numbers text-slate-400">{att.studentPhone}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{att.testTitle}</td>
                      <td className="px-4 py-3 font-mono-numbers">{att.score} / {att.maxScore}</td>
                      <td className="px-4 py-3 font-mono-numbers font-bold">{att.percentage}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          att.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {att.passed ? 'PASSED' : 'TRY AGAIN'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono-numbers">{att.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
