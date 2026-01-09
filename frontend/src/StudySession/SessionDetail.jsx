import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function formatDateTime(iso) {
  if (!iso) return null;
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

export default function SessionDetail(){
  const { id } = useParams();
  const [session, setSession] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  useEffect(()=>{
    fetch(`/api/study_session/${id}/`, {
      headers: getAuthHeader(),
    }).then(r=>r.json()).then(setSession);
  }, [id]);

  if (!session) return <div>Loading...</div>;

  return (
    <div>
      <h1>{session.subject}</h1>
      <p><strong>Start Time:</strong> {formatDateTime(session.start_time)}</p>
      <p><strong>End Time:</strong> {formatDateTime(session.end_time)}</p>
      <p><strong>Goal Time:</strong> {session.goal_time}</p>
      <p><strong>Actual Time:</strong> {session.actual_time}</p>
      <Link to="/session-list">Back to Sessions</Link>
    </div>
  );
}
