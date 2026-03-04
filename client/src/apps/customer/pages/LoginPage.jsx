import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../../../shared/AuthContext';
import api from '../../../shared/api';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // login | otp | register
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', otp: '', role: 'customer',
        specializations: '', experienceYears: '', bio: '', idProofUrl: ''
    });

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleLoginEmail = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
            login(data.data.user, data.data.accessToken, data.data.refreshToken);
            navigate('/');
        } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
        setLoading(false);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            await api.post('/auth/send-otp', { phone: form.phone });
            setStep(2);
        } catch (err) { setError(err.response?.data?.message || 'Failed to send OTP.'); }
        setLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const { data } = await api.post('/auth/verify-otp', { phone: form.phone, otp: form.otp });
            if (!data.data.user.name || data.data.user.name === 'New User') {
                setMode('register'); setStep(1);
            } else {
                login(data.data.user, data.data.accessToken, data.data.refreshToken);
                navigate('/');
            }
        } catch (err) { setError(err.response?.data?.message || 'Invalid OTP.'); }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const payload = {
                name: form.name, email: form.email, phone: form.phone,
                password: form.password, role: form.role
            };

            if (form.role === 'technician') {
                payload.specializations = form.specializations.split(',').map(s => s.trim());
                payload.experienceYears = form.experienceYears;
                payload.bio = form.bio;
                payload.idProofUrl = form.idProofUrl;
            }

            const { data } = await api.post('/auth/register', payload);
            login(data.data.user, data.data.accessToken, data.data.refreshToken);
            navigate('/');
        } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wrench size={22} color="#fff" />
                        </div>
                    </div>
                    <div className="brand">Earthspace Services</div>
                    <div className="tagline">Reliable Home Maintenance Experts</div>
                </div>

                {/* Tab toggle */}
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 16 }}>
                    {[['login', 'Email Login'], ['otp', 'OTP Login']].map(([m, label]) => (
                        <button key={m} onClick={() => { setMode(m); setStep(1); setError(''); }}
                            style={{
                                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '0.85rem',
                                background: mode === m ? '#fff' : 'transparent',
                                color: mode === m ? '#2563eb' : '#64748b',
                                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
                                transition: 'all .2s'
                            }}>{label}</button>
                    ))}
                </div>

                {/* Quick Fill Buttons (Test Mode) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                    {[
                        ['Admin', 'admin@earthspaceservices.com'],
                        ['Customer', 'customer@test.com'],
                        ['Tech', 'tech@test.com']
                    ].map(([label, email]) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => {
                                setMode('login');
                                setForm(f => ({ ...f, email: email, password: 'admin123' }));
                                setError(`${label} credentials filled!`);
                            }}
                            style={{
                                padding: '8px 4px', borderRadius: 8, border: '1px dashed #2563eb',
                                background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: 600,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                            }}
                        >
                            <Lock size={10} /> {label}
                        </button>
                    ))}
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {/* Email + Password Login */}
                {mode === 'login' && (
                    <form onSubmit={handleLoginEmail} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input className="form-control" style={{ paddingLeft: 36 }} type="email" placeholder="you@email.com" required value={form.email} onChange={e => set('email', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input className="form-control" style={{ paddingLeft: 36, paddingRight: 40 }} type={showPass ? 'text' : 'password'} placeholder="••••••••" required value={form.password} onChange={e => set('password', e.target.value)} />
                                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8' }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
                            {loading ? <Loader size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Sign In</>}
                        </button>
                        <p className="text-center text-sm" style={{ color: '#64748b' }}>
                            No account? <button type="button" className="text-blue" style={{ background: 'none', border: 'none', fontWeight: 600 }} onClick={() => setMode('register')}>Register here</button>
                        </p>
                    </form>
                )}

                {/* OTP Login */}
                {mode === 'otp' && step === 1 && (
                    <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input className="form-control" style={{ paddingLeft: 36 }} type="tel" placeholder="+91 9876543210" required value={form.phone} onChange={e => set('phone', e.target.value)} />
                            </div>
                        </div>
                        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
                            {loading ? <Loader size={16} /> : <>Send OTP <ArrowRight size={16} /></>}
                        </button>
                    </form>
                )}

                {mode === 'otp' && step === 2 && (
                    <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <p className="text-sm text-center" style={{ color: '#64748b' }}>OTP sent to <strong>{form.phone}</strong></p>
                        <div className="form-group">
                            <label className="form-label">Enter 6-digit OTP</label>
                            <input className="form-control" style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: 700 }}
                                type="text" maxLength={6} placeholder="------" value={form.otp} onChange={e => set('otp', e.target.value)} />
                        </div>
                        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
                            {loading ? <Loader size={16} /> : <>Verify OTP <ArrowRight size={16} /></>}
                        </button>
                        <button type="button" className="btn btn-ghost btn-block" onClick={() => setStep(1)}>← Change Number</button>
                    </form>
                )}

                {/* Register */}
                {mode === 'register' && (
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-control" placeholder="Your full name" required value={form.name} onChange={e => set('name', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-control" placeholder="+91 9876543210" required value={form.phone} onChange={e => set('phone', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email (optional)</label>
                            <input className="form-control" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-control" type="password" placeholder="Min 8 characters" required value={form.password} onChange={e => set('password', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Register as</label>
                            <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
                                <option value="customer">Customer</option>
                                <option value="technician">Technician</option>
                            </select>
                        </div>

                        {form.role === 'technician' && (
                            <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className="form-group">
                                    <label className="form-label">Specializations (e.g. Plumbing, AC)</label>
                                    <input className="form-control" placeholder="Service skills" value={form.specializations} onChange={e => set('specializations', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Years of Experience</label>
                                    <input className="form-control" type="number" placeholder="5" value={form.experienceYears} onChange={e => set('experienceYears', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Brief Bio</label>
                                    <textarea className="form-control" rows={3} placeholder="Tell us about yourself..." value={form.bio} onChange={e => set('bio', e.target.value)} />
                                </div>
                            </div>
                        )}

                        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
                            {loading ? <Loader size={16} /> : 'Create Account'}
                        </button>

                        <button type="button" className="btn btn-ghost btn-block" onClick={() => setMode('login')}>← Back to Login</button>
                    </form>
                )}

                <p className="text-center mt-4 text-xs" style={{ color: '#94a3b8' }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>

            {/* Floating WhatsApp Support */}
            <a href="https://wa.me/919999999999?text=Hello%20Earthspace%20Services%2C%20I%20need%20help." target="_blank" rel="noreferrer">
                <button className="whatsapp-fab" title="WhatsApp Support">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </button>
            </a>
        </div>
    );
}
