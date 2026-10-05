export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  streakDays: number;
  totalScore: number;
  testsCompleted: number;
}

export type QuestionType = 'mcq' | 'boolean';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
  explanation: string;
}

export interface TestItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  durationMinutes: number;
  passingPercent: number;
  maxScore: number;
  questions: Question[];
  authorId: string;
  authorName: string;
  createdAt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  showResultsAfter: boolean;
  isPublished: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  subject: string;
  studentId: string;
  studentPhone: string;
  studentName: string;
  startedAt: string;
  completedAt: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  answers: Record<string, string>; // questionId -> chosenOptionId
}

export interface StudentGroup {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  testIds: string[];
  createdAt: string;
}

export type BackgroundPreset = 
  | 'galaxy'
  | 'flying_stars'
  | 'deep_space'
  | 'aurora'
  | 'neon_blue'
  | 'purple_galaxy'
  | 'ocean'
  | 'sunset'
  | 'glass_gradient'
  | 'minimal_dark'
  | 'minimal_light'
  | 'custom';

export type BackgroundIntensity = 'low' | 'medium' | 'high';

export interface CustomBackgroundConfig {
  imageUrl: string;
  brightness: number; // 0 - 200%
  blur: number; // 0 - 20px
  opacity: number; // 10 - 100%
  zoom: number; // 100 - 150%
}

export interface UserSettings {
  theme: 'dark' | 'light';
  backgroundPreset: BackgroundPreset;
  backgroundIntensity: BackgroundIntensity;
  customBackground?: CustomBackgroundConfig;
  reduceMotion: boolean;
  language: string;
  telegramNotifications: boolean;
}

export interface TelegramSettings {
  botUsername: string;
  channelId: string;
  autoSendResults: boolean;
  isConnected: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  timestamp: string;
  details: string;
}
