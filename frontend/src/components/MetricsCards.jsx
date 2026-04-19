import React, { memo } from 'react';
import { Activity, MousePointer2, ShoppingCart, UserCheck, BarChart3 } from 'lucide-react';
import Skeleton from './Skeleton';

const MetricsCards = memo(({ metrics, loading }) => {
  const cards = [
    {
      label: 'Total Events',
      value: metrics?.totalEvents,
      icon: <Activity color="#58a6ff" />,
      color: '#58a6ff'
    },
    {
      label: 'Total Revenue',
      value: metrics?.totalRevenue !== undefined ? `$${(metrics.totalRevenue).toLocaleString()}` : undefined,
      icon: <BarChart3 color="#3fb950" />,
      color: '#3fb950'
    },
    {
      label: 'Unique Users',
      value: metrics?.uniqueUsers,
      icon: <UserCheck color="#d29922" />,
      color: '#d29922'
    },
    {
      label: 'Purchases',
      value: metrics?.actionBreakdown?.purchase,
      icon: <ShoppingCart color="#f85149" />,
      color: '#f85149'
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="glass-card animate-fade-in" 
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div className="kpi-label">{card.label}</div>
              {loading && !metrics ? (
                <Skeleton className="skeleton-text" style={{ width: '80%', height: '2rem', marginTop: '0.5rem' }} />
              ) : (
                <div className="kpi-value" style={{ color: card.color }}>
                  {card.value !== undefined ? card.value : '0'}
                </div>
              )}
            </div>
            <div style={{ background: `${card.color}15`, padding: '0.75rem', borderRadius: '12px' }}>
              {React.cloneElement(card.icon, { size: 24 })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default MetricsCards;
