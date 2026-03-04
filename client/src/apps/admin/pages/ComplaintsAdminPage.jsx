import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Loader, Search } from 'lucide-react';
import api from '../../../shared/api';

const STATUS_COLORS = {
    open: { badge: 'badge-primary', color: '#3b82f6' },
    in_review: { badge: 'badge-warning', color: '#f59e0b' },
    resolved: { badge: 'badge-success', color: '#10b981' },
    closed: { badge: 'badge-grey', color: '#64748b' }
};

const PRIORITY_COLORS = { low: '#10b981', medium: '#3b82f6', high: '#f59e0b', urgent: '#ef4444' };

export default function AdminComplaintsPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data.data.complaints);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleUpdate = async () => {
        if (!selected) return;
        setUpdating(true);
        try {
            await api.patch(`/complaints/${selected.id}/status`, { status, adminResponse: notes });
            setSelected(null);
            setNotes('');
            fetchComplaints();
        } catch (err) { console.error(err); }
        setUpdating(false);
    };

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">Complaint Management</h2>
                <p className="page-subtitle">Resolve customer issues and manage support tickets</p>
            </div>

            <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: 20 }}>
                {/* List */}
                <div className="card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input className="form-control form-control-sm" style={{ paddingLeft: 32 }} placeholder="Search complaints..." />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                            complaints.map(c => (
                                <div key={c.id}
                                    onClick={() => { setSelected(c); setStatus(c.status); setNotes(c.adminResponse || ''); }}
                                    style={{
                                        padding: 16, borderBottom: '1px solid var(--border-color)', cursor: 'pointer',
                                        background: selected?.id === c.id ? 'var(--color-primary-50)' : '#fff',
                                        borderLeft: selected?.id === c.id ? '4px solid var(--color-primary-600)' : '4px solid transparent',
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-700)' }}>
                                            {c.customer?.name}
                                        </span>
                                        <span className={`badge ${STATUS_COLORS[c.status].badge}`} style={{ fontSize: '0.65rem' }}>{c.status.replace('_', ' ')}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{c.subject}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail */}
                <div className="card">
                    {selected ? (
                        <div className="card-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                <div>
                                    <h3 style={{ marginBottom: 4 }}>{selected.subject}</h3>
                                    <p className="text-sm">From: <strong>{selected.customer?.name}</strong> ({selected.customer?.phone})</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ticket ID: {selected.id}</div>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>Issue Description:</div>
                                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.description}</p>
                                {selected.booking && (
                                    <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--color-primary-700)', fontWeight: 600 }}>
                                        Related Booking: #{selected.booking.bookingNumber}
                                    </div>
                                )}
                            </div>

                            <hr className="mb-4" />

                            <div style={{ maxWidth: 500 }}>
                                <h4 className="mb-3">Take Action</h4>
                                <div className="form-group mb-3">
                                    <label className="form-label">Update Status</label>
                                    <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                                        <option value="open">Open</option>
                                        <option value="in_review">In Review</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label">Resolution / Internal Notes</label>
                                    <textarea className="form-control" rows={5} placeholder="Type notes here..." value={notes} onChange={e => setNotes(e.target.value)} />
                                </div>
                                <button className="btn btn-primary" onClick={handleUpdate} disabled={updating}>
                                    {updating ? <Loader size={16} className="animate-spin" /> : 'Update Complaint'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card-body loading-center" style={{ height: '100%' }}>
                            <div className="text-center">
                                <MessageSquare size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                                <h3>Select a complaint</h3>
                                <p>Click on an item from the list to view details and take action.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
