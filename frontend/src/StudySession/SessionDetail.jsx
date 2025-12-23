import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
      <p>Start: {session.start_time}</p>
      <p>End: {session.end_time || '(ongoing)'}</p>
      <p>Total: {session.total_time || '(not available)'}</p>
      <p>Goal: {session.goal_time}</p>
      <p>Goal Passed: {String(session.goal_passed)}</p>
      <Link to="/study_session">Back</Link>
    </div>
  )
}
