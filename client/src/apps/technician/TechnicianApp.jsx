import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Wrench, LayoutDashboard, Briefcase, DollarSign, History, User, LogOut, CheckCircle, XCircle, Truck, Play, Camera, Loader, Plus, Menu, X } from 'lucide-react';
import { useAuth } from '../../shared/AuthContext';
import api from '../../shared/api';

// ── Technician Dashboard ──
function TechDashboard() {
    const { user } = useAuth();
    const [dash, setDash] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/users/technician/dashboard'),
            api.get('/bookings?limit=10'),
        ]).then(([d, b]) => {
            setDash(d.data.data);
            setJobs(b.data.data.bookings || []);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const [toggling, setToggling] = useState(false);
    const toggleAvailability = async () => {
        if (!dash?.technician || toggling) return;
        const newVal = !dash.technician.isAvailable;
        setToggling(true);
        try {
            const { data: res } = await api.patch('/users/technician/availability', { isAvailable: newVal });
            const serverAvailable = res.data?.isAvailable ?? newVal;
            setDash(prev => ({
                ...prev,
                technician: { ...prev.technician, isAvailable: serverAvailable }
            }));
        } catch (err) {
            console.error('Failed to toggle availability:', err);
            alert('Failed to update availability status.');
        } finally {
            setToggling(false);
        }
    };

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;

    return (
        <div>
            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 32px',
                marginBottom: 24,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                boxShadow: 'var(--shadow-md)'
            }}>
                <div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                    <p style={{ color: 'var(--color-primary-100)', marginTop: 4, opacity: 0.9 }}>Here's your dashboard for today.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.8)' }}>Availability</span>
                    <button
                        onClick={toggleAvailability}
                        disabled={toggling}
                        style={{
                            width: 52, height: 28, borderRadius: 14, border: 'none', cursor: toggling ? 'wait' : 'pointer', position: 'relative',
                            background: dash?.technician?.isAvailable ? '#22c55e' : 'rgba(255,255,255,.3)',
                            transition: 'all .3s',
                            opacity: toggling ? 0.7 : 1
                        }}>
                        <div style={{
                            width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute',
                            top: 4, transition: 'left .3s',
                            left: dash?.technician?.isAvailable ? 28 : 4,
                        }} />
                    </button>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', width: 45 }}>{dash?.technician?.isAvailable ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                {[
                    { label: 'Pending Jobs', value: dash?.pendingJobs || 0, icon: Briefcase, bg: '#dbeafe', color: '#2563eb' },
                    { label: 'Completed', value: dash?.totalCompleted || 0, icon: CheckCircle, bg: '#dcfce7', color: '#22c55e' },
                    { label: 'Rating', value: `${dash?.technician?.rating || '0.0'}★`, icon: null, bg: '#fef9c3', color: '#a16207' },
                    { label: 'Total Earnings', value: `₹${dash?.totalEarnings || 0}`, icon: DollarSign, bg: '#ede9fe', color: '#7c3aed' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                            {s.icon ? <s.icon size={22} /> : <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>★</span>}
                        </div>
                        <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                    </div>
                ))}
            </div>

            {/* Recent Jobs */}
            <div className="card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Recent Jobs</h4>
                    <Link to="/technician/jobs"><span style={{ fontSize: '0.85rem', color: 'var(--color-primary-600)', fontWeight: 600 }}>View All →</span></Link>
                </div>
                {jobs.length === 0 ? (
                    <div className="card-body text-center" style={{ padding: 40 }}><p>No jobs yet. Set yourself as online to receive bookings!</p></div>
                ) : (
                    <div>
                        {jobs.slice(0, 5).map(j => (
                            <div key={j.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{j.serviceSnapshot?.name || 'Service'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{j.scheduledDate} · #{j.bookingNumber}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--color-primary-600)', fontSize: '0.9rem' }}>₹{j.serviceSnapshot?.basePrice}</div>
                                    <span className={`badge ${j.status === 'completed' ? 'badge-success' : j.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>{j.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Job Management ──
function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});

    useEffect(() => {
        api.get('/bookings').then(({ data }) => setJobs(data.data.bookings || [])).catch(console.error).finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id, status) => {
        setUpdating(u => ({ ...u, [id]: true }));
        try {
            await api.patch(`/bookings/${id}/status`, { status });
            setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
        } catch (err) { console.error(err); }
        setUpdating(u => ({ ...u, [id]: false }));
    };

    const STATUS_FLOW = {
        assigned: { next: 'on_the_way', label: 'Start Journey', icon: Truck, color: '#06b6d4' },
        on_the_way: { next: 'started', label: 'Start Work', icon: Play, color: '#f97316' },
        started: { next: 'completed', label: 'Mark Complete', icon: CheckCircle, color: '#22c55e' },
    };

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;

    return (
        <div>
            <div className="page-header"><h2>My Jobs</h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Accept and manage your assigned bookings</p></div>
            {jobs.length === 0 ? (
                <div className="card card-body text-center" style={{ padding: 60 }}>
                    <Briefcase size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                    <h3>No jobs assigned yet</h3><p>Set yourself as online to receive new jobs.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {jobs.map(j => {
                        const flow = STATUS_FLOW[j.status];
                        const isUpdating = updating[j.id];
                        const isCash = j.paymentMethod === 'cash';
                        const isPaid = j.paymentStatus === 'completed';

                        const handleCollectCash = async (bookingId) => {
                            if (!window.confirm('Confirm that you have received the cash payment from the customer?')) return;
                            setUpdating(u => ({ ...u, [bookingId]: true }));
                            try {
                                await api.post(`/payments/${bookingId}/collect-cash`);
                                setJobs(prev => prev.map(job => job.id === bookingId ? { ...job, status: 'completed', paymentStatus: 'completed' } : job));
                                alert('Payment confirmed and job marked as completed.');
                            } catch (err) {
                                alert(err.response?.data?.message || 'Failed to confirm payment');
                            }
                            setUpdating(u => ({ ...u, [bookingId]: false }));
                        };

                        return (
                            <div key={j.id} className="card" style={{ overflow: 'hidden' }}>
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: j.status === 'assigned' ? 'var(--color-primary-50)' : '#fff' }}>
                                    <div>
                                        <span style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>#{j.bookingNumber}</span>
                                        <span className={`badge ml-2 ${j.status === 'completed' ? 'badge-success' : j.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}`} style={{ marginLeft: 8 }}>{j.status?.replace('_', ' ')}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary-600)' }}>₹{j.serviceSnapshot?.basePrice}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{j.scheduledDate}</div>
                                    </div>
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    <h4 style={{ marginBottom: 8 }}>{j.serviceSnapshot?.name}</h4>
                                    {j.customer && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: '0.875rem' }}>
                                            <div className="avatar avatar-sm">{j.customer.name?.[0]}</div>
                                            <span>{j.customer.name}</span>
                                            <a href={`tel:${j.customer.phone}`} style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>{j.customer.phone}</a>
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>📍 {j.addressSnapshot?.line1}, {j.addressSnapshot?.city}</div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {j.status === 'assigned' && (
                                            <>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateStatus(j.id, 'cancelled')} disabled={isUpdating}><XCircle size={14} /> Reject</button>
                                                <button className="btn btn-sm btn-primary" onClick={() => updateStatus(j.id, 'on_the_way')} disabled={isUpdating}>
                                                    {isUpdating ? <Loader size={12} /> : <><Truck size={14} /> Accept & Start Journey</>}
                                                </button>
                                            </>
                                        )}
                                        {flow && j.status !== 'assigned' && j.status !== 'completed' && j.status !== 'cancelled' && (
                                            <button className="btn btn-sm btn-primary" onClick={() => updateStatus(j.id, flow.next)} disabled={isUpdating} style={{ background: flow.color, boxShadow: 'none' }}>
                                                {isUpdating ? <Loader size={12} /> : <><flow.icon size={14} /> {flow.label}</>}
                                            </button>
                                        )}

                                        {j.status === 'started' && isCash && !isPaid && (
                                            <button className="btn btn-sm btn-success" onClick={() => handleCollectCash(j.id)} disabled={isUpdating} style={{ background: '#059669' }}>
                                                {isUpdating ? <Loader size={12} /> : <><DollarSign size={14} /> Confirm Cash Received</>}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ── Job Pool (New Requests) ──
function JobPoolPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState({});

    const loadPool = () => {
        setLoading(true);
        api.get('/bookings/pool').then(({ data }) => setJobs(data.data.bookings || [])).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => { loadPool(); }, []);

    const handleClaim = async (id) => {
        setClaiming(c => ({ ...c, [id]: true }));
        try {
            await api.post(`/bookings/${id}/claim`);
            setJobs(prev => prev.filter(j => j.id !== id));
            alert('Job claimed successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to claim job');
        }
        setClaiming(c => ({ ...c, [id]: false }));
    };

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;

    return (
        <div>
            <div className="page-header"><h2>Job Pool</h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Available service requests in your area</p></div>
            {jobs.length === 0 ? (
                <div className="card card-body text-center" style={{ padding: 60 }}>
                    <Plus size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                    <h3>No pending jobs</h3><p>Check back later for new requests.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {jobs.map(j => (
                        <div key={j.id} className="card" style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div>
                                    <h4 style={{ marginBottom: 4 }}>{j.serviceSnapshot?.name}</h4>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {j.customer?.city || 'Local Area'} · {j.scheduledDate} @ {j.scheduledTime}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--color-primary-700)', fontSize: '1.1rem' }}>₹{j.serviceSnapshot?.basePrice}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Est. Earnings</div>
                                </div>
                            </div>
                            <button className="btn btn-primary w-full" onClick={() => handleClaim(j.id)} disabled={claiming[j.id]}>
                                {claiming[j.id] ? <Loader size={12} className="animate-spin" /> : 'Claim This Job'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



// ── Earnings Page ──
function EarningsPage() {
    const [dash, setDash] = useState(null);
    useEffect(() => { api.get('/users/technician/dashboard').then(({ data }) => setDash(data.data)).catch(console.error); }, []);
    return (
        <div>
            <div className="page-header"><h2>Earnings</h2></div>
            <div className="earnings-highlight" style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.9rem', opacity: .8, marginBottom: 8 }}>Total Earnings</div>
                <div className="earnings-amount">₹{dash?.totalEarnings || 0}</div>
                <div style={{ marginTop: 8, opacity: .8, fontSize: '0.85rem' }}>{dash?.totalCompleted || 0} completed jobs</div>
            </div>
            <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {[['Jobs Completed', dash?.totalCompleted || 0], ['Average Rating', `${dash?.technician?.rating || 0}★`], ['Commission Rate', `${dash?.technician?.commissionRate || 20}%`]].map(([l, v]) => (
                    <div key={l} className="card card-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-700)', marginBottom: 4 }}>{v}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Technician App Shell ──
const NAV = [
    { to: '/technician', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/technician/jobs', icon: Briefcase, label: 'My Jobs' },
    { to: '/technician/pool', icon: Plus, label: 'Job Pool' },
    { to: '/technician/earnings', icon: DollarSign, label: 'Earnings' },
];

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) onClose();
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-close" onClick={onClose}>
                <X size={20} />
            </button>
            <div className="sidebar-logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-primary-800), var(--color-primary-900))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Briefcase size={20} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.01em' }}>EARTHSPACE</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-primary-300)', fontWeight: 600, textTransform: 'uppercase' }}>Technician</div>
                    </div>
                </div>
            </div>
            <nav className="sidebar-nav">
                {NAV.map(({ to, icon: Icon, label, exact }) => {
                    const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                    return (
                        <Link key={to} to={to} className={`sidebar-link ${active ? 'active' : ''}`} onClick={handleLinkClick}>
                            <Icon size={18} className="nav-icon" />{label}
                        </Link>
                    );
                })}
            </nav>
            <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div className="avatar avatar-sm">{user?.name?.[0]}</div>
                    <div><div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user?.name}</div><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>Technician</div></div>
                </div>
                <button className="sidebar-link w-full" onClick={() => { logout(); window.location.href = '/login'; }} style={{ color: '#f87171' }}>
                    <LogOut size={18} className="nav-icon" />Log Out
                </button>
            </div>
        </aside>
    );
}

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

export default function TechnicianApp() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const PAGE_TITLES = {
        '/technician': 'Dashboard', '/technician/jobs': 'My Jobs',
        '/technician/pool': 'Job Pool', '/technician/earnings': 'Earnings',
    };
    const title = PAGE_TITLES[location.pathname] || 'Technician';

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content">
                {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
                <TopNavbar title={title} onMenuClick={() => setSidebarOpen(true)} />
                <div className="page-content">
                    <Routes>
                        <Route path="/" element={<TechDashboard />} />
                        <Route path="/jobs" element={<JobsPage />} />
                        <Route path="/pool" element={<JobPoolPage />} />
                        <Route path="/earnings" element={<EarningsPage />} />
                        <Route path="*" element={<Navigate to="/technician" replace />} />

                    </Routes>
                </div>
            </div>
        </div>
    );
}
