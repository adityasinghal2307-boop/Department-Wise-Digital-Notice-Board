import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, tone = 'blue' }) {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
      {Icon && (
        <div className={`stat-icon-box ${tone}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
