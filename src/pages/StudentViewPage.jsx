import React, { useMemo, useState } from 'react';
import { Bell, RotateCcw, Search } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { CATEGORIES, DEPARTMENTS } from '../data/sampleData';
import { isNoticeExpired } from '../utils/dateUtils';
import NoticeCard from '../components/NoticeCard';
import EmptyState from '../components/EmptyState';

export default function StudentViewPage() {
  const { notices, settings, setActiveModalNotice } = useNotices();

  const [selectedDept, setSelectedDept] = useState(settings.defaultDepartment || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleNotices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notices.filter((notice) => {
      if (notice.status !== 'Published') return false;
      if (!settings.showExpiredInStudentView && isNoticeExpired(notice.expiryDate)) {
        return false;
      }
      if (selectedDept !== 'ALL' && notice.department !== selectedDept) {
        return false;
      }
      if (selectedCategory !== 'ALL' && notice.category !== selectedCategory) {
        return false;
      }
      if (query) {
        const hay = `${notice.title} ${notice.description} ${notice.department} ${notice.category} ${notice.postedBy}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [notices, settings.showExpiredInStudentView, selectedDept, selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedDept('ALL');
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  return (
    <div>
      <section className="student-banner">
        <div>
          <h2>{settings.collegeName} — Student Notice Board</h2>
          <p>
            Stay updated with verified department circulars, examination schedules, placement drives,
            and campus events.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255, 255, 255, 0.16)',
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <Bell size={20} />
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.1 }}>
              {visibleNotices.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#dbeafe' }}>Notices Available</div>
          </div>
        </div>
      </section>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={17} className="search-input-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by exam, placement company, workshop, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-control filter-select"
          aria-label="Filter by Department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.id} — {dept.name}
            </option>
          ))}
        </select>

        {(searchQuery || selectedDept !== 'ALL' || selectedCategory !== 'ALL') && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="chip-row" role="group" aria-label="Filter by Category">
        <button
          type="button"
          className={`filter-chip ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('ALL')}
        >
          All Categories
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleNotices.length === 0 ? (
        <EmptyState
          title="No notices found for your selection"
          description="Try selecting 'All Departments' or clearing your search keywords."
          actionLabel="View All Student Notices"
          onAction={handleReset}
        />
      ) : (
        <div className="notices-grid">
          {visibleNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              showAdminActions={false}
              onView={(item) => setActiveModalNotice(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
