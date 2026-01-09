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
          ))}
        </tbody>
      </table>
    </div>
  )
}
