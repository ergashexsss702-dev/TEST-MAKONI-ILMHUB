import React, { createContext, useContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { TestItem, TestAttempt, StudentGroup, TelegramSettings, AuditLog, Question } from '../types';
import { INITIAL_TESTS, INITIAL_ATTEMPTS, INITIAL_GROUPS, INITIAL_TELEGRAM_SETTINGS, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { useAuth } from './AuthContext';

interface DataContextType {
  tests: TestItem[];
  attempts: TestAttempt[];
  groups: StudentGroup[];
  telegramSettings: TelegramSettings;
  auditLogs: AuditLog[];
  submitTestAttempt: (attemptData: {
    testId: string;
    answers: Record<string, string>;
    timeSpentSeconds: number;
    startedAt: string;
  }) => TestAttempt;
  createTest: (newTest: Omit<TestItem, 'id' | 'createdAt'>) => TestItem;
  updateTest: (testId: string, updates: Partial<TestItem>) => void;
  deleteTest: (testId: string) => void;
  createGroup: (name: string, testIds: string[]) => void;
  updateTelegramSettings: (settings: Partial<TelegramSettings>) => void;
  exportResultsToExcel: (filterTestId?: string) => void;
  parseQuestionsFromText: (rawText: string) => Question[];
  getAttemptsForStudent: (studentId: string) => TestAttempt[];
  getAttemptsForTest: (testId: string) => TestAttempt[];
}

const STORAGE_KEY_TESTS = 'ilmhub_data_tests';
const STORAGE_KEY_ATTEMPTS = 'ilmhub_data_attempts';
const STORAGE_KEY_GROUPS = 'ilmhub_data_groups';
const STORAGE_KEY_TELEGRAM = 'ilmhub_data_telegram';
const STORAGE_KEY_AUDIT = 'ilmhub_data_audit';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile } = useAuth();

  const [tests, setTests] = useState<TestItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TESTS;
  });

  const [attempts, setAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ATTEMPTS;
  });

  const [groups, setGroups] = useState<StudentGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_GROUPS;
  });

  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TELEGRAM);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TELEGRAM_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TELEGRAM, JSON.stringify(telegramSettings));
  }, [telegramSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Server-side scoring & evaluation
  const submitTestAttempt = (data: {
    testId: string;
    answers: Record<string, string>;
    timeSpentSeconds: number;
    startedAt: string;
  }): TestAttempt => {
    const test = tests.find(t => t.id === data.testId);
    if (!test) throw new Error('Test topilmadi');

    let totalScore = 0;
    let maxPossibleScore = 0;

    test.questions.forEach(q => {
      maxPossibleScore += q.points;
      const studentAnswer = data.answers[q.id];
      if (studentAnswer && studentAnswer === q.correctOptionId) {
        totalScore += q.points;
      }
    });

    const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    const passed = percentage >= test.passingPercent;

    const newAttempt: TestAttempt = {
      id: 'att-' + Date.now(),
      testId: test.id,
      testTitle: test.title,
      subject: test.subject,
      studentId: currentUser?.id || 'guest',
      studentPhone: currentUser?.phone || '+998900000000',
      studentName: currentUser?.name || 'Noma‘lum Foydalanuvchi',
      startedAt: data.startedAt,
      completedAt: new Date().toLocaleString('uz-UZ'),
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage,
      passed,
      timeSpentSeconds: data.timeSpentSeconds,
      answers: data.answers,
    };

    setAttempts(prev => [newAttempt, ...prev]);

    // Update student stats if logged in
    if (currentUser) {
      updateProfile({
        testsCompleted: (currentUser.testsCompleted || 0) + 1,
        totalScore: (currentUser.totalScore || 0) + totalScore,
        streakDays: (currentUser.streakDays || 0) + 1,
      });
    }

    // Add audit log
    const log: AuditLog = {
      id: 'log-' + Date.now(),
      action: 'TEST_SUBMITTED',
      performedBy: currentUser?.name || 'Student',
      role: 'student',
      timestamp: new Date().toLocaleString('uz-UZ'),
      details: `${test.title} topshirildi: ${percentage}% (${passed ? 'PASSED' : 'FAILED'}).`,
    };
    setAuditLogs(prev => [log, ...prev]);

    return newAttempt;
  };

  const createTest = (newTestData: Omit<TestItem, 'id' | 'createdAt'>): TestItem => {
    let computedMax = 0;
    newTestData.questions.forEach(q => { computedMax += q.points; });

    const newTest: TestItem = {
      ...newTestData,
      id: 'test-' + Date.now(),
      maxScore: computedMax || 100,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTests(prev => [newTest, ...prev]);

    const log: AuditLog = {
      id: 'log-' + Date.now(),
      action: 'TEST_CREATED',
      performedBy: currentUser?.name || 'Teacher',
      role: currentUser?.role || 'teacher',
      timestamp: new Date().toLocaleString('uz-UZ'),
      details: `Yangi test yaratildi: "${newTest.title}" (${newTest.questions.length} ta savol).`,
    };
    setAuditLogs(prev => [log, ...prev]);

    return newTest;
  };

  const updateTest = (testId: string, updates: Partial<TestItem>) => {
    setTests(prev => prev.map(t => (t.id === testId ? { ...t, ...updates } : t)));
  };

  const deleteTest = (testId: string) => {
    setTests(prev => prev.filter(t => t.id !== testId));
  };

  const createGroup = (name: string, testIds: string[]) => {
    const newGroup: StudentGroup = {
      id: 'grp-' + Date.now(),
      name,
      teacherId: currentUser?.id || 'teacher',
      teacherName: currentUser?.name || 'O‘qituvchi',
      studentCount: 1,
      testIds,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGroups(prev => [newGroup, ...prev]);
  };

  const updateTelegramSettings = (newSettings: Partial<TelegramSettings>) => {
    setTelegramSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Excel (.xlsx) export functionality
  const exportResultsToExcel = (filterTestId?: string) => {
    const targetAttempts = filterTestId 
      ? attempts.filter(a => a.testId === filterTestId)
      : attempts;

    const rows = targetAttempts.map((att, idx) => ({
      'T/r': idx + 1,
      'O‘quvchi ismi': att.studentName,
      'Telefon raqami': att.studentPhone,
      'Test nomi': att.testTitle,
      'Fan': att.subject,
      'To‘plangan ball': att.score,
      'Maksimal ball': att.maxScore,
      'Natija (%)': `${att.percentage}%`,
      'Holat': att.passed ? 'PASSED (O‘tdi)' : 'FAILED (Qayta topshirish)',
      'Sarflangan vaqt': `${Math.floor(att.timeSpentSeconds / 60)} daq ${att.timeSpentSeconds % 60} soniya`,
      'Topshirilgan vaqt': att.completedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Natijalari');

    // Auto width for columns
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 18 },
      { wch: 35 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 22 },
      { wch: 18 },
      { wch: 20 },
    ];

    const fileName = `ILMHUB_Natijalar_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // DOCX / Text format question parser
  // Supports questions in format:
  // 1. Savol matni
  // A) Javob 1
  // B) Javob 2
  // C) Javob 3
  // D) Javob 4
  // Javob: A
  // Tushuntirish: ...
  const parseQuestionsFromText = (rawText: string): Question[] => {
    const parsed: Question[] = [];
    const blocks = rawText.split(/(?=\n\s*(?:\d+[\.\)]|Savol\s*\d+:?))/i).filter(b => b.trim().length > 0);

    blocks.forEach((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 3) return;

      let questionText = lines[0].replace(/^\d+[\.\)]\s*/, '').replace(/^Savol\s*\d+:?\s*/i, '');
      const options: { id: string; text: string }[] = [];
      let correctLetter = 'A';
      let explanation = '';

      lines.slice(1).forEach(line => {
        const optMatch = line.match(/^([A-D])[\)\.\-]\s*(.+)/i);
        if (optMatch) {
          options.push({
            id: 'opt-' + optMatch[1].toLowerCase(),
            text: optMatch[2].trim(),
          });
          return;
        }

        const ansMatch = line.match(/^(?:Javob|Answer|Ответ):\s*([A-D])/i);
        if (ansMatch) {
          correctLetter = ansMatch[1].toUpperCase();
          return;
        }

        const expMatch = line.match(/^(?:Tushuntirish|Explanation|Объяснение):\s*(.+)/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
        }
      });

      if (options.length >= 2) {
        parsed.push({
          id: 'q-imported-' + (idx + 1) + '-' + Date.now(),
          text: questionText,
          type: options.length === 2 && (options[0].text.toLowerCase().includes('ha') || options[0].text.toLowerCase().includes('rost')) ? 'boolean' : 'mcq',
          options,
          correctOptionId: 'opt-' + correctLetter.toLowerCase(),
          points: 20,
          explanation: explanation || 'To‘g‘ri javob: ' + correctLetter,
        });
      }
    });

    return parsed;
  };

  const getAttemptsForStudent = (studentId: string) => {
    return attempts.filter(a => a.studentId === studentId);
  };

  const getAttemptsForTest = (testId: string) => {
    return attempts.filter(a => a.testId === testId);
  };

  return (
    <DataContext.Provider
      value={{
        tests,
        attempts,
        groups,
        telegramSettings,
        auditLogs,
        submitTestAttempt,
        createTest,
        updateTest,
        deleteTest,
        createGroup,
        updateTelegramSettings,
        exportResultsToExcel,
        parseQuestionsFromText,
        getAttemptsForStudent,
        getAttemptsForTest,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
