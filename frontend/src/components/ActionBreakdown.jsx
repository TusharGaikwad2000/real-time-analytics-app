import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Skeleton from './Skeleton';

const COLORS = ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#8a63d2'];

const ActionBreakdown = memo(({ data, loading }) => {
  if (loading && !data) {
    return (
      <div style={{ padding: '10px 0' }}>
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <Skeleton className="skeleton-text" style={{ width: '100px', marginBottom: '8px' }} />
            <Skeleton className="skeleton-text" style={{ height: '24px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No event data for this platform
      </div>
    );
  }

  const chartData = Object.keys(data).map(key => ({
    name: key.replace(/_/g, ' ').toUpperCase(),
    value: data[key]
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#8b949e', fontSize: 12 }}
            width={100}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ background: '#161b22', borderColor: '#30363d', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default ActionBreakdown;
