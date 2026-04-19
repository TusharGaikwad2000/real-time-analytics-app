import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { Clock, TrendingUp } from 'lucide-react';

const WindowMetrics = ({ platform }) => {
  const [minutes, setMinutes] = useState(5);
  const [windowMetrics, setWindowMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWindowData = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getWindowMetrics(platform, minutes);
      setWindowMetrics(res.data);
    } catch (error) {
      console.error('Fetch window error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWindowData();
  }, [platform, minutes]);

  return (
    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="var(--accent)" /> Sliding Window
        </h3>
        <select 
          className="select-input" 
          value={minutes} 
          onChange={(e) => setMinutes(e.target.value)}
          style={{ fontSize: '0.75rem' }}
        >
          <option value="1">Last 1 Min</option>
          <option value="5">Last 5 Mins</option>
          <option value="15">Last 15 Mins</option>
          <option value="60">Last 1 Hour</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
          <div className="kpi-label">Events</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: loading ? 'var(--text-secondary)' : 'white' }}>
            {windowMetrics?.totalEvents || 0}
          </div>
        </div>
        
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
          <div className="kpi-label">Revenue</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: loading ? 'var(--text-secondary)' : 'var(--success)' }}>
            ${(windowMetrics?.totalRevenue || 0).toLocaleString()}
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
          <div className="kpi-label">Active Users</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: loading ? 'var(--text-secondary)' : 'var(--warning)' }}>
            {windowMetrics?.uniqueUsers || 0}
          </div>
        </div>
      </div>
      
      <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <TrendingUp size={12} /> Live window analytics
      </p>
    </div>
  );
};

export default WindowMetrics;
