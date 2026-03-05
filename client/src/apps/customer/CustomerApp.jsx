import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Briefcase, Home, Grid, Calendar, User, LogOut, Menu, X, MessageSquare, Edit2, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../shared/AuthContext';
import api from '../../shared/api';
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
    const { user, logout, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        city: user?.city || '',
        addressLine1: user?.addressLine1 || '',
        addressLine2: user?.addressLine2 || '',
        pincode: user?.pincode || '',
    });

    React.useEffect(() => {
        if (!isEditing && user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                city: user.city || '',
                addressLine1: user.addressLine1 || '',
                addressLine2: user.addressLine2 || '',
                pincode: user.pincode || '',
            });
        }
    }, [user, isEditing]);

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const { data } = await api.put('/users/profile', formData);
            setUser(data.data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile.' });
        }
        setLoading(false);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            logout();
            window.location.href = '/login';
        }
    };

    const InfoRow = ({ label, value, placeholder = 'Not set' }) => (
        <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>{label}</label>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, textTransform: 'uppercase', color: value ? '#000' : '#bbb' }}>{value || placeholder}</div>
        </div>
    );

    return (
        <div style={{ padding: '40px var(--content-padding)', maxWidth: 640, margin: '0 auto' }}>
            <div className="card card-body" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div className="avatar" style={{ background: '#111', color: '#fff', width: 64, height: 64, fontSize: '1.5rem', fontWeight: 900 }}>{user?.name?.[0]?.toUpperCase()}</div>
                        <div>
                            <h2 style={{ textTransform: 'uppercase', marginBottom: 4, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>{user?.name}</h2>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>CUSTOMER ACCOUNT</div>
                        </div>
                    </div>
                    {!isEditing && (
                        <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(true)}>
                            <Edit2 size={14} style={{ marginRight: 6 }} /> EDIT
                        </button>
                    )}
                </div>

                {message.text && <div className={`alert alert-${message.type} mb-6`} style={{ fontSize: '0.8rem', fontWeight: 700 }}>{message.text}</div>}

                {isEditing ? (
                    <>
                        <div className="grid-2" style={{ gap: 24, marginBottom: 32 }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>FULL NAME</label>
                                <input className="form-control architectural-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>EMAIL ADDRESS</label>
                                <input className="form-control architectural-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>PHONE NUMBER</label>
                                <input className="form-control architectural-input" value={user?.phone} disabled style={{ background: '#f8f8f8', cursor: 'not-allowed' }} title="Phone cannot be changed" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>CITY</label>
                                <input className="form-control architectural-input" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ marginBottom: 40 }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: 20, letterSpacing: '0.1em', color: '#000', borderBottom: '2px solid #000', display: 'inline-block' }}>SERVICE ADDRESS</h4>
                            <div className="form-group mb-4">
                                <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>ADDRESS LINE 1</label>
                                <input className="form-control architectural-input" placeholder="House/Flat No, Building Name" value={formData.addressLine1} onChange={e => setFormData({ ...formData, addressLine1: e.target.value })} />
                            </div>
                            <div className="form-group mb-4">
                                <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>ADDRESS LINE 2</label>
                                <input className="form-control architectural-input" placeholder="Landmark, Area" value={formData.addressLine2} onChange={e => setFormData({ ...formData, addressLine2: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>PINCODE</label>
                                <input className="form-control architectural-input" placeholder="6-digit PIN" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <button className="btn btn-primary" style={{ flex: 2, padding: '16px' }} onClick={handleSave} disabled={loading}>
                                {loading ? 'SAVING...' : 'SAVE CHANGES'}
                            </button>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>
                                CANCEL
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid-2" style={{ gap: 24, marginBottom: 32 }}>
                            <InfoRow label="FULL NAME" value={user?.name} />
                            <InfoRow label="EMAIL ADDRESS" value={user?.email} />
                            <InfoRow label="PHONE NUMBER" value={user?.phone} />
                            <InfoRow label="CITY" value={user?.city} />
                        </div>

                        <div style={{ marginBottom: 40 }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: 20, letterSpacing: '0.1em', color: '#000', borderBottom: '2px solid #000', display: 'inline-block' }}>SERVICE ADDRESS</h4>
                            <InfoRow label="ADDRESS LINE 1" value={user?.addressLine1} />
                            <InfoRow label="ADDRESS LINE 2" value={user?.addressLine2} />
                            <InfoRow label="PINCODE" value={user?.pincode} />
                        </div>

                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" style={{ borderColor: '#ff4444', color: '#ff4444', padding: '12px 24px' }} onClick={handleLogout}>
                                <LogOut size={16} style={{ marginRight: 8 }} /> SIGN OUT
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function CustomerApp() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Top Navbar */}
            <nav className={`customer-navbar ${isScrolled ? 'shrunk' : ''}`} style={{
                background: 'var(--bg-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 var(--content-padding)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
            }}>
                <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="/logo.png" alt="EarthSpace" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
                    <span className="brand-name" style={{ fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#fff', fontSize: '1rem' }}>Services</span>
                </div>

                {/* Desktop Nav - Hidden on mobile via index.css .nav-links rule or inline */}
                <div className="nav-links" style={{ display: 'flex', gap: 24 }}>
                    {NAV_LINKS.map(({ to, icon: Icon, label, exact }) => {
                        const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                        return (
                            <Link key={to} to={to} className={`nav-link ${active ? 'active' : ''}`} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Icon size={14} />{label}
                            </Link>
                        );
                    })}
                </div>

                {/* Navbar Actions */}
                <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="avatar avatar-sm" style={{ cursor: 'default', background: '#fff', color: '#000' }}>{user?.name?.[0]?.toUpperCase()}</div>
                </div>
            </nav>

            {/* Routes */}
            <div className="main-content" style={{ paddingBottom: 80 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/bookings" element={<BookingHistoryPage />} />
                    <Route path="/complaints" element={<ComplaintsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="/customer" replace />} />
                </Routes>
            </div>

            {/* Mobile Bottom Nav - Hidden on desktop via index.css if implemented, or here */}
            <div className="mobile-bottom-nav" style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#fff', borderTop: '1px solid #000',
                display: 'none', padding: '8px 0 4px', zIndex: 2000,
                boxShadow: '0 -4px 20px rgba(0,0,0,.1)'
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
            <style>{`
                @media (max-width: 768px) {
                    .customer-navbar .nav-links { display: none !important; }
                    .mobile-bottom-nav { display: flex !important; }
                }
            `}</style>
        </div>
    );
}
