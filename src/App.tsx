import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import type {
  CreatorRow,
  JobRow,
  SummaryMetrics,
  TransactionRow,
  SpotlytNews,
} from './types';
import DashboardLayout from './components/DashboardLayout';
import SummaryCards from './components/SummaryCards';
import ActivityTable from './components/ActivityTable';
import NewsForm from './components/NewsForm';
import NewsList from './components/NewsList';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState<SummaryMetrics | null>(null);
  const [creators, setCreators] = useState<CreatorRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [news, setNews] = useState<SpotlytNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const [
        usersCountRes,
        influencersCountRes,
        talentCountRes,
        jobsCountRes,
        pendingAppsRes,
        transactionsAggRes,
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_influencer', true),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_talent', true),
        supabase.from('marketing_jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('influencer_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase
          .from('wallet_transactions')
          .select('amount, currency', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      if (usersCountRes.error) throw usersCountRes.error;
      if (influencersCountRes.error) throw influencersCountRes.error;
      if (talentCountRes.error) throw talentCountRes.error;
      if (jobsCountRes.error) throw jobsCountRes.error;
      if (pendingAppsRes.error) throw pendingAppsRes.error;
      if (transactionsAggRes.error) throw transactionsAggRes.error;

      const totalTransactions = transactionsAggRes.count || 0;
      const revenueNaira = (transactionsAggRes.data || [])
        .filter((t) => (t.currency ?? '').toUpperCase() === 'NGN')
        .reduce((acc: number, t: any) => acc + (t.amount || 0), 0);

      setMetrics({
        totalUsers: usersCountRes.count || 0,
        totalInfluencers: influencersCountRes.count || 0,
        totalTalent: talentCountRes.count || 0,
        activeJobs: jobsCountRes.count || 0,
        pendingApplications: pendingAppsRes.count || 0,
        totalTransactions,
        revenueNaira,
      });

      const [creatorRows, jobRows, transactionRows, spotlytNews] = await Promise.all([
        supabase
          .from('users')
          .select(
            'id, full_name, email, creator_type, is_influencer, is_talent, talent_skill, total_followers, daily_rate, created_at'
          )
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('marketing_jobs')
          .select('id, title, status, created_at, offer, currency')
          .order('created_at', { ascending: false })
          .limit(15),
        supabase
          .from('wallet_transactions')
          .select('id, user_id, amount, currency, status, created_at, description')
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('spotlyt_news')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('published_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false }),
      ]);

      if (creatorRows.error) throw creatorRows.error;
      if (jobRows.error) throw jobRows.error;
      if (transactionRows.error) throw transactionRows.error;
      if (spotlytNews.error) throw spotlytNews.error;

      setCreators(creatorRows.data || []);
      setJobs(jobRows.data || []);
      setTransactions(transactionRows.data || []);
      setNews(spotlytNews.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchDashboardData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateNews = async (payload: {
    title: string;
    body: string;
    feature: string;
    imageUrl?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    isPinned?: boolean;
  }) => {
    const { error: insertError } = await supabase.from('spotlyt_news').insert({
      title: payload.title,
      body: payload.body,
      feature: payload.feature,
      image_url: payload.imageUrl || null,
      cta_label: payload.ctaLabel || null,
      cta_url: payload.ctaUrl || null,
      is_published: true,
      is_pinned: payload.isPinned ?? false,
    });

    if (insertError) {
      throw insertError;
    }

    await fetchDashboardData();
  };

  const handleUpdateNews = async (id: string, updates: Partial<SpotlytNews>) => {
    const { error: updateError } = await supabase
      .from('spotlyt_news')
      .update({
        title: updates.title,
        body: updates.body,
        feature: updates.feature,
        image_url: updates.image_url,
        cta_label: updates.cta_label,
        cta_url: updates.cta_url,
        is_published: updates.is_published,
        is_pinned: updates.is_pinned,
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    await fetchDashboardData();
  };

  const handleDeleteNews = async (id: string) => {
    const { error: deleteError } = await supabase.from('spotlyt_news').delete().eq('id', id);
    if (deleteError) {
      throw deleteError;
    }

    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  const summaryCards = useMemo(() => metrics, [metrics]);

  return (
    <AuthProvider>
      <AuthGuard>
        <DashboardLayout onRefresh={handleRefresh} isRefreshing={isRefreshing}>
          {error && <div className="error-banner">{error}</div>}
          <SummaryCards metrics={summaryCards} isLoading={isLoading} />

          <div className="grid grid-2">
            <ActivityTable
              title="Latest Creators"
              description="Most recent influencers and talent on Spotlyt"
              columns={[
                { key: 'full_name', label: 'Name' },
                { key: 'creator_type', label: 'Type', transform: (value) => value || '—' },
                { key: 'talent_skill', label: 'Skill', transform: (value) => value || '—' },
                { key: 'created_at', label: 'Joined', transform: (value) => new Date(value).toLocaleDateString() },
              ]}
              data={creators}
              isLoading={isLoading}
              emptyState="No creators yet."
            />

            <ActivityTable
              title="Active Jobs"
              description="Gigs currently in progress or newly posted"
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'status', label: 'Status' },
                {
                  key: 'offer',
                  label: 'Offer',
                  transform: (value, row) => `${row.currency ?? 'NGN'} ${Number(value || 0).toLocaleString()}`,
                },
                { key: 'created_at', label: 'Created', transform: (value) => new Date(value).toLocaleDateString() },
              ]}
              data={jobs}
              isLoading={isLoading}
              emptyState="No jobs available."
            />
          </div>

          <ActivityTable
            title="Recent Transactions"
            description="Latest wallet payments and escrow releases"
            columns={[
              { key: 'user_id', label: 'User' },
              {
                key: 'amount',
                label: 'Amount',
                transform: (value, row) => `${row.currency ?? 'NGN'} ${Number(value || 0).toLocaleString()}`,
              },
              { key: 'status', label: 'Status' },
              { key: 'created_at', label: 'Date', transform: (value) => new Date(value).toLocaleString() },
            ]}
            data={transactions}
            isLoading={isLoading}
            emptyState="No transactions yet."
          />

          <section className="news-section" id="news">
            <div className="news-header">
              <div>
                <h2>Spotlyt News</h2>
                <p>Create announcements that appear in the mobile app.</p>
              </div>
            </div>

            <NewsForm onCreate={handleCreateNews} />
            <NewsList news={news} onUpdate={handleUpdateNews} onDelete={handleDeleteNews} />
          </section>
        </DashboardLayout>
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;
