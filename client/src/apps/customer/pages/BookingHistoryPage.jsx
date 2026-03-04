import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Package, Star, XCircle, CheckCircle, Truck, Play, Loader } from 'lucide-react';
import api from '../../../shared/api';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fef9c3', icon: Clock },
    confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#dbeafe', icon: CheckCircle },
    assigned: { label: 'Assigned', color: '#8b5cf6', bg: '#ede9fe', icon: Package },
    on_the_way: { label: 'On the Way', color: '#06b6d4', bg: '#cffafe', icon: Truck },
    started: { label: 'In Progress', color: '#f97316', bg: '#ffedd5', icon: Play },
    completed: { label: 'Completed', color: '#22c55e', bg: '#dcfce7', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2', icon: XCircle },
};

const RatingModal = ({ bookingId, technicianId, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/payments/ratings', { bookingId, rating, review });
            onSubmit();
            onClose();
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h3>Rate Your Experience</h3><button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
                <div className="modal-body">
                    <div className="text-center mb-4">
                        <div className="stars" style={{ justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setRating(s)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: s <= rating ? '#fbbf24' : '#d1d5db' }}>★</button>
                            ))}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}</p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Write a Review (optional)</label>
                        <textarea className="form-control" rows={3} placeholder="Share your experience with the technician..." value={review} onChange={e => setReview(e.target.value)} style={{ resize: 'vertical' }} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>Skip</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader size={14} /> : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function BookingHistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [ratingModal, setRatingModal] = useState(null);

    useEffect(() => {
        setLoading(true);
        const params = filter ? `?status=${filter}` : '';
        api.get(`/bookings${params}`).then(({ data }) => setBookings(data.data.bookings || [])).catch(console.error).finally(() => setLoading(false));
    }, [filter]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)', padding: '32px var(--content-padding)' }}>
            <div className="container" style={{ maxWidth: 720 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div><h2>My Bookings</h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track and manage your service bookings</p></div>
                    <Link to="/customer/services"><button className="btn btn-primary btn-sm">+ New Booking</button></Link>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    {[['', 'All'], ['pending', 'Pending'], ['assigned', 'Assigned'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([k, label]) => (
                        <button key={k} onClick={() => setFilter(k)} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`}>{label}</button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-center"><div className="spinner"></div></div>
                ) : bookings.length === 0 ? (
                    <div className="card card-body text-center" style={{ padding: 60 }}>
                        <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                        <h3 style={{ marginBottom: 8 }}>No bookings yet</h3>
                        <p style={{ marginBottom: 24 }}>Start by booking a home service.</p>
                        <Link to="/customer/services"><button className="btn btn-primary">Browse Services</button></Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {bookings.map(b => {
                            const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                            const StatusIcon = status.icon;
                            return (
                                <div key={b.id} className="card">
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <span style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>#{b.bookingNumber}</span>
                                            <span style={{ margin: '0 8px', color: 'var(--text-secondary)' }}>·</span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{b.scheduledDate} at {b.scheduledTime}</span>
                                        </div>
                                        <span className="badge" style={{ background: status.bg, color: status.color }}>
                                            <StatusIcon size={12} />{status.label}
                                        </span>
                                    </div>
                                    <div style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ marginBottom: 4 }}>{b.serviceSnapshot?.name || b.service?.name}</h4>
                                                {b.technician?.user && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                                                        <div className="avatar avatar-sm">{b.technician.user.name?.[0]}</div>
                                                        {b.technician.user.name} · {b.technician.user.phone}
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.addressSnapshot?.line1}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>₹{b.finalPrice || b.estimatedPrice || b.serviceSnapshot?.basePrice}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: 2 }}>
                                                    {b.paymentStatus === 'completed' ? (
                                                        <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Paid via {b.paymentMethod}</span>
                                                    ) : (
                                                        <span>Due via {b.paymentMethod || 'cash'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                                            {b.status === 'completed' && (
                                                <button className="btn btn-sm" style={{ background: '#fef9c3', color: '#a16207', border: '1px solid #fde68a' }} onClick={() => setRatingModal({ bookingId: b.id, technicianId: b.technicianId })}>
                                                    <Star size={12} /> Rate Service
                                                </button>
                                            )}
                                            {['pending', 'confirmed', 'assigned'].includes(b.status) && (
                                                <button className="btn btn-sm btn-danger" onClick={async () => {
                                                    if (window.confirm('Cancel this booking?')) {
                                                        await api.post(`/bookings/${b.id}/cancel`, { reason: 'Cancelled by customer' });
                                                        setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'cancelled' } : x));
                                                    }
                                                }}>
                                                    Cancel
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

            {ratingModal && <RatingModal {...ratingModal} onClose={() => setRatingModal(null)} onSubmit={() => { }} />}
        </div>
    );
}
