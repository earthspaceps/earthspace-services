import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, Loader, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../shared/AuthContext';
import api from '../../../shared/api';

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialMode = queryParams.get('mode') || 'login';

    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', otp: '', role: 'customer',
        specializations: '', experienceYears: '', bio: '', idProofUrl: ''
    });

    React.useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : user.role === 'technician' ? '/technician' : '/customer');
        }
    }, [user, navigate]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleLoginEmail = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
            login(data.data.user, data.data.accessToken, data.data.refreshToken);
            navigate('/dashboard');
        } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
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
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.08), transparent 50%), var(--blueprint-grid)',
            backgroundSize: '100% 100%, 40px 40px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="auth-card" style={{
                width: '100%',
                maxWidth: 420,
                backgroundColor: '#0F0F0F',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
                padding: '48px 32px',
                position: 'relative',
                zIndex: 1,
                color: '#fff'
            }}>
                {/* Header elements matching the visual */}
                <div style={{ textAlign: 'center', marginBottom: 36, position: 'relative' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                        <ChevronLeft size={16} /> Back to Hub
                    </button>
                    <div style={{
                        width: 48, height: 48,
                        borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '1.2rem', fontWeight: 600, marginTop: 32
                    }}>
                        E
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, marginBottom: 8, letterSpacing: '-0.02em', textTransform: 'none' }}>
                        {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
                        {mode === 'login' ? 'Sign in to continue to EarthSpace' : 'Join precision engineering management'}
                    </p>
                </div>

                {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                {/* Login Form */}
                {mode === 'login' && (
                    <form onSubmit={handleLoginEmail} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                                <input style={{
                                    width: '100%', padding: '14px 16px 14px 44px',
                                    backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem'
                                }} type="email" placeholder="Email address" required value={form.email} onChange={e => set('email', e.target.value)}
                                    onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                            </div>
                        </div>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                                <input style={{
                                    width: '100%', padding: '14px 44px',
                                    backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem'
                                }} type={showPass ? 'text' : 'password'} placeholder="Password" required value={form.password} onChange={e => set('password', e.target.value)}
                                    onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', padding: 0 }}>
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: 4, marginBottom: 8 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: '#fff', width: 14, height: 14, cursor: 'pointer' }} /> Remember me
                            </label>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }} onClick={e => e.preventDefault()}>Forgot password?</a>
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            backgroundColor: '#fff', color: '#000', fontWeight: 600, border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            transition: 'transform 0.2s', fontSize: '0.95rem'
                        }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            {loading ? <Loader size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', opacity: 0.15 }}>
                            <div style={{ flex: 1, height: 1, background: '#fff' }}></div>
                            <span style={{ padding: '0 12px', fontSize: '0.8rem' }}>or</span>
                            <div style={{ flex: 1, height: 1, background: '#fff' }}></div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="button" onClick={() => { setForm(f => ({ ...f, email: 'admin@earthspaceservices.com', password: 'admin123' })); setError('Admin credentials filled!'); }} style={{
                                flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s'
                            }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                                Fill Admin
                            </button>
                            <button type="button" onClick={() => { setForm(f => ({ ...f, email: 'customer@test.com', password: 'admin123' })); setError('Customer credentials filled!'); }} style={{
                                flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s'
                            }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                                Fill Customer
                            </button>
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 24, marginBottom: 0 }}>
                            Don't have an account? <span style={{ color: '#fff', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('register')}>Sign up</span>
                        </p>
                    </form>
                )}

                {/* Register Form */}
                {mode === 'register' && (
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ position: 'relative' }}>
                            <input style={{
                                width: '100%', padding: '12px 16px',
                                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem'
                            }} placeholder="Full name" required value={form.name} onChange={e => set('name', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input style={{
                                width: '100%', padding: '12px 16px',
                                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem'
                            }} placeholder="+91 9876543210" required value={form.phone} onChange={e => set('phone', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input style={{
                                width: '100%', padding: '12px 16px',
                                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem'
                            }} type="email" placeholder="Email address (optional)" value={form.email} onChange={e => set('email', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input style={{
                                width: '100%', padding: '12px 16px',
                                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem'
                            }} type={showPass ? 'text' : 'password'} placeholder="Password" required value={form.password} onChange={e => set('password', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select style={{
                                width: '100%', padding: '12px 16px',
                                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem',
                                appearance: 'none'
                            }} value={form.role} onChange={e => set('role', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}>
                                <option value="customer" style={{ background: '#0F0F0F' }}>Register as Customer</option>
                                <option value="technician" style={{ background: '#0F0F0F' }}>Register as Technician</option>
                            </select>
                            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.5)' }}>▼</div>
                        </div>

                        {form.role === 'technician' && (
                            <div style={{ padding: 16, borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <input style={{
                                    width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem'
                                }} placeholder="Specializations (e.g. Plumbing)" value={form.specializations} onChange={e => set('specializations', e.target.value)} />
                                <input style={{
                                    width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem'
                                }} type="number" placeholder="Years of Experience" value={form.experienceYears} onChange={e => set('experienceYears', e.target.value)} />
                                <textarea style={{
                                    width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem'
                                }} rows={2} placeholder="Brief bio..." value={form.bio} onChange={e => set('bio', e.target.value)} />
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '14px', borderRadius: '12px', marginTop: 8,
                            backgroundColor: '#fff', color: '#000', fontWeight: 600, border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            transition: 'transform 0.2s', fontSize: '0.95rem'
                        }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            {loading ? <Loader size={18} className="animate-spin" /> : 'Create Account'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 16, marginBottom: 0 }}>
                            Already have an account? <span style={{ color: '#fff', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('login')}>Sign in</span>
                        </p>
                    </form>
                )}
            </div>

            <a href="/" style={{ position: 'absolute', top: 32, left: 32, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                <ChevronLeft size={18} /> Back to Hub
            </a>
        </div>
    );
}
