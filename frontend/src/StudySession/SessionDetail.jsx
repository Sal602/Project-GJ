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

  useEffect(()=>{
    fetch(`/api/study_session/${id}/`).then(r=>r.json()).then(setSession)
  },[id]);

  if(!session) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Session: {session.study_subject}</h2>
      <p>Date: {session.date}</p>
      <p>Start: {formatDateTime(session.start_time)}</p>
      <p>End: {session.end_time ? formatDateTime(session.end_time) : '(ongoing)'}</p>
      <p>Total: {session.total_time || '(not available)'}</p>
      <p>Goal: {session.goal_time}</p>
      <p>Goal Passed: {String(session.goal_passed)}</p>
      <Link to="/study_session">Back</Link>
    </div>
  )
}
