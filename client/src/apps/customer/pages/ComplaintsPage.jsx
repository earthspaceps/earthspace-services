import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Loader, Plus } from 'lucide-react';
import api from '../../../shared/api';

const PRIORITY_COLORS = {
    low: '#10b981',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444'
};

const STATUS_ICONS = {
    open: { icon: Clock, color: '#3b82f6', bg: '#dbeafe' },
    in_review: { icon: Clock, color: '#f59e0b', bg: '#fef9c3' },
    resolved: { icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    closed: { icon: CheckCircle, color: '#64748b', bg: '#f1f5f9' }
};

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ bookingId: '', subject: '', description: '', priority: 'medium' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRes, bRes] = await Promise.all([
                api.get('/complaints/my'),
                api.get('/bookings')
            ]);
            setComplaints(cRes.data.data.complaints);
            setBookings(bRes.data.data.bookings.filter(b => ['completed', 'cancelled'].includes(b.status)));
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/complaints', form);
            setShowModal(false);
            setForm({ bookingId: '', subject: '', description: '', priority: 'medium' });
            fetchData();
        } catch (err) { console.error(err); }
        setSubmitting(false);
    };

    return (
        <div style={{ padding: '32px var(--content-padding)', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2>Support & Complaints</h2>
                    <p className="text-sm text-secondary">Track your issues and get resolutions</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> New Complaint
                </button>
            </div>

            {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {complaints.length === 0 ? (
                        <div className="card card-body text-center" style={{ padding: 60 }}>
                            <MessageSquare size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                            <h3>No complaints found</h3>
                            <p>Everything looks good! If you have any issues, let us know.</p>
                        </div>
                    ) : complaints.map(c => {
                        const status = STATUS_ICONS[c.status] || STATUS_ICONS.open;
                        const Icon = status.icon;
                        return (
                            <div key={c.id} className="card card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <h4 style={{ marginBottom: 4 }}>{c.subject}</h4>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Filed on {new Date(c.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className="badge" style={{ background: status.bg, color: status.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Icon size={12} /> {c.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>{c.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <span style={{ color: PRIORITY_COLORS[c.priority], fontWeight: 600 }}>Priority: {c.priority.toUpperCase()}</span>
                                        {c.bookingId && <span style={{ color: 'var(--text-secondary)' }}>Booking ID: {c.bookingId.slice(0, 8)}</span>}
                                    </div>
                                </div>
                                {c.adminResponse && (
                                    <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>Resolution Note:</div>
                                        <p style={{ fontSize: '0.85rem' }}>{c.adminResponse}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h3>File a Complaint</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label className="form-label">Related Booking (Optional)</label>
                                    <select className="form-control" value={form.bookingId} onChange={e => setForm({ ...form, bookingId: e.target.value })}>
                                        <option value="">None</option>
                                        {bookings.map(b => (
                                            <option key={b.id} value={b.id}>#{b.bookingNumber} - {b.serviceSnapshot.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Subject</label>
                                    <input className="form-control" required placeholder="Short summary of the issue" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" required rows={4} placeholder="Describe the issue in detail" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? <Loader size={16} className="animate-spin" /> : 'Submit Complaint'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
