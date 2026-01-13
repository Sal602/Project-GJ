import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Skeleton from '../../components/UI/Skeleton';
import { useToast } from '../../context/ToastContext';

const Dashboard = () => {
    const [user, setUser] = useState({ username: 'Guest' });
    const [stats, setStats] = useState({
        todayHours: 0,
        totalSessions: 0,
        tasksToday: 0
    });
    const [recentSessions, setRecentSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Mimic Network Delay to show Skeleton
            // await new Promise(r => setTimeout(r, 800)); 

            const res = await fetch('/api/study_session/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                processStats(data);
            } else {
                addToast("Failed to load sessions.", "error");
            }
        } catch (err) {
            console.error("Failed to fetch sessions", err);
            addToast("Network error loading dashboard.", "error");
        } finally {
            setLoading(false);
        }
    };

    const processStats = (sessions) => {
        const today = new Date().toISOString().split('T')[0];
        let hoursToday = 0;
        let countToday = 0;

        sessions.forEach(session => {
            const sessionDate = session.start_time ? session.start_time.split('T')[0] : null;
            if (sessionDate === today) {
                countToday++;
                if (session.actual_time) {
                    hoursToday += parseDuration(session.actual_time);
                }
            }
        });

        setStats({
            todayHours: (hoursToday).toFixed(1),
            totalSessions: sessions.length,
            tasksToday: countToday
        });

        setRecentSessions(sessions.slice(0, 3));
    };

    // Helper to parse "HH:MM:SS"
    const parseDuration = (durationStr) => {
        if (!durationStr) return 0;
        const parts = durationStr.split(':');
        if (parts.length === 3) {
            return Number(parts[0]) + Number(parts[1]) / 60 + Number(parts[2]) / 3600;
        }
        return 0;
    };

    const formatTime = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="dashboard-container">
            {/* Greeting */}
            <div className="greeting-card">
                <div className="greeting-text">
                    <h1>Good Morning, {user.username}</h1>
                    <p>You have {loading ? '...' : stats.tasksToday} tasks tracked for today.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ color: '#72d5b6' }}>⏱️</div>
                        <span className="stat-label">Focus Today</span>
                    </div>
                    <div className="stat-value">
                        {loading ? <Skeleton width="60px" height="32px" /> : `${stats.todayHours}h`}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ color: '#f6ad55' }}>🔥</div>
                        <span className="stat-label">Total Sessions</span>
                    </div>
                    <div className="stat-value">
                        {loading ? <Skeleton width="40px" height="32px" /> : stats.totalSessions}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ color: '#fc8181' }}>📅</div>
                        <span className="stat-label">Streak</span>
                    </div>
                    <div className="stat-value">3 Days</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <Link to="/focus" className="action-btn">
                    ▶ Start Focus Timer
                </Link>
                <Link to="/study_session" className="action-btn secondary">
                    View History
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <div className="section-header">
                    <h3 className="section-title">Recent Activity</h3>
                    <Link to="/study_session" className="view-all">View All</Link>
                </div>

                <div className="task-list">
                    {loading ? (
                        <>
                            <Skeleton height="60px" borderRadius="16px" />
                            <Skeleton height="60px" borderRadius="16px" />
                        </>
                    ) : (
                        recentSessions.length > 0 ? recentSessions.map(session => (
                            <div key={session.id} className="task-item">
                                <div className="task-info">
                                    <div className="task-checkbox"></div>
                                    <div>
                                        <div className="task-name">{session.subject || 'Untitled Session'}</div>
                                        <div className="task-sub">{session.goal_time ? `Goal: ${session.goal_time}` : 'No goal set'}</div>
                                    </div>
                                </div>
                                <div className="task-time">
                                    {formatTime(session.start_time)}
                                </div>
                            </div>
                        )) : <p>No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
