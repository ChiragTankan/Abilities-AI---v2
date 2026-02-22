
export interface ProfileData {
  name: string;
  title: string;
  skills: string[];
  experienceYears: number;
  summary: string;
}

export interface GapAnalysis {
  matchScore: number;
  missingSkills: string[];
  currentSkillsStrengths: string[];
  roleInsights: string;
}

export interface RoadmapDay {
  day: number;
  title: string;
  tasks: string[];
  resources: { name: string; url: string; type: 'free' | 'paid' }[];
}

export interface Roadmap {
  targetRole: string;
  plan: RoadmapDay[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserSubscription {
  isPremium: boolean;
  plan: 'monthly' | 'yearly' | 'none' | 'voucher';
  trialEndDate?: string;
  expiryDate?: number; // Timestamp for voucher or plan expiry
}

export enum AppStep {
  LANDING = 'LANDING',
  PROFILE_INPUT = 'PROFILE_INPUT',
  JOB_INPUT = 'JOB_INPUT',
  DASHBOARD = 'DASHBOARD',
  ROADMAP = 'ROADMAP',
  INTERVIEW = 'INTERVIEW'
}
