import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function formatDateTime(iso) {
  if (!iso) return null;
  // Accept ISO string or Date object
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}

export default function SessionList() {
  const [sessions, setSessions] = useState([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  const fetchSessions = async () => {
    const res = await fetch('/api/study_session/', {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    setSessions(data);
  }

  useEffect(() => { fetchSessions() }, []);

  const endSession = async (id) => {
    await fetch(`/api/study_session/${id}/end/`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    fetchSessions();
  }

  return (
    <div>
      <h1>Study Sessions</h1>
      <Link to="/start-session">Start New Session</Link>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Goal Time</th>
            <th>Actual Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td><Link to={`/session/${session.id}`}>{session.subject}</Link></td>
              <td>{formatDateTime(session.start_time)}</td>
              <td>{formatDateTime(session.end_time)}</td>
              <td>{session.goal_time}</td>
              <td>{session.actual_time}</td>
              <td>
                {!session.end_time && (
                  <button onClick={() => endSession(session.id)}>End Session</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
