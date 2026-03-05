import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Package, Star, XCircle, CheckCircle, Truck, Play, Loader, MapPin } from 'lucide-react';
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
                                    <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0A0D14', color: '#fff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.05em' }}>ORD #{b.bookingNumber}</span>
                                            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)' }} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{b.scheduledDate} @ {b.scheduledTime}</span>
                                        </div>
                                        <span style={{ fontSize: '0.6rem', background: status.bg === '#000' ? '#fff' : status.bg, color: status.bg === '#000' ? '#000' : status.color, padding: '3px 10px', fontWeight: 900, letterSpacing: '0.1em' }}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ marginBottom: 12, textTransform: 'uppercase', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.02em' }}>{b.serviceSnapshot?.name || b.service?.name}</h4>
                                                {b.technician?.user && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: '#fff', margin: '20px 0', fontWeight: 800, letterSpacing: '0.05em' }}>
                                                        <div className="avatar" style={{ background: '#111', color: '#fff', width: 32, height: 32, fontSize: '0.8rem' }}>{b.technician.user.name?.[0]}</div>
                                                        <div>
                                                            <div style={{ opacity: 0.5, fontSize: '0.6rem', marginBottom: 2 }}>ASSIGNED ENGINEER</div>
                                                            {b.technician.user.name.toUpperCase()} · {b.technician.user.phone}
                                                        </div>
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <MapPin size={12} /> {b.addressSnapshot?.line1}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>₹{b.finalPrice || b.estimatedPrice || b.serviceSnapshot?.basePrice}</div>
                                                <div style={{ fontSize: '0.6rem', color: '#999', textTransform: 'uppercase', marginTop: 8, fontWeight: 800, letterSpacing: '0.1em' }}>
                                                    {b.paymentStatus === 'completed' ? (
                                                        <span style={{ color: '#000' }}>PAID · {b.paymentMethod?.toUpperCase()}</span>
                                                    ) : (
                                                        <span>DUE · {b.paymentMethod?.toUpperCase() || 'CASH'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
                                            {b.status === 'completed' && (
                                                <button className="btn btn-sm" style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px' }} onClick={() => setRatingModal({ bookingId: b.id, technicianId: b.technicianId })}>
                                                    RATE PERFORMANCE
                                                </button>
                                            )}
                                            {['pending', 'confirmed', 'assigned'].includes(b.status) && (
                                                <button className="btn btn-sm" style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '10px 20px' }} onClick={async () => {
                                                    if (window.confirm('ABORT THIS BOOKING?')) {
                                                        await api.post(`/bookings/${b.id}/cancel`, { reason: 'CANCELLED BY USER' });
                                                        setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'cancelled' } : x));
                                                    }
                                                }}>
                                                    CANCEL
                                                </button>
                                            )}
                                            <button className="btn btn-sm btn-outline" style={{ border: '1px solid #000', padding: '10px 20px', fontSize: '0.7rem' }}>VIEW DETAILS</button>
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
