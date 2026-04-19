import React from 'react';
import { MousePointer2, ShoppingCart, UserCheck, BarChart3 } from 'lucide-react';

const MetricsCards = ({ metrics }) => {
  const cards = [
    {
      label: 'Total Events',
      value: metrics?.totalEvents || 0,
      icon: <Activity color="#58a6ff" />,
      color: '#58a6ff'
    },
    {
      label: 'Total Revenue',
      value: `$${(metrics?.totalRevenue || 0).toLocaleString()}`,
      icon: <BarChart3 color="#3fb950" />,
      color: '#3fb950'
    },
    {
      label: 'Unique Users',
      value: metrics?.uniqueUsers || 0,
      icon: <UserCheck color="#d29922" />,
      color: '#d29922'
    },
    {
      label: 'Purchases',
      value: metrics?.actionBreakdown?.purchase || 0,
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
            <div>
              <div className="kpi-label">{card.label}</div>
              <div className="kpi-value" style={{ color: card.color }}>{card.value}</div>
            </div>
            <div style={{ background: `${card.color}15`, padding: '0.75rem', borderRadius: '12px' }}>
              {React.cloneElement(card.icon, { size: 24 })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;

// Activity icon was missing in import, adding it here manually for the cloneElement logic
import { Activity } from 'lucide-react';
