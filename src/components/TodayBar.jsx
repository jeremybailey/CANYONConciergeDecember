import React from 'react';

function TodayBar({ feedItems, activeFilter, onFilterChange, starredIds = new Set() }) {
  // Removed countdown state - it's now handled in FeedItem for system messages

  // Calculate counts
  // Active conversations = guest messages that have a threadId (have replies)
  const activeConversations = feedItems.filter(item => 
    item.type === 'guest' && item.threadId
  ).length;
  
  // Tasks: active (assigned) vs total
  const taskActiveCount = feedItems.filter(item => 
    item.type === 'task' && item.status !== 'completed'
  ).length;
  const taskTotalCount = feedItems.filter(item => 
    item.type === 'task'
  ).length;
  const taskValue = `${taskActiveCount}/${taskTotalCount}`;
  const taskBadgeCount = taskActiveCount; // Badge shows active count
  
  // Removed countdown logic - it's now displayed on the system message card itself

  // Count starred items - only count IDs that actually exist in the current feed
  // This prevents showing badges for starred items that no longer exist
  let starredCount = 0;
  if (starredIds && starredIds instanceof Set && starredIds.size > 0) {
    // Filter starredIds to only include IDs that exist in the current feed items
    const existingStarredIds = Array.from(starredIds).filter(id => 
      feedItems.some(item => item.id === id)
    );
    starredCount = existingStarredIds.length;
  }
  // Only show badge if there are actually starred items (count > 0)
  const starredBadge = starredCount > 0 ? starredCount : null;

  const metrics = [
    { 
      key: 'guests', 
      filterKey: 'guests',
      label: 'Messages', 
      value: '', // No value shown, just badge
      icon: 'bi-chat-dots',
      badge: activeConversations > 0 ? activeConversations : null
    },
    { 
      key: 'service', 
      filterKey: 'service',
      label: 'Tasks', 
      value: '', // No value shown, just badge
      icon: 'bi-check-square',
      badge: taskBadgeCount > 0 ? taskBadgeCount : null
    },
    { 
      key: 'system', 
      filterKey: 'system',
      label: 'System', 
      value: '', // No value shown, no badge
      icon: 'bi-lightning',
      badge: null // Countdown is now shown on the system message card itself
    },
    { 
      key: 'starred', 
      filterKey: 'starred',
      label: 'Starred', 
      value: '', // No value shown, just badge
      icon: 'bi-star', // Use outline star icon to match other filter chips
      badge: starredBadge
    }
  ];

  const handleClick = (metric) => {
    // Toggle filter: if already active, set to 'all', otherwise set to filter
    if (activeFilter === metric.filterKey) {
      onFilterChange('all');
    } else {
      onFilterChange(metric.filterKey);
    }
  };

  return (
    <div className="today-bar" style={{ 
      position: 'relative',
      padding: '0.375rem 1rem',
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
      scrollbarWidth: 'none', // Hide scrollbar on Firefox
      msOverflowStyle: 'none', // Hide scrollbar on IE/Edge
      zIndex: 10
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0.8) 40%, rgba(26, 26, 26, 0) 100%)',
        pointerEvents: 'none',
        zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-2rem',
        left: 0,
        right: 0,
        height: '2rem',
        background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.8) 0%, rgba(26, 26, 26, 0) 100%)',
        pointerEvents: 'none',
        zIndex: -1
      }}></div>
      {metrics.map(metric => {
        const isActive = activeFilter === metric.filterKey;
        return (
          <div
            key={metric.key}
            className="metric-item rounded-pill d-flex align-items-center"
            style={{
              cursor: 'pointer',
              padding: '0.5rem',
              transition: 'all 0.2s',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0, // Prevent items from shrinking
              whiteSpace: 'nowrap', // Prevent text wrapping
              backgroundColor: isActive 
                ? 'rgba(13, 110, 253, 0.25)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: isActive 
                ? '1px solid rgba(13, 110, 253, 0.3)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: isActive 
                ? '0 0 8px rgba(13, 110, 253, 0.3), 0 0 4px rgba(13, 110, 253, 0.2)' 
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%'
            }}
            onClick={() => handleClick(metric)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            <i 
              className={`bi ${metric.icon}`} 
              style={{ 
                fontSize: '1.25rem', 
                color: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
                fontWeight: 'bold'
              }}
            ></i>
            {metric.badge && (
              <span 
                className={`badge rounded-pill ${metric.key === 'starred' || metric.key === 'guests' ? 'bg-secondary' : 'bg-danger'}`}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  fontSize: '0.625rem',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  fontFamily: 'inherit',
                  lineHeight: '1',
                  backgroundColor: (metric.key === 'starred' || metric.key === 'guests') ? 'rgba(255, 255, 255, 0.2)' : undefined,
                  color: (metric.key === 'starred' || metric.key === 'guests') ? 'rgba(255, 255, 255, 0.9)' : undefined,
                  border: '2px solid #1a1a1a',
                  boxSizing: 'border-box'
                }}
              >
                {metric.badge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TodayBar;

