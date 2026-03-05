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
        <div style={{ minHeight: '100vh', padding: '32px var(--content-padding)' }}>
            <div className="container" style={{ maxWidth: 640 }}>
                {/* Progress Steps */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 48 }}>
                    {STEPS.map((s, i) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                                <div style={{
                                    width: 36, height: 36, border: '2px solid',
                                    borderColor: step >= i + 1 ? '#fff' : 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem',
                                    background: step >= i + 1 ? '#fff' : 'rgba(255,255,255,0.05)',
                                    color: step >= i + 1 ? '#000' : 'rgba(255,255,255,0.3)',
                                    borderRadius: '12px',
                                    boxShadow: step === i + 1 ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span style={{
                                    fontSize: '0.65rem', marginTop: 12, fontWeight: 800,
                                    color: step >= i + 1 ? '#fff' : 'rgba(255,255,255,0.4)',
                                    textTransform: 'uppercase', letterSpacing: '0.1em'
                                }}>{s}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{
                                    flex: 1, height: 2,
                                    background: `linear-gradient(to right, ${step > i + 1 ? '#fff' : 'rgba(255,255,255,0.1)'}, ${step > i + 2 ? '#fff' : 'rgba(255,255,255,0.1)'})`,
                                    marginTop: -24
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Service Summary */}
                <div className="card mb-6" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#fff' }}>{serviceName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4, fontWeight: 700 }}>TECHNICAL SOLUTION</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: '1.6rem', color: '#fff' }}>₹{servicePrice}+</div>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {/* Step 1: Date & Time */}
                {step === 1 && (
                    <div className="card card-body" style={{ padding: '32px' }}>
                        <h3 className="mb-8" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>SELECT DATE & TIME</h3>
                        {/* Calendar */}
                        <div style={{ marginBottom: 40 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                                <button className="btn btn-ghost btn-sm" style={{ color: '#fff' }} onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}><ChevronLeft size={20} /></button>
                                <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fff', fontSize: '1rem' }}>{monthName} {calYear}</span>
                                <button className="btn btn-ghost btn-sm" style={{ color: '#fff' }} onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}><ChevronRight size={20} /></button>
                            </div>
                            <div className="calendar-grid" style={{ marginBottom: 12 }}>
                                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', padding: '12px 0' }}>{d}</div>)}
                            </div>
                            <div className="calendar-grid" style={{ gap: '8px' }}>
                                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                                    const date = formatDate(calYear, calMonth, d);
                                    const past = isPast(d);
                                    const isSelected = selectedDate === date;
                                    return (
                                        <button key={d} disabled={past} onClick={() => setSelectedDate(date)}
                                            style={{
                                                aspectRatio: '1',
                                                border: '1px solid',
                                                borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.05)',
                                                background: isSelected ? '#fff' : 'rgba(255,255,255,0.03)',
                                                color: isSelected ? '#000' : past ? 'rgba(255,255,255,0.1)' : '#fff',
                                                fontWeight: isSelected ? 900 : 500,
                                                borderRadius: '12px',
                                                cursor: past ? 'default' : 'pointer',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s ease',
                                                boxShadow: isSelected ? '0 0 15px rgba(255,255,255,0.2)' : 'none'
                                            }}>{d}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <h4 style={{ marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>SELECT TIME WINDOW</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
                            {TIME_SLOTS.map(t => (
                                <button key={t} onClick={() => setSelectedTime(t)} style={{
                                    padding: '16px 0',
                                    border: '1.5px solid',
                                    borderColor: selectedTime === t ? '#fff' : 'rgba(255,255,255,0.1)',
                                    borderRadius: '14px',
                                    background: selectedTime === t ? '#fff' : 'rgba(255,255,255,0.03)',
                                    color: selectedTime === t ? '#000' : '#fff',
                                    fontWeight: selectedTime === t ? 900 : 500,
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s ease',
                                    boxShadow: selectedTime === t ? '0 0 15px rgba(255,255,255,0.2)' : 'none'
                                }}>{t}</button>
                            ))}
                        </div>

                        <button className="btn btn-primary btn-block btn-lg mt-10" style={{ height: '60px', fontSize: '1rem' }} onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}>
                            CONTINUE TO ADDRESS
                        </button>
                    </div>
                )}

                {/* Step 2: Address */}
                {step === 2 && (
                    <div className="card card-body" style={{ padding: '32px' }}>
                        <h3 className="mb-8" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>SERVICE ADDRESS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div className="form-group">
                                <input className="form-control" style={{ width: '100%' }} placeholder=" " value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} required />
                                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>ADDRESS LINE 1</label>
                            </div>
                            <div className="form-group">
                                <input className="form-control" style={{ width: '100%' }} placeholder=" " value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} />
                                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>ADDRESS LINE 2</label>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <input className="form-control" style={{ width: '100%' }} placeholder=" " value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>CITY</label>
                                </div>
                                <div className="form-group">
                                    <input className="form-control" style={{ width: '100%' }} placeholder=" " value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>PINCODE</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <textarea className="form-control" style={{ width: '100%' }} rows={3} placeholder=" " value={instructions} onChange={e => setInstructions(e.target.value)} />
                                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>SPECIAL INSTRUCTIONS</label>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                            <button className="btn btn-outline" style={{ flex: 1, height: 56 }} onClick={() => setStep(1)}>BACK</button>
                            <button className="btn btn-primary" style={{ flex: 2, height: 56 }} onClick={() => setStep(3)} disabled={!address.line1 || !address.city}>CONTINUE</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                    <div className="card card-body" style={{ padding: '32px' }}>
                        <h3 className="mb-8" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>PAYMENT METHOD</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                            {PAYMENT_METHODS.map(pm => (
                                <div key={pm.key} onClick={() => setPaymentMethod(pm.key)} style={{
                                    border: '2px solid',
                                    borderColor: paymentMethod === pm.key ? '#fff' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '20px', padding: '24px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 20,
                                    background: paymentMethod === pm.key ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: paymentMethod === pm.key ? '0 0 20px rgba(255,255,255,0.1)' : 'none',
                                }}>
                                    <span style={{ fontSize: '2rem' }}>{pm.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem', color: '#fff', letterSpacing: '0.02em' }}>{pm.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 600 }}>{pm.desc}</div>
                                    </div>
                                    {paymentMethod === pm.key && <CheckCircle size={24} color="#fff" />}
                                </div>
                            ))}
                        </div>

                        {/* Summary Block */}
                        <div style={{
                            background: '#fff',
                            color: '#000',
                            padding: '32px',
                            marginBottom: 40,
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                        }}>
                            <h4 style={{ color: '#000', marginBottom: 24, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 900, opacity: 0.6 }}>BOOKING SUMMARY</h4>
                            <div style={{ display: 'grid', gap: 16 }}>
                                {[
                                    ['SOLUTION', serviceName],
                                    ['DATE', selectedDate],
                                    ['TIME', selectedTime],
                                    ['METHOD', PAYMENT_METHODS.find(p => p.key === paymentMethod)?.label]
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                        <span style={{ opacity: 0.5 }}>{k}</span>
                                        <span style={{ letterSpacing: '0.02em' }}>{v?.toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '2px solid rgba(0,0,0,0.05)', marginTop: 24, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.05em' }}>TOTAL ESTIMATE</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 1000 }}>₹{servicePrice}+</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <button className="btn btn-outline" style={{ flex: 1, height: 60 }} onClick={() => setStep(2)}>BACK</button>
                            <button className="btn btn-primary" style={{ flex: 2, height: 60, fontSize: '1rem' }} onClick={handleBook} disabled={loading}>
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
