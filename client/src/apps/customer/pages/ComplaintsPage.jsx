import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Loader, Plus } from 'lucide-react';
import api from '../../../shared/api';

const PRIORITY_COLORS = {
    low: '#999',
    medium: '#666',
    high: '#333',
    urgent: '#000'
};

const STATUS_ICONS = {
    open: { icon: Clock, color: '#000', bg: '#f0f0f0' },
    in_review: { icon: Clock, color: '#666', bg: '#f5f5f5' },
    resolved: { icon: CheckCircle, color: '#fff', bg: '#000' },
    closed: { icon: CheckCircle, color: '#999', bg: '#eee' }
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>COMPLAINTS</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem' }}>SUPPORT & TICKETING</p>
                </div>
                <button className="btn btn-primary" style={{ borderRadius: 0 }} onClick={() => setShowModal(true)}>
                    + NEW COMPLAINT
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
                            <div key={c.id} className="card card-body" style={{ borderRadius: 0, border: '1px solid var(--border-color)', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div>
                                        <h4 style={{ marginBottom: 4, textTransform: 'uppercase' }}>{c.subject}</h4>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                            FILED ON {new Date(c.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', background: status.bg, color: status.color, padding: '3px 8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 20 }}>{c.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <span style={{ color: PRIORITY_COLORS[c.priority], fontWeight: 800 }}>PRIORITY: {c.priority.toUpperCase()}</span>
                                        {c.bookingId && <span style={{ color: 'var(--text-secondary)' }}>REF: {c.bookingId.slice(-8).toUpperCase()}</span>}
                                    </div>
                                </div>
                                {c.adminResponse && (
                                    <div style={{ marginTop: 20, padding: '16px', background: '#fafafa', border: '1px solid #eee', borderLeft: '4px solid #000' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.75rem', marginBottom: 6, textTransform: 'uppercase' }}>OFFICIAL RESPONSE:</div>
                                        <p style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>{c.adminResponse}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ background: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500, borderRadius: 0, border: '2px solid #000' }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid #eee' }}>
                            <h3 style={{ textTransform: 'uppercase' }}>NEW COMPLAINT</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body" style={{ padding: '24px' }}>
                                <div className="form-group mb-4">
                                    <label className="form-label" style={{ fontSize: '0.7rem' }}>RELATED BOOKING</label>
                                    <select className="form-control" style={{ borderRadius: 0 }} value={form.bookingId} onChange={e => setForm({ ...form, bookingId: e.target.value })}>
                                        <option value="">NONE / GENERAL</option>
                                        {bookings.map(b => (
                                            <option key={b.id} value={b.id}>#{b.bookingNumber} - {b.serviceSnapshot.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label" style={{ fontSize: '0.7rem' }}>SUBJECT</label>
                                    <input className="form-control" style={{ borderRadius: 0 }} required placeholder="Brief summary" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label" style={{ fontSize: '0.7rem' }}>DESCRIPTION</label>
                                    <textarea className="form-control" style={{ borderRadius: 0 }} required rows={4} placeholder="Detailed explanation..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.7rem' }}>PRIORITY</label>
                                    <select className="form-control" style={{ borderRadius: 0 }} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                        <option value="low">LOW</option>
                                        <option value="medium">MEDIUM</option>
                                        <option value="high">HIGH</option>
                                        <option value="urgent">URGENT</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderTop: 'none', padding: '0 24px 24px' }}>
                                <button type="button" className="btn btn-outline" style={{ borderRadius: 0, flex: 1 }} onClick={() => setShowModal(false)}>CANCEL</button>
                                <button type="submit" className="btn btn-primary" style={{ borderRadius: 0, flex: 2 }} disabled={submitting}>
                                    {submitting ? 'SUBMITTING...' : 'SUBMIT TICKET'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
