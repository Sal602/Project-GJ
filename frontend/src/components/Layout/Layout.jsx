import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './Layout.css';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="brand">
                    <h2>PomoFight 🥊</h2>
                </div>

                <nav className="nav-menu">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span>📊 Dashboard</span>
                    </NavLink>
                    <NavLink to="/focus" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span>⚔️ Focus Fight</span>
                    </NavLink>
                    <NavLink to="/study_session" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span>📜 Battle Log</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    {/* Simplified footer now that logout/theme are in profile, but can keep quick links if needed. 
                        Let's keep it clean. */}
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="left-actions">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            ☰
                        </button>
                    </div>

                    <div className="right-actions">
                        <div className="user-profile-container">
                            <div className="avatar" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                U
                            </div>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-header">
                                        <strong>User Name</strong>
                                        <div className="xp-bar">
                                            <div className="xp-fill" style={{ width: '60%' }}></div>
                                        </div>
                                        <small>1200 / 2000 XP</small>
                                    </div>
                                    <hr />
                                    <button onClick={toggleTheme} className="dropdown-item">
                                        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                                    </button>
                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Overlay for mobile when sidebar is open */}
                {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
