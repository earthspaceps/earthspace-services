import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Package, Star, XCircle, CheckCircle, Truck, Play, Loader } from 'lucide-react';
import api from '../../../shared/api';

const STATUS_CONFIG = {
    pending: { label: 'PENDING', color: '#000', bg: '#f0f0f0', icon: Clock },
    confirmed: { label: 'CONFIRMED', color: '#fff', bg: '#000', icon: CheckCircle },
    assigned: { label: 'ASSIGNED', color: '#fff', bg: '#333', icon: Package },
    on_the_way: { label: 'ON THE WAY', color: '#fff', bg: '#444', icon: Truck },
    started: { label: 'IN PROGRESS', color: '#fff', bg: '#000', icon: Play },
    completed: { label: 'COMPLETED', color: '#fff', bg: '#000', icon: CheckCircle },
    cancelled: { label: 'CANCELLED', color: '#fff', bg: '#999', icon: XCircle },
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
        <div className="modal-overlay" onClick={onClose} style={{ background: 'rgba(0,0,0,0.8)' }}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ borderRadius: 0, border: '2px solid #000' }}>
                <div className="modal-header" style={{ borderBottom: '1px solid #eee' }}><h3 style={{ textTransform: 'uppercase' }}>RATE YOUR EXPERIENCE</h3><button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
                <div className="modal-body" style={{ padding: '32px' }}>
                    <div className="text-center mb-6">
                        <div className="stars" style={{ justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setRating(s)} style={{ background: 'none', border: 'none', fontSize: '2.5rem', cursor: 'pointer', color: s <= rating ? '#000' : '#ddd' }}>★</button>
                            ))}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{['', 'POOR', 'FAIR', 'GOOD', 'VERY GOOD', 'EXCELLENT!'][rating]}</p>
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>REVIEW</label>
                        <textarea className="form-control" style={{ borderRadius: 0 }} rows={3} placeholder="Share your experience..." value={review} onChange={e => setReview(e.target.value)} />
                    </div>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none', padding: '0 32px 32px' }}>
                    <button className="btn btn-outline" style={{ borderRadius: 0, flex: 1 }} onClick={onClose}>SKIP</button>
                    <button className="btn btn-primary" style={{ borderRadius: 0, flex: 2 }} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'SUBMITTING...' : 'SUBMIT RATING'}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div><h2 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>MY BOOKINGS</h2><p className="text-sm" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem' }}>HISTORY & TRACKING</p></div>
                    <Link to="/customer/services"><button className="btn btn-primary btn-sm" style={{ borderRadius: 0 }}>+ NEW BOOKING</button></Link>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
                    {[['', 'ALL'], ['pending', 'PENDING'], ['assigned', 'ASSIGNED'], ['completed', 'COMPLETED'], ['cancelled', 'CANCELLED']].map(([k, label]) => (
                        <button key={k} onClick={() => setFilter(k)} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`} style={{ borderRadius: 0, flex: 1, minWidth: 100 }}>{label}</button>
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
                                <div key={b.id} className="card" style={{ borderRadius: 0, border: '1px solid var(--border-color)', marginBottom: 16 }}>
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                                        <div>
                                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>#{b.bookingNumber}</span>
                                            <span style={{ margin: '0 8px', color: '#ddd' }}>|</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{b.scheduledDate} · {b.scheduledTime}</span>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', background: status.bg, color: status.color, padding: '3px 8px', fontWeight: 800, letterSpacing: '0.05em' }}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ marginBottom: 4, textTransform: 'uppercase', fontSize: '1rem' }}>{b.serviceSnapshot?.name || b.service?.name}</h4>
                                                {b.technician?.user && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#000', margin: '12px 0', fontWeight: 600 }}>
                                                        <div className="avatar avatar-sm" style={{ background: '#000', color: '#fff', borderRadius: 0 }}>{b.technician.user.name?.[0]}</div>
                                                        {b.technician.user.name.toUpperCase()} · {b.technician.user.phone}
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{b.addressSnapshot?.line1}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>₹{b.finalPrice || b.estimatedPrice || b.serviceSnapshot?.basePrice}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: 4, fontWeight: 700, letterSpacing: '0.05em' }}>
                                                    {b.paymentStatus === 'completed' ? (
                                                        <span style={{ color: '#000' }}>PAID VIA {b.paymentMethod?.toUpperCase()}</span>
                                                    ) : (
                                                        <span>DUE VIA {b.paymentMethod?.toUpperCase() || 'CASH'}</span>
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
