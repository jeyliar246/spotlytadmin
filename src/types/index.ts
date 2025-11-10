export type CreatorType = 'influencer' | 'talent';

export interface SummaryMetrics {
  totalUsers: number;
  totalInfluencers: number;
  totalTalent: number;
  activeJobs: number;
  pendingApplications: number;
  totalTransactions: number;
  revenueNaira: number;
}

export interface CreatorRow {
  id: string;
  full_name: string | null;
  email: string | null;
  creator_type: CreatorType | null;
  is_influencer: boolean;
  is_talent: boolean;
  talent_skill: string | null;
  total_followers: number | null;
  daily_rate: number | null;
  created_at: string;
}

export interface JobRow {
  id: string;
  title: string;
  status: string;
  created_at: string;
  offer: number;
  currency: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description?: string | null;
}

export interface SpotlytNews {
  id: string;
  title: string;
  body: string;
  feature: string;
  feature_label?: string;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  is_published: boolean;
  is_pinned: boolean;
  published_at: string | null;
  created_at: string;
}
