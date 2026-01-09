import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartSession(){
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  const submit = async (e) => {
    e.preventDefault();
    const hh = String(hours).padStart(2,'0');
    const mm = String(minutes).padStart(2,'0');
    const goal = `${hh}:${mm}:00`;
    await fetch('/api/study_session/', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        subject,
        goal_time: goal
      })
    }).then(r => r.json()).then(() => {
      navigate('/session-list');
    });
  }

  return (
    <div>
      <h1>Start Study Session</h1>
      <form onSubmit={submit}>
        <div>
          <label>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} required />
        </div>
        <div>
          <label>Goal Hours</label>
          <input type="number" min="0" value={hours} onChange={e=>setHours(e.target.value)} />
          <label>Goal Minutes</label>
          <input type="number" min="0" max="59" value={minutes} onChange={e=>setMinutes(e.target.value)} />
        </div>
        <button type="submit">Start</button>
      </form>
    </div>
  )
}
