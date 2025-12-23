import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const res = await fetch('/api/study_session/');
    const data = await res.json();
    setSessions(data);
  }

  useEffect(() => { fetchSessions() }, []);

  const endSession = async (id) => {
    await fetch(`/api/study_session/${id}/end/`, { method: 'POST' });
    fetchSessions();
  }

  return (
    <div className="container">
      <h2>Study Sessions</h2>
      <Link to="/study_session/start">Start New Session</Link>
      <table>
        <thead>
          <tr><th>Subject</th><th>Start</th><th>End</th><th>Goal</th><th></th></tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id}>
              <td><Link to={`/study_session/${s.id}`}>{s.study_subject}</Link></td>
              <td>{s.start_time}</td>
              <td>{s.end_time || '(ongoing)'}</td>
              <td>{s.goal_time}</td>
              <td>{!s.end_time ? <button onClick={() => endSession(s.id)}>End</button> : 'ended'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
