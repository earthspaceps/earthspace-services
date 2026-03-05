import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Briefcase, Home, Grid, Calendar, User, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../../shared/AuthContext';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import ComplaintsPage from './pages/ComplaintsPage';

const NAV_LINKS = [
    { to: '/customer', icon: Home, label: 'Home', exact: true },
    { to: '/customer/services', icon: Grid, label: 'Services' },
    { to: '/customer/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/customer/complaints', icon: MessageSquare, label: 'Complaints' },
    { to: '/customer/profile', icon: User, label: 'Profile' },
];

function ProfilePage() {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: '80px var(--content-padding)', maxWidth: 640, margin: '0 auto' }}>
            <div className="card card-body" style={{ marginBottom: 40, borderRadius: 0, border: '1px solid #000', padding: '60px 40px', background: '#fff', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 40 }}>
                    <div className="avatar" style={{ background: '#000', color: '#fff', borderRadius: 0, width: 80, height: 80, fontSize: '2rem', fontWeight: 900 }}>{user?.name?.[0]?.toUpperCase()}</div>
                    <div>
                        <h2 style={{ textTransform: 'uppercase', marginBottom: 4, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{user?.name}</h2>
                        <div style={{ color: '#666', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>{user?.email?.toUpperCase() || user?.phone}</div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #000', paddingTop: 32 }}>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#000', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>ACCOUNT ROLE</label>
                        <div style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase' }}>{user?.role}</div>
                    </div>
                    <div>
                        <button
                            className="btn btn-primary"
                            style={{
                                borderRadius: 0,
                                padding: '16px 40px',
                                background: '#000',
                                color: '#fff',
                                border: '1px solid #000',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.color = '#000';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#000';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onClick={() => { if (window.confirm('Log out from EarthSpace?')) { logout(); window.location.href = '/login'; } }}
                        >
                            TERMINATE SESSION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CustomerApp() {
    const { user } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Top Navbar */}
            <nav className="customer-navbar" style={{ background: 'var(--bg-dark)' }}>
                <div className="brand">
                    <img src="/logo.png" alt="EarthSpace" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
                    <span className="brand-name" style={{ fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#fff', fontSize: '1rem' }}>Services</span>
                </div>

                {/* Desktop Nav */}
                <div className="nav-links">
                    {NAV_LINKS.map(({ to, icon: Icon, label, exact }) => {
                        const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                        return (
                            <Link key={to} to={to} className={`nav-link ${active ? 'active' : ''}`}>
                                <Icon size={15} style={{ display: 'inline', marginRight: 4 }} />{label}
                            </Link>
                        );
                    })}
                </div>

                {/* Navbar Actions */}
                <div className="navbar-actions">
                    <div className="avatar avatar-sm" style={{ cursor: 'default' }}>{user?.name?.[0]?.toUpperCase()}</div>
                    <button className="btn btn-ghost btn-sm" style={{ display: 'none', color: '#fff' }} id="mobile-menu-toggle" onClick={() => setMenuOpen(v => !v)}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/book" element={<BookingPage />} />
                <Route path="/bookings" element={<BookingHistoryPage />} />
                <Route path="/complaints" element={<ComplaintsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/customer" replace />} />
            </Routes>

            {/* Mobile Bottom Nav */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#fff', borderTop: '1px solid var(--border-color)',
                display: 'flex', padding: '8px 0 4px', zIndex: 200,
                boxShadow: '0 -4px 20px rgba(0,0,0,.08)'
            }}>
                {NAV_LINKS.map(({ to, icon: Icon, label, exact }) => {
                    const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                    return (
                        <Link key={to} to={to} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: active ? '#000' : '#bbb', textDecoration: 'none', padding: '8px 0' }}>
                            <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                            <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Bottom nav spacer */}
            <div style={{ height: 64 }} />
        </div>
    );
}
