import React, { useState, useEffect, useRef } from 'react';
import './FocusMode.css';
import { useToast } from '../../context/ToastContext';

const FocusMode = () => {
    const [isActive, setIsActive] = useState(false);
    const [paused, setPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 min in seconds
    const [subject, setSubject] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const { addToast } = useToast();

    const intervalRef = useRef(null);

    // Timer Logic
    useEffect(() => {
        if (isActive && !paused && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer Finished
            clearInterval(intervalRef.current);
            setIsActive(false);
            if (sessionId) endSession(sessionId);
            addToast("Focus Session Complete! Great Job! 🎉", "success");
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, paused, timeLeft, sessionId]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleStart = async () => {
        if (!subject.trim()) {
            addToast("Please enter a subject to focus on.", "info");
            return;
        }

        // Create Session API Call
        const token = localStorage.getItem('token');
        if (!token) {
            addToast("You must be logged in to track sessions.", "error");
            return;
        }

        try {
            // Calculate goal time format HH:MM:SS
            const goalMins = Math.floor(timeLeft / 60);
            const goalTime = `00:${String(goalMins).padStart(2, '0')}:00`;

            const res = await fetch('/api/study_session/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: subject,
                    goal_time: goalTime
                })
            });

            if (res.ok) {
                const data = await res.json();
                setSessionId(data.id);
                setIsActive(true);
                setPaused(false);
                addToast("Focus session started! Good luck. 🚀", "info");
            } else {
                addToast("Failed to start session. Please try again.", "error");
            }
        } catch (err) {
            console.error("Error starting session", err);
            addToast("Network error occurred.", "error");
        }
    };

    const handlePause = () => {
        setPaused(!paused);
    };

    const handleStop = async () => {
        setIsActive(false);
        setPaused(false);
        clearInterval(intervalRef.current);
        setTimeLeft(25 * 60); // Reset

        if (sessionId) {
            await endSession(sessionId);
            setSessionId(null);
            addToast("Session stopped early.", "info");
        }
    };

    const endSession = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`/api/study_session/${id}/end/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Error ending session", err);
        }
    };

    return (
        <div className="focus-container">
            <div className="focus-bg-css"></div>

            <div className="focus-content">
                <div className="focus-header">
                    <h1>Focus Timer</h1>
                </div>

                {!isActive && !sessionId ? (
                    <div className="focus-input-group">
                        <label>What are you working on?</label>
                        <input
                            type="text"
                            className="focus-input"
                            placeholder="e.g., Study History, Design Project..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <label>Duration (Minutes)</label>
                        <input
                            type="number"
                            className="focus-input"
                            value={Math.floor(timeLeft / 60)}
                            onChange={(e) => setTimeLeft(e.target.value * 60)}
                            min="1"
                        />
                    </div>
                ) : (
                    <div className="focus-active-status">
                        <h3>{subject}</h3>
                    </div>
                )}

                <div className="timer-display">
                    {formatTime(timeLeft)}
                </div>

                <div className="timer-controls">
                    {!isActive ? (
                        <button className="control-btn btn-start" onClick={handleStart}>
                            {paused ? "Resume" : "Start Focus"}
                        </button>
                    ) : (
                        <>
                            <button className="control-btn btn-pause" onClick={handlePause}>
                                {paused ? "Resume" : "Pause"}
                            </button>
                            <button className="control-btn btn-stop" onClick={handleStop}>
                                Stop
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
