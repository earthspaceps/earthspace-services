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
        <div style={{ padding: '32px var(--content-padding)', maxWidth: 480, margin: '0 auto' }}>
            <div className="card card-body text-center" style={{ marginBottom: 16 }}>
                <div className="avatar avatar-lg" style={{ margin: '0 auto 12px' }}>{user?.name?.[0]?.toUpperCase()}</div>
                <h3>{user?.name}</h3>
                <p className="text-sm">{user?.email || user?.phone}</p>
                <span className="badge badge-primary mt-2">{user?.role?.toUpperCase()}</span>
            </div>
            <button className="btn btn-danger btn-block" onClick={() => { if (window.confirm('Log out?')) { logout(); window.location.href = '/login'; } }}>
                <LogOut size={16} /> Log Out
            </button>
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
                        <Link key={to} to={to} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: active ? 'var(--color-primary-900)' : 'var(--text-secondary)', textDecoration: 'none', padding: '4px 0' }}>
                            <Icon size={20} />
                            <span style={{ fontSize: '0.65rem', fontWeight: active ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Bottom nav spacer */}
            <div style={{ height: 64 }} />
        </div>
    );
}
