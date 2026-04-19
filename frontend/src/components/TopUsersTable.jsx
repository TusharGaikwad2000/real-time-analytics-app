import React from 'react';
import { Award } from 'lucide-react';

const TopUsersTable = ({ users, platform }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>User ID</th>
            <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'right' }}>Total Purchase</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No purchases yet for {platform}
              </td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr key={user.userId} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {idx === 0 && <Award size={18} color="#d29922" />}
                  {user.userId}
                </td>
                <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: '600', color: '#3fb950' }}>
                  ${(user.totalAmount || 0).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopUsersTable;
