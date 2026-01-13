import React, { useEffect, useState } from 'react';
import './SessionList.css';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/UI/Skeleton';

// Helper for relative time (e.g. "2 hours ago") vs exact date
function formatRelativeDate(iso) {
  if (!iso) return '-';
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

function getStatus(session) {
  if (!session.end_time) return 'active';
  // Logic for 'completed' vs 'aborted' could depend on if actual time >= goal time
  // For now, if it has an end time, it's completed or stopped.
  return 'completed';
}

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/study_session/', {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        // Sort by start_time desc
        data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        setSessions(data);
      } else {
        addToast("Failed to load history", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSessions() }, []);

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Battle Log</h1>
        <p>Review your past fights and training sessions.</p>
      </div>

      <div className="history-list">
        {loading ? (
          <>
            <Skeleton height="80px" borderRadius="16px" />
            <Skeleton height="80px" borderRadius="16px" />
            <Skeleton height="80px" borderRadius="16px" />
          </>
        ) : (
          sessions.length > 0 ? (
            <div className="table-responsive">
              <div className="table-header-row">
                <div className="col">Subject</div>
                <div className="col">Date</div>
                <div className="col">Duration</div>
                <div className="col">Status</div>
              </div>
              {sessions.map(session => {
                const status = getStatus(session);
                return (
                  <div key={session.id} className="table-row">
                    <div className="col subject">
                      <strong>{session.subject || 'Unknown Mission'}</strong>
                    </div>
                    <div className="col date">
                      {formatRelativeDate(session.start_time)}
                    </div>
                    <div className="col duration">
                      {session.actual_time || session.goal_time || '--'}
                    </div>
                    <div className="col status">
                      <span className={`badge ${status}`}>
                        {status === 'active' ? 'In Progress' : 'Finished'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No battles recorded yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
