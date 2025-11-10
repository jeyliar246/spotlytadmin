import { ReactNode } from 'react';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
  onRefresh?: () => void | Promise<void>;
  isRefreshing?: boolean;
}

const DashboardLayout = ({ children, onRefresh, isRefreshing = false }: DashboardLayoutProps) => {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="logo">Spotlyt Admin</div>
        <nav>
          <a href="#overview" className="active">
            Overview
          </a>
          <a href="#creators">Creators</a>
          <a href="#jobs">Jobs</a>
          <a href="#transactions">Transactions</a>
          <a href="#news">Spotlyt News</a>
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Spotlyt Control Center</h1>
            <p>Monitor community growth, gigs, wallets, and announcements in one place.</p>
          </div>
          {onRefresh && (
            <button className="refresh-button" onClick={onRefresh} disabled={isRefreshing}>
              {isRefreshing ? 'Refreshing…' : 'Refresh Data'}
            </button>
          )}
        </header>

        <div className="dashboard-body">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
