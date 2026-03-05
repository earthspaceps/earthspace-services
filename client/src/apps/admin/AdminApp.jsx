import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Briefcase, DollarSign, Settings, BarChart2,
    MessageSquare, Wrench, LogOut, Bell, TrendingUp, Package, CheckCircle,
    Clock, XCircle, UserCheck, UserX, Loader, Plus, Edit2, Trash2, Menu, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../shared/AuthContext';
import api from '../../shared/api';
import AdminComplaintsPage from './pages/ComplaintsAdminPage';

// ─── SIDEBAR NAV ───────────────────────────────────────────
const NAV = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/bookings', icon: Package, label: 'Bookings' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/technicians', icon: UserCheck, label: 'Technicians' },
    { to: '/admin/services', icon: Wrench, label: 'Services' },
    { to: '/admin/payments', icon: DollarSign, label: 'Payments' },
    { to: '/admin/complaints', icon: MessageSquare, label: 'Complaints' },
    { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
];
function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Close sidebar when clicking a link on mobile
    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-close" onClick={onClose}>
                <X size={20} />
            </button>
            <div className="sidebar-logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-primary-800), var(--color-primary-900))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                        <Briefcase size={20} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div style={{
                            fontWeight: 800,
                            color: '#fff',
                            fontSize: '1rem',
                            letterSpacing: '-0.02em',
                            lineHeight: 1
                        }}>EARTHSPACE</div>
                        <div style={{
                            fontSize: '0.65rem',
                            color: 'var(--color-primary-300)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                            marginTop: 4
                        }}>Services Portal</div>
                    </div>
                </div>
            </div>
            <nav className="sidebar-nav">
                {NAV.map(({ to, icon: Icon, label, exact }) => {
                    const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`sidebar-link ${active ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            <Icon size={18} className="nav-icon" />{label}
                        </Link>
                    );
                })}
            </nav>
            <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div className="avatar avatar-sm">{user?.name?.[0]}</div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>Super Admin</div>
                    </div>
                </div>
                <button className="sidebar-link w-full" style={{ color: '#f87171' }} onClick={() => { logout(); window.location.href = '/login'; }}>
                    <LogOut size={18} className="nav-icon" />Log Out
                </button>
            </div>
        </aside>
    );
}

// ─── DASHBOARD ─────────────────────────────────────────────
function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/analytics').then(({ data }) => setData(data.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;

    const stats = data?.stats || {};
    const monthly = data?.monthlyStats || [];

    const STAT_CARDS = [
        { label: 'Total Customers', value: stats.totalUsers, icon: Users, bg: '#dbeafe', color: '#2563eb' },
        { label: 'Verified Technicians', value: stats.totalTechnicians, icon: UserCheck, bg: '#dcfce7', color: '#16a34a' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Package, bg: '#ede9fe', color: '#7c3aed' },
        { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, bg: '#fef9c3', color: '#d97706' },
        { label: 'Active Bookings', value: stats.pendingBookings, icon: Clock, bg: '#ffedd5', color: '#ea580c' },
        { label: 'Completed', value: stats.completedBookings, icon: CheckCircle, bg: '#d1fae5', color: '#059669' },
    ];

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">Dashboard Overview</h2>
                <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', marginBottom: 28 }}>
                {STAT_CARDS.map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
                        <div><div className="stat-value">{s.value ?? '—'}</div><div className="stat-label">{s.label}</div></div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                <div className="card card-body">
                    <h4 style={{ marginBottom: 20 }}>Monthly Bookings</h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={monthly}>
                            <defs>
                                <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} fill="url(#bookingGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="card card-body">
                    <h4 style={{ marginBottom: 20 }}>Monthly Revenue (₹)</h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
                            <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// ─── LIVE BOOKINGS ──────────────────────────────────────────
function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [availableTechs, setAvailableTechs] = useState([]);
    const [assigningId, setAssigningId] = useState(null);
    const [selectedTech, setSelectedTech] = useState('');


    const load = () => {
        setLoading(true);
        const ep = filter === 'live' ? '/admin/bookings/live' : `/bookings${filter ? `?status=${filter}` : ''}`;
        api.get(ep).then(({ data }) => setBookings(data.data.bookings || [])).catch(console.error).finally(() => setLoading(false));
    };

    const loadTechs = () => {
        api.get('/users/technicians?status=verified').then(({ data }) => setAvailableTechs(data.data.technicians || [])).catch(console.error);
    };

    useEffect(() => { load(); loadTechs(); }, [filter]);

    const handleAssign = async (bookingId) => {
        if (!selectedTech) return;
        try {
            await api.post(`/bookings/${bookingId}/assign`, { technicianId: selectedTech });
            setAssigningId(null);
            setSelectedTech('');
            load();
        } catch (err) {
            alert(err.response?.data?.message || 'Assignment failed');
        }
    };

    const STATUS_BADGE = {
        pending: 'badge-warning', confirmed: 'badge-primary', assigned: 'badge-primary',
        on_the_way: 'badge-primary', started: 'badge-warning', completed: 'badge-success', cancelled: 'badge-danger',
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h2 className="page-title">Bookings Monitor</h2><p className="page-subtitle">Track all service bookings in real time.</p></div>
                <button className="btn btn-outline btn-sm" onClick={load}>↻ Refresh</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {[['', 'All'], ['live', 'Live'], ['pending', 'Pending'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([k, l]) => (
                    <button key={k} onClick={() => setFilter(k)} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`}>{l}</button>
                ))}
            </div>
            <div className="card table-wrapper">
                {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Service</th>
                                <th>Customer</th>
                                <th>Technician</th>
                                <th>Amount</th>
                                <th>Scheduled</th>
                                <th>Status</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No bookings found.</td></tr>
                            ) : bookings.map(b => (
                                <tr key={b.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--color-primary-700)' }}>#{b.bookingNumber}</td>
                                    <td>{b.serviceSnapshot?.name || b.service?.name || '—'}</td>
                                    <td>{b.customer?.name || '—'}<br /><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{b.customer?.phone}</span></td>
                                    <td>
                                        {assigningId === b.id ? (
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <select
                                                    className="form-control"
                                                    style={{ fontSize: '0.75rem', padding: '2px 4px', height: 'auto', minWidth: 120 }}
                                                    value={selectedTech}
                                                    onChange={e => setSelectedTech(e.target.value)}
                                                >
                                                    <option value="">Select Tech</option>
                                                    {availableTechs.map(t => (
                                                        <option key={t.id} value={t.id}>{t.user?.name}</option>
                                                    ))}
                                                </select>
                                                <button className="btn btn-primary btn-sm" style={{ padding: '2px 8px' }} onClick={() => handleAssign(b.id)}>✓</button>
                                                <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px' }} onClick={() => setAssigningId(null)}>✕</button>
                                            </div>
                                        ) : b.technician?.user?.name ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span>{b.technician.user.name}</span>
                                                {['pending', 'confirmed', 'assigned'].includes(b.status) && (
                                                    <button className="btn btn-link btn-sm" style={{ padding: 0 }} onClick={() => { setAssigningId(b.id); setSelectedTech(b.technicianId); }}>Change</button>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>Unassigned</span>
                                                <button className="btn btn-link btn-sm" style={{ padding: 0 }} onClick={() => setAssigningId(b.id)}>Assign</button>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ fontWeight: 700 }}>₹{b.serviceSnapshot?.basePrice || b.estimatedPrice || b.finalPrice || 0}</td>
                                    <td>{b.scheduledDate}<br /><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{b.scheduledTime}</span></td>
                                    <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-grey'}`}>{b.status?.replace('_', ' ')}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <span className={`badge ${b.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>{b.paymentStatus || 'pending'}</span>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{b.paymentMethod || 'cash'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// ─── USERS ─────────────────────────────────────────────────
function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('customer');

    useEffect(() => {
        setLoading(true);
        api.get(`/users?role=${roleFilter}&limit=50`).then(({ data }) => setUsers(data.data.users || [])).catch(console.error).finally(() => setLoading(false));
    }, [roleFilter]);

    const toggleStatus = async (id, current) => {
        await api.patch(`/users/${id}/toggle-status`);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !current } : u));
    };

    return (
        <div>
            <div className="page-header"><h2 className="page-title">User Management</h2></div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['customer', 'technician', 'admin'].map(r => (
                    <button key={r} onClick={() => setRoleFilter(r)} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline'}`} style={{ textTransform: 'capitalize' }}>{r}s</button>
                ))}
            </div>
            <div className="card table-wrapper">
                {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                    <table>
                        <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {users.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>No users found.</td></tr>
                                : users.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar avatar-sm">{u.name?.[0]}</div>{u.name}
                                        </td>
                                        <td>{u.phone}</td>
                                        <td>{u.email || '—'}</td>
                                        <td>{u.city || '—'}</td>
                                        <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                                        <td>
                                            <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(u.id, u.isActive)} style={{ fontSize: '0.75rem' }}>
                                                {u.isActive ? <><UserX size={12} /> Suspend</> : <><UserCheck size={12} /> Activate</>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// ─── TECHNICIANS ────────────────────────────────────────────
function TechniciansPage() {
    const [techs, setTechs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending_verification');

    useEffect(() => {
        setLoading(true);
        api.get(`/users/technicians?status=${statusFilter}`).then(({ data }) => setTechs(data.data.technicians || [])).catch(console.error).finally(() => setLoading(false));
    }, [statusFilter]);

    const verify = async (id, status) => {
        await api.patch(`/users/technicians/${id}/verify`, { status });
        setTechs(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div>
            <div className="page-header"><h2 className="page-title">Technician Verification</h2><p className="page-subtitle">Review and approve technician registrations.</p></div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[['pending_verification', 'Pending'], ['verified', 'Verified'], ['suspended', 'Suspended']].map(([k, l]) => (
                    <button key={k} onClick={() => setStatusFilter(k)} className={`btn btn-sm ${statusFilter === k ? 'btn-primary' : 'btn-outline'}`}>{l}</button>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {loading ? <div className="loading-center"><div className="spinner" /></div>
                    : techs.length === 0 ? <div className="card card-body text-center" style={{ padding: 40 }}><p>No technicians in this category.</p></div>
                        : techs.map(t => (
                            <div key={t.id} className="card" style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div className="avatar">{t.user?.name?.[0]}</div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{t.user?.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.user?.phone} · {t.user?.city}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                                {t.specializations?.join(', ') || 'No specializations'} · {t.experienceYears}yr exp
                                            </div>
                                        </div>
                                    </div>
                                    {statusFilter === 'pending_verification' && (
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-sm btn-danger" onClick={() => verify(t.id, 'suspended')}><XCircle size={14} /> Reject</button>
                                            <button className="btn btn-sm btn-success" onClick={() => verify(t.id, 'verified')}><CheckCircle size={14} /> Approve</button>
                                        </div>
                                    )}
                                    {statusFilter !== 'pending_verification' && (
                                        <span className={`badge ${t.status === 'verified' ? 'badge-success' : 'badge-danger'}`}>{t.status}</span>
                                    )}
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
}

// ─── SERVICES MANAGEMENT ───────────────────────────────────
function ServicesAdmin() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editPrice, setEditPrice] = useState('');

    useEffect(() => {
        api.get('/services/categories').then(({ data }) => setCategories(data.data.categories || [])).catch(console.error).finally(() => setLoading(false));
    }, []);

    const savePrice = async (id) => {
        await api.put(`/services/${id}`, { basePrice: parseFloat(editPrice) });
        setCategories(prev => prev.map(cat => ({
            ...cat,
            services: (cat.services || []).map(s => s.id === id ? { ...s, basePrice: parseFloat(editPrice) } : s)
        })));
        setEditingId(null);
    };

    return (
        <div>
            <div className="page-header"><h2 className="page-title">Services & Pricing</h2><p className="page-subtitle">Manage service catalog and prices.</p></div>
            {loading ? <div className="loading-center"><div className="spinner" /></div> : categories.map(cat => (
                <div key={cat.id} className="card" style={{ marginBottom: 16 }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--color-primary-700)', background: 'var(--color-primary-50)' }}>{cat.name}</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead><tr><th style={{ padding: '10px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Service</th><th>Duration</th><th>Price</th><th>Action</th></tr></thead>
                        <tbody>
                            {(cat.services || []).map(s => (
                                <tr key={s.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 20px' }}>{s.name}<br /><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.priceType}</span></td>
                                    <td style={{ padding: '12px 16px' }}>{s.durationMinutes}m</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {editingId === s.id ? (
                                            <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ width: 80, padding: '4px 8px', border: '1.5px solid var(--color-primary-400)', borderRadius: 6, fontSize: '0.875rem' }} />
                                        ) : (
                                            <span style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>₹{s.basePrice}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {editingId === s.id ? (
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-sm btn-primary" onClick={() => savePrice(s.id)}>Save</button>
                                                <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <button className="btn btn-sm btn-outline" onClick={() => { setEditingId(s.id); setEditPrice(s.basePrice); }}><Edit2 size={13} /> Edit</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

// ─── PAYMENTS ──────────────────────────────────────────────
function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/payments?limit=50').then(({ data }) => setPayments(data.data.payments || [])).catch(console.error).finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="page-header"><h2 className="page-title">Payments & Commission</h2></div>
            <div className="card table-wrapper">
                {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                    <table>
                        <thead><tr><th>Invoice</th><th>Booking</th><th>Customer</th><th>Amount</th><th>Commission</th><th>Tech Payout</th><th>Method</th><th>Status</th></tr></thead>
                        <tbody>
                            {payments.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>No payments found.</td></tr>
                                : payments.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{p.invoiceNumber}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{p.booking?.bookingNumber || '—'}</td>
                                        <td>{p.customer?.name || '—'}</td>
                                        <td style={{ fontWeight: 700 }}>₹{p.amount}</td>
                                        <td style={{ color: 'var(--color-danger)' }}>₹{p.commissionAmount || '—'}</td>
                                        <td style={{ color: 'var(--color-success)' }}>₹{p.technicianPayout || '—'}</td>
                                        <td><span className="badge badge-grey" style={{ textTransform: 'capitalize' }}>{p.method}</span></td>
                                        <td><span className={`badge ${p.status === 'completed' ? 'badge-success' : p.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{p.status}</span></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// ─── ANALYTICS PAGE ─────────────────────────────────────────
function AnalyticsPage() {
    const [data, setData] = useState(null);
    useEffect(() => { api.get('/admin/analytics').then(({ data }) => setData(data.data)).catch(console.error); }, []);
    const monthly = data?.monthlyStats || [];
    return (
        <div>
            <div className="page-header"><h2 className="page-title">Analytics & Reports</h2></div>
            <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                <div className="card card-body">
                    <h4 style={{ marginBottom: 20 }}>Booking Trends (6 months)</h4>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={monthly}>
                            <defs><linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} fill="url(#grad2)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="card card-body">
                    <h4 style={{ marginBottom: 20 }}>Revenue Trend (₹)</h4>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
                            <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// ─── TOP NAVBAR ──────────────────────────────────────────────
function TopNavbar({ title, onMenuClick }) {
    return (
        <div className="top-navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="mobile-toggle" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="badge badge-primary"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block', marginRight: 4 }} />Live</div>
            </div>
        </div>
    );
}

// ─── ADMIN APP SHELL ─────────────────────────────────────────
export default function AdminApp() {
    const location = useLocation();
    const PAGE_TITLES = {
        '/admin': 'Dashboard', '/admin/bookings': 'Bookings Monitor', '/admin/users': 'User Management',
        '/admin/technicians': 'Technician Verification', '/admin/services': 'Services & Pricing',
        '/admin/payments': 'Payments & Commission', '/admin/complaints': 'Complaints Management', '/admin/analytics': 'Analytics',
    };
    const title = PAGE_TITLES[location.pathname] || 'Admin';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content">
                {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
                <TopNavbar title={title} onMenuClick={() => setSidebarOpen(true)} />
                <div className="page-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/bookings" element={<BookingsPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/technicians" element={<TechniciansPage />} />
                        <Route path="/services" element={<ServicesAdmin />} />
                        <Route path="/payments" element={<PaymentsPage />} />
                        <Route path="/complaints" element={<AdminComplaintsPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
