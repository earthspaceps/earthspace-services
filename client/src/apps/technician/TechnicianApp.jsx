import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Wrench, LayoutDashboard, Briefcase, DollarSign, History, User, LogOut, CheckCircle, XCircle, Truck, Play, Camera, Loader, Plus, Menu, X, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                border: '1px solid var(--glass-border)',
                padding: '32px',
                borderRadius: '24px',
                marginBottom: 32,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
                <div>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>WELCOME BACK, {user?.name?.split(' ')[0].toUpperCase()}! 👋</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Operational Dashboard v2.0</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.05)', padding: '12px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 900, letterSpacing: '0.1em' }}>STATUS</span>
                    <button
                        onClick={toggleAvailability}
                        disabled={toggling}
                        style={{
                            width: 52, height: 28, borderRadius: 14, border: 'none', cursor: toggling ? 'wait' : 'pointer', position: 'relative',
                            background: dash?.technician?.isAvailable ? '#22c55e' : 'rgba(255,255,255,.2)',
                            transition: 'all .3s',
                            boxShadow: dash?.technician?.isAvailable ? '0 0 15px rgba(34,197,94,0.4)' : 'none'
                        }}>
                        <div style={{
                            width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute',
                            top: 4, transition: 'left .3s',
                            left: dash?.technician?.isAvailable ? 28 : 4,
                        }} />
                    </button>
                    <span style={{ color: dash?.technician?.isAvailable ? '#22c55e' : '#fff', fontWeight: 900, fontSize: '0.85rem', width: 60, textAlign: 'center' }}>{dash?.technician?.isAvailable ? 'ONLINE' : 'OFFLINE'}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 32, gap: 24 }}>
                {[
                    { label: 'PENDING JOBS', value: dash?.pendingJobs || 0, icon: Briefcase, color: '#3b82f6' },
                    { label: 'COMPLETED', value: dash?.totalCompleted || 0, icon: CheckCircle, color: '#22c55e' },
                    { label: 'RATING', value: `${dash?.technician?.rating || '0.0'}`, icon: null, color: '#f59e0b' },
                    { label: 'TOTAL EARNINGS', value: `₹${dash?.totalEarnings || 0}`, icon: DollarSign, color: '#fff' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.05)', color: s.color, border: '1px solid rgba(255,255,255,0.08)' }}>
                            {s.icon ? <s.icon size={22} /> : <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>★</span>}
                        </div>
                        <div>
                            <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</div>
                            <div className="stat-label" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {jobs.length === 0 ? (
                <div className="card-body text-center" style={{ padding: 60 }}>
                    <Briefcase size={48} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 20px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No active missions found.</p>
                </div>
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) onClose();
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <button className="sidebar-close" onClick={onClose} style={{ color: '#fff' }}>
                <X size={20} />
            </button>
            <div className="sidebar-logo" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px #fff' }} />
                    {!isCollapsed && <div style={{ fontWeight: 1000, fontSize: '1.2rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>EPS <span style={{ fontWeight: 300, opacity: 0.5 }}>SERVICES</span></div>}
                </div>
            </div>
            <nav className="sidebar-nav" style={{ padding: '24px 12px' }}>
                {NAV.map(({ to, icon: Icon, label, exact }) => {
                    const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`sidebar-link ${active ? 'active' : ''}`}
                            onClick={handleLinkClick}
                            title={label}
                            style={{
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                                color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                                border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                                borderRadius: '14px',
                                padding: '16px',
                                marginBottom: 4,
                                textTransform: 'uppercase',
                                fontSize: '0.7rem',
                                fontWeight: active ? 900 : 700,
                                letterSpacing: '0.1em'
                            }}
                        >
                            <Icon size={18} style={{ opacity: active ? 1 : 0.6 }} />{!isCollapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>
            <div style={{ padding: isCollapsed ? '16px 8px' : '24px', borderTop: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,0.02)' }}>
                {!isCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div className="avatar avatar-sm" style={{ background: '#fff', color: '#000', fontWeight: 900, border: 'none' }}>{user?.name?.[0]}</div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-primary-400)', fontWeight: 800, letterSpacing: '0.1em' }}>ENGINEER</div>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div className="avatar avatar-sm" title={user?.name} style={{ background: '#fff', color: '#000', fontWeight: 900 }}>{user?.name?.[0]}</div>
                    </div>
                )}
                <button
                    className={`sidebar-link w-full ${isCollapsed ? 'justify-center' : ''}`}
                    onClick={() => { logout(); window.location.href = '/login'; }}
                    style={{
                        color: '#f87171',
                        background: 'rgba(248,113,113,0.05)',
                        border: '1px solid rgba(248,113,113,0.1)',
                        borderRadius: '12px',
                        padding: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        letterSpacing: '0.1em'
                    }}
                    title="Log Out"
                >
                    <LogOut size={16} />{!isCollapsed && <span>SIGN OUT</span>}
                </button>
            </div>
            <button
                className="sidebar-toggle-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{ color: 'rgba(255,255,255,0.3)' }}
            >
                {isCollapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> COLLAPSE</>}
            </button>
        </aside>
    );
}

function TopNavbar({ title, onMenuClick }) {
    return (
        <div className="top-navbar" style={{
            background: 'rgba(255,255,255,0.01)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            height: 70,
            padding: '0 32px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button className="mobile-toggle" onClick={onMenuClick} style={{ color: '#fff' }}>
                    <Menu size={24} />
                </button>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 1000, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{title}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="badge" style={{
                    background: 'rgba(34,197,94,0.1)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.2)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                    OPERATIONAL
                </div>
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
