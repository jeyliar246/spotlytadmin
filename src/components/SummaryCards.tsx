import type { SummaryMetrics } from '../types';
import './SummaryCards.css';

interface SummaryCardsProps {
  metrics: SummaryMetrics | null;
  isLoading: boolean;
}

const cardConfig = [
  { key: 'totalUsers', label: 'Total Users', accent: '#4f46e5' },
  { key: 'totalInfluencers', label: 'Influencers', accent: '#f97316' },
  { key: 'totalTalent', label: 'Talent', accent: '#14b8a6' },
  { key: 'activeJobs', label: 'Active Jobs', accent: '#0ea5e9' },
  { key: 'pendingApplications', label: 'Pending Applications', accent: '#facc15' },
  { key: 'totalTransactions', label: 'Transactions', accent: '#6366f1' },
  { key: 'revenueNaira', label: 'Revenue (₦)', accent: '#22c55e', formatter: (value: number) => `₦${value.toLocaleString()}` },
] as const;

const SummaryCards = ({ metrics, isLoading }: SummaryCardsProps) => {
  return (
    <section className="summary-cards">
      {cardConfig.map((card) => {
        const value = metrics ? (metrics[card.key] as number) : 0;
        const formatted = card.formatter ? card.formatter(value) : value.toLocaleString();

        return (
          <div key={card.key} className="summary-card" style={{ borderTopColor: card.accent }}>
            <span className="summary-card-label">{card.label}</span>
            <strong className="summary-card-value">{isLoading ? '…' : formatted}</strong>
          </div>
        );
      })}
    </section>
  );
};

export default SummaryCards;
