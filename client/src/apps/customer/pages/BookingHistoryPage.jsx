import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Package, Star, XCircle, CheckCircle, Truck, Play, Loader, MapPin } from 'lucide-react';
import api from '../../../shared/api';

const STATUS_CONFIG = {
    pending: { label: 'PENDING', color: '#fff', bg: 'rgba(255,255,255,0.1)', icon: Clock },
    confirmed: { label: 'CONFIRMED', color: '#fff', bg: 'rgba(34,197,94,0.2)', icon: CheckCircle },
    assigned: { label: 'ASSIGNED', color: '#fff', bg: 'rgba(59,130,246,0.2)', icon: Package },
    on_the_way: { label: 'ON THE WAY', color: '#fff', bg: 'rgba(245,158,11,0.2)', icon: Truck },
    started: { label: 'IN PROGRESS', color: '#fff', bg: 'rgba(139,92,246,0.2)', icon: Play },
    completed: { label: 'COMPLETED', color: '#fff', bg: 'rgba(34,197,94,0.3)', icon: CheckCircle },
    cancelled: { label: 'CANCELLED', color: '#fff', bg: 'rgba(239,68,68,0.2)', icon: XCircle },
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
            <div className="card" onClick={e => e.stopPropagation()} style={{ maxWidth: 500, margin: '15vh auto', padding: 0 }}>
                <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}><h3 style={{ textTransform: 'uppercase' }}>RATE YOUR EXPERIENCE</h3><button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
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
                        <textarea className="form-control" rows={3} placeholder="Share your experience..." value={review} onChange={e => setReview(e.target.value)} />
                    </div>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none', padding: '0 32px 32px' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>SKIP</button>
                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={loading}>
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
                    <Link to="/customer/services"><button className="btn btn-primary btn-sm">+ NEW BOOKING</button></Link>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
                    {[['', 'ALL'], ['pending', 'PENDING'], ['assigned', 'ASSIGNED'], ['completed', 'COMPLETED'], ['cancelled', 'CANCELLED']].map(([k, label]) => (
                        <button key={k} onClick={() => setFilter(k)} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, minWidth: 100 }}>{label}</button>
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
                                <div
                                    key={b.id}
                                    className="card"
                                    style={{
                                        marginBottom: 16,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.05em', color: '#fff' }}>ORD #{b.bookingNumber}</span>
                                            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>{b.scheduledDate} · {b.scheduledTime}</span>
                                        </div>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            background: status.bg,
                                            color: status.color,
                                            padding: '4px 12px',
                                            fontWeight: 900,
                                            letterSpacing: '0.1em',
                                            borderRadius: '6px',
                                            border: `1px solid ${status.color}22`
                                        }}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ marginBottom: 16, textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.02em', color: '#fff' }}>{b.serviceSnapshot?.name || b.service?.name}</h4>
                                                {b.technician?.user && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: '#fff', margin: '24px 0', fontWeight: 800, letterSpacing: '0.05em' }}>
                                                        <div className="avatar" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: 40, height: 40, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>{b.technician.user.name?.[0]}</div>
                                                        <div>
                                                            <div style={{ opacity: 0.4, fontSize: '0.65rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ASSIGNED ENGINEER</div>
                                                            <div style={{ color: 'var(--color-primary-400)' }}>{b.technician.user.name.toUpperCase()}</div>
                                                            <div style={{ opacity: 0.6, fontSize: '0.7rem', marginTop: 2 }}>{b.technician.user.phone}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                                                    <MapPin size={14} /> {b.addressSnapshot?.line1}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 1000, fontSize: '1.8rem', lineHeight: 1, color: '#fff' }}>₹{b.finalPrice || b.estimatedPrice || b.serviceSnapshot?.basePrice}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: 12, fontWeight: 900, letterSpacing: '0.1em' }}>
                                                    {b.paymentStatus === 'completed' ? (
                                                        <span style={{ color: '#22c55e' }}>PAID · {b.paymentMethod?.toUpperCase()}</span>
                                                    ) : (
                                                        <span>DUE · {b.paymentMethod?.toUpperCase() || 'CASH'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                            {b.status === 'completed' && (
                                                <button className="btn btn-sm btn-primary" style={{ padding: '12px 24px' }} onClick={() => setRatingModal({ bookingId: b.id, technicianId: b.technicianId })}>
                                                    RATE PERFORMANCE
                                                </button>
                                            )}
                                            {['pending', 'confirmed', 'assigned'].includes(b.status) && (
                                                <button className="btn btn-sm btn-outline" style={{ color: '#ef4444', borderColor: '#ef444433', padding: '12px 24px' }} onClick={async () => {
                                                    if (window.confirm('ABORT THIS BOOKING?')) {
                                                        await api.post(`/bookings/${b.id}/cancel`, { reason: 'CANCELLED BY USER' });
                                                        setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'cancelled' } : x));
                                                    }
                                                }}>
                                                    CANCEL
                                                </button>
                                            )}
                                            <button className="btn btn-sm btn-outline" style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 800 }}>VIEW DETAILS</button>
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
