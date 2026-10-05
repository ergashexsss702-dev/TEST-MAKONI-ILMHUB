import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Send, 
  Settings, 
  FileText, 
  CheckCircle2, 
  UserPlus, 
  Trash2, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const AdminPanel: React.FC = () => {
  const { allUsers, currentUser } = useAuth();
  const { telegramSettings, updateTelegramSettings, auditLogs, tests, attempts } = useData();
  const { settings, setPreset, setIntensity } = useSettings();

  const [activeTab, setActiveTab] = useState<'users' | 'telegram' | 'audit' | 'system'>('users');
  
  // Telegram config form state
  const [botUser, setBotUser] = useState(telegramSettings.botUsername);
  const [channel, setChannel] = useState(telegramSettings.channelId);
  const [autoSend, setAutoSend] = useState(telegramSettings.autoSendResults);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    updateTelegramSettings({
      botUsername: botUser,
      channelId: channel,
      autoSendResults: autoSend,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Super Admin Console
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Tizim Boshqaruv Markazi
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            O‘qituvchilar va o‘quvchilarni boshqarish, Telegram bot integratsiyasi va audit xavfsizlik jurnali.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-black/30 p-1.5 rounded-2xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Foydalanuvchilar
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'telegram' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Telegram Bot
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Loglari
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Ro‘yxatdan o‘tgan foydalanuvchilar ({allUsers.length})</h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-400 uppercase font-semibold border-b border-white/[0.08]">
                  <tr>
                    <th className="px-4 py-3">Ism / Profil</th>
                    <th className="px-4 py-3">Telefon raqami</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3">Topshirgan testlar</th>
                    <th className="px-4 py-3">Aktivlik (streak)</th>
                    <th className="px-4 py-3">Qo‘shilgan sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-200 font-mono-numbers">
                  {allUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-sans font-semibold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-300 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <span>{user.name}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{user.phone}</td>
                      <td className="px-4 py-3 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.role === 'admin' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : user.role === 'teacher' 
                            ? 'bg-indigo-500/20 text-indigo-300' 
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{user.testsCompleted || 0} ta</td>
                      <td className="px-4 py-3 text-amber-400">{user.streakDays || 1} kun 🔥</td>
                      <td className="px-4 py-3 text-slate-400">{user.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Telegram Tab */}
      {activeTab === 'telegram' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/[0.1] backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Telegram Bot Integratsiyasi</h2>
              <p className="text-xs text-slate-400">Test natijalarini Telegram kanalga va foydalanuvchilarga yuborish.</p>
            </div>
          </div>

          <form onSubmit={handleSaveTelegram} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bot Username</label>
              <input
                type="text"
                value={botUser}
                onChange={e => setBotUser(e.target.value)}
                placeholder="@ilmhub_testlar_bot"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kanal yoki Guruh ID</label>
              <input
                type="text"
                value={channel}
                onChange={e => setChannel(e.target.value)}
                placeholder="-1002345678901"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono-numbers focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="autoSend"
                checked={autoSend}
                onChange={e => setAutoSend(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="autoSend" className="text-xs text-slate-300 cursor-pointer">
                O‘quvchilar testni yakunlaganda avtomatik ravishda Telegramga hisobot yuborish
              </label>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Telegram bot sozlamalari muvaffaqiyatli saqlandi!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
            >
              Sozlamalarni Saqlash
            </button>
          </form>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Xavfsizlik va Harakatlar Jurnali (Audit Logs)</h2>
            <span className="text-xs text-slate-400 font-mono-numbers">{auditLogs.length} ta yozuv</span>
          </div>

          <div className="space-y-2 font-mono-numbers">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-indigo-300 font-bold text-[10px]">
                    {log.action}
                  </span>
                  <span className="text-white font-sans">{log.details}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 shrink-0 text-[11px]">
                  <span>{log.performedBy} ({log.role})</span>
                  <span>·</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
