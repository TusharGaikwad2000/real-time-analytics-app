import React, { useState } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

const EventForm = ({ platform, onEventSuccess }) => {
  const [formData, setFormData] = useState({
    userId: 'u' + Math.floor(Math.random() * 1000),
    action: 'view',
    amount: 0
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    const eventPayload = {
      ...formData,
      platform,
      amount: formData.action === 'purchase' ? parseInt(formData.amount) : 0,
      timestamp: Math.floor(Date.now() / 1000)
    };

    try {
      await analyticsApi.ingestEvent(eventPayload);
      setStatus({ type: 'success', message: 'Event ingested!' });
      onEventSuccess();
      // Reset some fields
      setFormData(prev => ({ ...prev, userId: 'u' + Math.floor(Math.random() * 1000), amount: 0 }));
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Ingestion failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Simulate Event</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label className="kpi-label">User ID (Manual)</label>
          <input 
            type="text" 
            className="select-input" 
            style={{ width: '100%' }}
            value={formData.userId}
            onChange={(e) => setFormData({...formData, userId: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="kpi-label">Action Type</label>
          <select 
            className="select-input" 
            style={{ width: '100%' }}
            value={formData.action}
            onChange={(e) => setFormData({...formData, action: e.target.value})}
          >
            <option value="view">View</option>
            <option value="click">Click</option>
            <option value="add_to_cart">Add to Cart</option>
            <option value="purchase">Purchase</option>
          </select>
        </div>

        {formData.action === 'purchase' && (
          <div>
            <label className="kpi-label">Amount ($)</label>
            <input 
              type="number" 
              className="select-input" 
              style={{ width: '100%' }}
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              min="0"
              required
            />
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {loading ? 'Sending...' : <><Send size={18} /> Ingest Event</>}
        </button>
      </form>

      {status.type && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          borderRadius: '6px', 
          background: status.type === 'success' ? 'var(--success)20' : 'var(--error)20',
          color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.message}
        </div>
      )}
    </div>
  );
};

export default EventForm;
