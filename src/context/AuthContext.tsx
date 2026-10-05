import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  loginWithPhone: (phone: string, optionalName?: string) => boolean;
  quickSwitchUser: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  allUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'ilmhub_auth_user';
const STORAGE_KEY_ALL_USERS = 'ilmhub_auth_all_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to student for instant seamless initial experience
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  // Clean and normalize phone numbers (+998...)
  const normalizePhone = (raw: string) => {
    let cleaned = raw.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('998')) cleaned = '+' + cleaned;
      else if (cleaned.length === 9) cleaned = '+998' + cleaned;
      else cleaned = '+' + cleaned;
    }
    return cleaned;
  };

  const loginWithPhone = (phoneRaw: string, optionalName?: string): boolean => {
    const cleanPhone = normalizePhone(phoneRaw);
    if (cleanPhone.length < 9) return false;

    // Check if user already exists
    const existing = allUsers.find(u => u.phone === cleanPhone);
    if (existing) {
      setCurrentUser(existing);
      return true;
    }

    // Requirement: NO separate register / sign-up page!
    // If phone does not exist, automatically provision student profile seamlessly on first enter
    const phoneSuffix = cleanPhone.slice(-4);
    const newStudent: UserProfile = {
      id: 'user-' + Date.now(),
      phone: cleanPhone,
      name: optionalName?.trim() || `O‘quvchi #${phoneSuffix}`,
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanPhone}`,
      createdAt: new Date().toISOString().split('T')[0],
      streakDays: 1,
      totalScore: 0,
      testsCompleted: 0,
    };

    setAllUsers(prev => [newStudent, ...prev]);
    setCurrentUser(newStudent);
    return true;
  };

  const quickSwitchUser = (role: UserRole) => {
    const target = allUsers.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
    } else {
      const demo = INITIAL_USERS.find(u => u.role === role);
      if (demo) {
        setAllUsers(prev => [demo, ...prev]);
        setCurrentUser(demo);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithPhone,
        quickSwitchUser,
        logout,
        updateProfile,
        allUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
