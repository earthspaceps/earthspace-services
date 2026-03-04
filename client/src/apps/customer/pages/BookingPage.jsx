import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../shared/api';
import { useAuth } from '../../../shared/AuthContext';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const PAYMENT_METHODS = [
    { key: 'online', label: 'Online Payment', icon: '💳', desc: 'UPI, Cards, Net Banking' },
    { key: 'cash', label: 'Cash on Service', icon: '💵', desc: 'Pay after service completion' },
    { key: 'wallet', label: 'Wallet', icon: '👛', desc: 'Pay from Earthspace wallet' },
];

export default function BookingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const serviceId = searchParams.get('service');
    const serviceName = searchParams.get('name') || 'Service';
    const servicePrice = searchParams.get('price') || '0';

    const [step, setStep] = useState(1); // 1=date/time, 2=address, 3=payment, 4=confirm
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState(null);

    // Calendar state
    const today = new Date();
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Address state
    const [address, setAddress] = useState({ line1: '', line2: '', city: '', pincode: '' });
    const [instructions, setInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const monthName = new Date(calYear, calMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    const formatDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = (d) => new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const handleBook = async () => {
        setLoading(true); setError('');
        try {
            const { data } = await api.post('/bookings', {
                serviceId,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                address: { ...address },
                specialInstructions: instructions,
                paymentMethod,
            });
            setBooking(data.data.booking);
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        }
        setLoading(false);
    };

    const STEPS = ['Date & Time', 'Address', 'Payment', 'Confirmed'];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)', padding: '32px var(--content-padding)' }}>
            <div className="container" style={{ maxWidth: 640 }}>
                {/* Progress Steps */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
                    {STEPS.map((s, i) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem',
                                    background: step > i + 1 ? 'var(--color-success)' : step === i + 1 ? 'var(--color-primary-600)' : 'var(--color-grey-200)',
                                    color: step >= i + 1 ? '#fff' : 'var(--text-secondary)',
                                }}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span style={{ fontSize: '0.72rem', marginTop: 4, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--color-primary-700)' : 'var(--text-secondary)' }}>{s}</span>
                            </div>
                            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? 'var(--color-success)' : 'var(--color-grey-200)', marginBottom: 20 }} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Service Summary */}
                <div className="card mb-4" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 700 }}>{serviceName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Home Service</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary-700)' }}>₹{servicePrice}+</div>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {/* Step 1: Date & Time */}
                {step === 1 && (
                    <div className="card card-body">
                        <h3 className="mb-4"><Calendar size={20} style={{ display: 'inline', marginRight: 8 }} />Select Date & Time</h3>

                        {/* Mini Calendar */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}><ChevronLeft size={16} /></button>
                                <span style={{ fontWeight: 600 }}>{monthName}</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}><ChevronRight size={16} /></button>
                            </div>
                            <div className="calendar-grid" style={{ marginBottom: 8 }}>
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px 0' }}>{d}</div>)}
                            </div>
                            <div className="calendar-grid">
                                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                                    const date = formatDate(calYear, calMonth, d);
                                    const past = isPast(d);
                                    return (
                                        <button key={d} disabled={past} onClick={() => setSelectedDate(date)}
                                            className={`cal-day ${past ? 'disabled' : 'available'} ${selectedDate === date ? 'selected' : ''} ${formatDate(today.getFullYear(), today.getMonth(), today.getDate()) === date ? 'today' : ''}`}>{d}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <h4 style={{ marginBottom: 12 }}><Clock size={16} style={{ display: 'inline', marginRight: 6 }} />Select Time</h4>
                        <div className="time-slots">
                            {TIME_SLOTS.map(t => (
                                <button key={t} className={`time-slot ${selectedTime === t ? 'selected' : ''}`} onClick={() => setSelectedTime(t)}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <button className="btn btn-primary btn-block btn-lg mt-6" onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}>
                            Continue to Address →
                        </button>
                    </div>
                )}

                {/* Step 2: Address */}
                {step === 2 && (
                    <div className="card card-body">
                        <h3 className="mb-4"><MapPin size={20} style={{ display: 'inline', marginRight: 8 }} />Service Address</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Address Line 1 <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input className="form-control" placeholder="House/Flat No., Building Name, Street" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Address Line 2</label>
                                <input className="form-control" placeholder="Landmark, Area (optional)" value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label className="form-label">City <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input className="form-control" placeholder="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pincode</label>
                                    <input className="form-control" placeholder="Pincode" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Special Instructions</label>
                                <textarea className="form-control" rows={3} placeholder="Any special instructions for the technician..." value={instructions} onChange={e => setInstructions(e.target.value)} style={{ resize: 'vertical' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                            <button className="btn btn-primary btn-block" onClick={() => setStep(3)} disabled={!address.line1 || !address.city}>Continue to Payment →</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                    <div className="card card-body">
                        <h3 className="mb-4"><CreditCard size={20} style={{ display: 'inline', marginRight: 8 }} />Payment Method</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                            {PAYMENT_METHODS.map(pm => (
                                <div key={pm.key} onClick={() => setPaymentMethod(pm.key)} style={{
                                    border: `2px solid ${paymentMethod === pm.key ? 'var(--color-primary-500)' : 'var(--border-color)'}`,
                                    borderRadius: 12, padding: '16px 20px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    background: paymentMethod === pm.key ? 'var(--color-primary-50)' : '#fff',
                                    transition: 'all .2s',
                                }}>
                                    <span style={{ fontSize: '1.6rem' }}>{pm.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pm.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{pm.desc}</div>
                                    </div>
                                    {paymentMethod === pm.key && <CheckCircle size={20} style={{ marginLeft: 'auto', color: 'var(--color-primary-600)' }} />}
                                </div>
                            ))}
                        </div>

                        {/* Booking Summary */}
                        <div style={{ background: 'var(--color-grey-50)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                            <h4 style={{ marginBottom: 12 }}>Booking Summary</h4>
                            {[['Service', serviceName], ['Date', selectedDate], ['Time', selectedTime], ['Address', `${address.line1}, ${address.city}`], ['Payment', PAYMENT_METHODS.find(p => p.key === paymentMethod)?.label]].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                                    <span style={{ fontWeight: 500 }}>{v}</span>
                                </div>
                            ))}
                            <div className="divider" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                <span>Estimate</span><span style={{ color: 'var(--color-primary-700)' }}>₹{servicePrice}+</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                            <button className="btn btn-primary btn-block btn-lg" onClick={handleBook} disabled={loading}>
                                {loading ? <><Loader size={16} /> Booking...</> : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirmed */}
                {step === 4 && booking && (
                    <div className="card card-body text-center" style={{ padding: 40 }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle size={40} color="#22c55e" />
                        </div>
                        <h2 style={{ marginBottom: 8 }}>Booking Confirmed! 🎉</h2>
                        <p style={{ marginBottom: 24 }}>Your technician has been assigned and will arrive at the scheduled time.</p>
                        <div style={{ background: 'var(--color-grey-50)', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Booking #</span><span style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{booking.bookingNumber}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Service</span><span style={{ fontWeight: 600 }}>{serviceName}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-secondary)' }}>Date</span><span style={{ fontWeight: 600 }}>{selectedDate}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Time</span><span style={{ fontWeight: 600 }}>{selectedTime}</span></div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button className="btn btn-outline" onClick={() => window.location.href = '/customer/bookings'}>View Bookings</button>
                            <button className="btn btn-primary" onClick={() => window.location.href = '/customer'}>Back to Home</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
