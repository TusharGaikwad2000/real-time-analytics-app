import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import MetricsCards from './MetricsCards';
import ActionBreakdown from './ActionBreakdown';
import TopUsersTable from './TopUsersTable';
import WindowMetrics from './WindowMetrics';
import EventForm from './EventForm';
import { Activity, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [platform, setPlatform] = useState('amazon');
  const [metrics, setMetrics] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const platforms = ['amazon', 'ebay', 'walmart', 'shopify'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, tRes] = await Promise.all([
        analyticsApi.getMetrics(platform),
        analyticsApi.getTopUsers(platform)
      ]);
      setMetrics(mRes.data);
      setTopUsers(tRes.data.topUsers);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, [platform]);

  return (
    <div className="dashboard-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity color="#58a6ff" size={32} /> Real-Time Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitoring platform events and revenue live</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Platform:</span>
          <select 
            className="select-input" 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
          >
            {platforms.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          <button onClick={fetchData} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </header>

      <MetricsCards metrics={metrics} />

      <div className="secondary-grid">
        <div className="glass-card animate-fade-in">
          <h3 style={{ marginBottom: '1.5rem' }}>Action Breakdown</h3>
          <ActionBreakdown data={metrics?.actionBreakdown} />
        </div>
        
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Top 5 Users</h3>
          <TopUsersTable users={topUsers} platform={platform} />
        </div>
      </div>

      <div className="secondary-grid">
        <WindowMetrics platform={platform} />
        <EventForm platform={platform} onEventSuccess={fetchData} />
      </div>

      <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        Last updated: {lastRefreshed.toLocaleTimeString()} • Real-Time Aggregation Enabled
      </footer>
    </div>
  );
};

export default Dashboard;
