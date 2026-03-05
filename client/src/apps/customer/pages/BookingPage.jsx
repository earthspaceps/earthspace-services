import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../shared/api';
import { useAuth } from '../../../shared/AuthContext';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const PAYMENT_METHODS = [
    { key: 'cash', label: 'Cash on Service', icon: '💵', desc: 'Pay after service completion' },
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

    // Address state (pre-fill from user profile)
    const [address, setAddress] = useState({
        line1: user?.addressLine1 || '',
        line2: user?.addressLine2 || '',
        city: user?.city || '',
        pincode: user?.pincode || ''
    });
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
            const response = await api.post('/bookings', {
                serviceId,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                address: { ...address },
                specialInstructions: instructions,
                paymentMethod,
            });

            // Very resilient data extraction
            const bookingData = response.data?.data?.booking || response.data?.booking || response.data?.data || {};

            // If the response succeeded (2xx), we move to step 4 regardless of data format
            setBooking(bookingData);
            setStep(4);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Booking Error:', err.response?.data || err);
            const errorMsg = err.response?.data?.message || 'Booking failed. Please check your network or try again.';
            setError(errorMsg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const STEPS = ['Date & Time', 'Address', 'Payment', 'Confirmed'];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)', padding: '32px var(--content-padding)' }}>
            <div className="container" style={{ maxWidth: 640 }}>
                {/* Progress Steps */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
                    {STEPS.map((s, i) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                    width: 32, height: 32, border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem',
                                    background: step >= i + 1 ? '#000' : 'transparent',
                                    color: step >= i + 1 ? '#fff' : 'var(--text-secondary)',
                                }}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span style={{ fontSize: '0.65rem', marginTop: 8, fontWeight: 700, color: step === i + 1 ? '#000' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s}</span>
                            </div>
                            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? '#000' : 'var(--color-grey-200)', marginBottom: 20 }} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Service Summary */}
                <div className="card mb-6" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase' }}>{serviceName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TECHNICAL SOLUTION</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: '1.4rem' }}>₹{servicePrice}+</div>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {/* Step 1: Date & Time */}
                {step === 1 && (
                    <div className="card card-body">
                        <h3 className="mb-6" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>SELECT DATE & TIME</h3>

                        {/* Calendar */}
                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}><ChevronLeft size={18} /></button>
                                <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{monthName}</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}><ChevronRight size={18} /></button>
                            </div>
                            <div className="calendar-grid" style={{ marginBottom: 8 }}>
                                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 0' }}>{d}</div>)}
                            </div>
                            <div className="calendar-grid">
                                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                                    const date = formatDate(calYear, calMonth, d);
                                    const past = isPast(d);
                                    const isSelected = selectedDate === date;
                                    return (
                                        <button key={d} disabled={past} onClick={() => setSelectedDate(date)}
                                            style={{
                                                aspectRatio: '1', border: '1px solid #eee', background: isSelected ? '#000' : 'transparent',
                                                color: isSelected ? '#fff' : past ? '#ccc' : '#000', fontWeight: isSelected ? 800 : 400,
                                                cursor: past ? 'default' : 'pointer', fontSize: '0.85rem'
                                            }}>{d}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <h4 style={{ marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>SELECT TIME WINDOW</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
                            {TIME_SLOTS.map(t => (
                                <button key={t} onClick={() => setSelectedTime(t)} style={{
                                    padding: '12px 0', border: '1px solid var(--border-color)', borderRadius: '12px',
                                    background: selectedTime === t ? '#000' : 'transparent',
                                    color: selectedTime === t ? '#fff' : '#000',
                                    fontWeight: selectedTime === t ? 700 : 400, fontSize: '0.85rem',
                                    transition: 'all 0.2s ease'
                                }}>{t}</button>
                            ))}
                        </div>

                        <button className="btn btn-primary btn-block btn-lg mt-8" onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}>
                            CONTINUE TO ADDRESS
                        </button>
                    </div>
                )}

                {/* Step 2: Address */}
                {step === 2 && (
                    <div className="card card-body" style={{ borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h3 className="mb-6" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>SERVICE ADDRESS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="form-group">
                                <input className="form-input" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #eee', background: '#fff' }} placeholder=" " value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} required />
                                <label>ADDRESS LINE 1</label>
                            </div>
                            <div className="form-group">
                                <input className="form-input" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #eee', background: '#fff' }} placeholder=" " value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} />
                                <label>ADDRESS LINE 2</label>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <input className="form-input" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #eee', background: '#fff' }} placeholder=" " value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                                    <label>CITY</label>
                                </div>
                                <div className="form-group">
                                    <input className="form-input" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #eee', background: '#fff' }} placeholder=" " value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                                    <label>PINCODE</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <textarea className="form-input" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #eee', background: '#fff' }} rows={3} placeholder=" " value={instructions} onChange={e => setInstructions(e.target.value)} />
                                <label>SPECIAL INSTRUCTIONS</label>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>BACK</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)} disabled={!address.line1 || !address.city}>CONTINUE</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                    <div className="card card-body" style={{ borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h3 className="mb-6" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>PAYMENT METHOD</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                            {PAYMENT_METHODS.map(pm => (
                                <div key={pm.key} onClick={() => setPaymentMethod(pm.key)} style={{
                                    border: `2px solid ${paymentMethod === pm.key ? '#000' : '#eee'}`,
                                    borderRadius: '16px', padding: '20px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    background: paymentMethod === pm.key ? '#f8f8f8' : '#fff',
                                    transition: 'all .2s',
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>{pm.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem' }}>{pm.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pm.desc}</div>
                                    </div>
                                    {paymentMethod === pm.key && <CheckCircle size={20} color="#000" />}
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div style={{ background: '#000', color: '#fff', padding: '24px', marginBottom: 32, borderRadius: '20px' }}>
                            <h4 style={{ color: '#fff', marginBottom: 16, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>BOOKING SUMMARY</h4>
                            <div style={{ display: 'grid', gap: 10 }}>
                                {[['SOLUTION', serviceName], ['DATE', selectedDate], ['TIME', selectedTime], ['METHOD', PAYMENT_METHODS.find(p => p.key === paymentMethod)?.label]].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                                        <span style={{ opacity: 0.6 }}>{k}</span>
                                        <span style={{ fontWeight: 700 }}>{v?.toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>TOTAL ESTIMATE</span>
                                <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>₹{servicePrice}+</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>BACK</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleBook} disabled={loading}>
                                {loading ? 'PROCESSING...' : 'CONFIRM BOOKING'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirmed */}
                {step === 4 && booking && (
                    <div className="card card-body text-center" style={{ padding: '60px 40px' }}>
                        <div style={{ width: 80, height: 80, background: '#111', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                            <CheckCircle size={40} color="var(--color-success)" strokeWidth={1.5} />
                        </div>
                        <h2 style={{ marginBottom: 12, fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>BOOKING CONFIRMED</h2>
                        <p style={{ marginBottom: 40, fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>YOUR ENGINEER HAS BEEN ASSIGNED AND IS EN ROUTE.</p>

                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', marginBottom: 40, textAlign: 'left', borderRadius: '16px' }}>
                            {[
                                ['BOOKING NUMBER', booking.bookingNumber || booking.booking_number || 'N/A'],
                                ['SERVICE TYPE', serviceName],
                                ['SCHEDULED DATE', selectedDate],
                                ['SCHEDULED WINDOW', selectedTime]
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{k}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff' }}>{String(v || 'N/A').toUpperCase()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                            <button
                                className="btn btn-outline"
                                style={{ padding: '16px 32px' }}
                                onClick={() => window.location.href = '/customer/bookings'}
                            >
                                VIEW ALL BOOKINGS
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '16px 32px' }}
                                onClick={() => window.location.href = '/customer'}
                            >
                                BACK TO HUB
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
