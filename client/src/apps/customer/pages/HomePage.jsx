import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Zap, Droplets, Wrench, Hammer, MapPin, Star, Clock, Shield, CheckCircle, Phone } from 'lucide-react';
import { useAuth } from '../../../shared/AuthContext';
import api from '../../../shared/api';

const CATEGORY_ICONS = {
    'ac-services': Wind,
    'electrical': Zap,
    'plumbing': Droplets,
    'appliance-repair': Wrench,
    'handyman': Hammer,
};

const CATEGORY_COLORS = {
    'ac-services': '#000000',
    'electrical': '#000000',
    'plumbing': '#000000',
    'appliance-repair': '#000000',
    'handyman': '#000000',
};

const WHY_CHOOSE = [
    { icon: <Shield size={24} />, title: 'Verified Experts', desc: 'All technicians are background-checked and certified.' },
    { icon: <Clock size={24} />, title: 'Same-Day Service', desc: 'Book anytime, get service within hours.' },
    { icon: <CheckCircle size={24} />, title: 'Guaranteed Quality', desc: '100% satisfaction or we redo the job free.' },
    { icon: <Star size={24} />, title: '4.8★ Rated', desc: 'Trusted by thousands of happy customers.' },
];

const AnimatedCounter = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [ref, setRef] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setVisible(true);
        }, { threshold: 0.5 });
        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref]);

    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const end = parseInt(value.replace(/[^0-9.]/g, ''));
        if (isNaN(end)) return;

        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [visible, value, duration]);

    const suffix = value.replace(/[0-9.]/g, '');
    return <span ref={setRef}>{count}{suffix}</span>;
};

export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('Detect location...');

    useEffect(() => {
        api.get('/services/categories').then(({ data }) => setCategories(data.data.categories || [])).catch(console.error);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setLocation(`${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`);
            }, () => setLocation('Location not available'));
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/customer/services?search=${encodeURIComponent(search)}`);
    };

    return (
        <div>
            <section className="hero texture-overlay" style={{ background: 'var(--bg-dark)', padding: '80px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div className="hero-content reveal active" style={{ textAlign: 'center', color: '#fff' }}>
                    <h1 style={{ marginBottom: 16, color: '#fff' }}>PRECISION <span style={{ color: 'var(--color-primary-300)' }}>HOME CARE</span></h1>
                    <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>ENGINEERING-LED FACILITY MANAGEMENT</p>
                    <form className="hero-search" onSubmit={handleSearch} style={{ maxWidth: 640, margin: '0 auto', display: 'flex', background: '#fff', borderRadius: '999px', padding: '6px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..." style={{ flex: 1, padding: '12px 24px', borderRadius: '999px', border: 'none', background: 'transparent', outline: 'none' }} />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 32px', height: '48px' }}>SEARCH</button>
                    </form>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, color: 'rgba(255,255,255,.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <MapPin size={14} /> {location}
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <div className="texture-overlay" style={{ background: '#000', padding: '48px 0', borderBottom: '1px solid #333' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32 }}>
                    {[['50K+', 'CUSTOMERS'], ['1.2K+', 'ENGINEERS'], ['25+', 'SOLUTIONS'], ['4.8/5', 'RATING']].map(([v, l]) => (
                        <div key={l} className="reveal" style={{ textAlign: 'center', color: '#fff' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                                <AnimatedCounter value={v} />
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: .6, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 8 }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* OUR CORE SCOPE Section */}
            <section style={{ padding: '100px 0', background: 'transparent', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, marginBottom: 60, flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', margin: 0, flex: '1 1 300px', color: 'var(--text-primary)' }}>
                            OUR<br />CORE SCOPE
                        </h2>
                        <p style={{ flex: '1 1 400px', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 500 }}>
                            Specialized systems maintenance designed to preserve the structural and functional excellence of your property.
                        </p>
                    </div>

                    <div className="grid-4 reveal" style={{ gap: 16 }}>
                        {[
                            { slug: 'electrical', name: 'ELECTRICAL SERVICES', desc: 'Expert wiring, repairs, and installations.', icon: Zap },
                            { slug: 'plumbing', name: 'PLUMBING SOLUTIONS', desc: 'Fixing leaks and full plumbing setup.', icon: Droplets },
                            { slug: 'ac-services', name: 'HVAC & AC SERVICE', desc: 'Maintain your cooling systems efficiently.', icon: Wind },
                            { slug: 'general', name: 'GENERAL MAINTENANCE', desc: 'Annual and on-demand home care.', icon: Hammer }
                        ].map((cat) => (
                            <Link
                                key={cat.slug}
                                to={`/customer/services?category=${cat.slug}`}
                                style={{
                                    padding: '32px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '20px',
                                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 20,
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'var(--glass-bg-hover)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'var(--bg-card)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <cat.icon size={24} style={{ color: 'var(--text-primary)' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.01em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{cat.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cat.desc}</p>
                                </div>
                                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} /> CERTIFIED PROS
                                    </div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} /> MATERIAL WARRANTY
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ padding: '100px 0', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="container">
                    <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, marginBottom: 60, flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>
                            WHY<br />EARTHSPACE?
                        </h2>
                        <p style={{ flex: '1 1 400px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                            SETTING THE GLOBAL BENCHMARK IN PRECISION FACILITY MANAGEMENT
                        </p>
                    </div>

                    <div className="grid-4" style={{ gap: 32 }}>
                        {WHY_CHOOSE.map((item, i) => (
                            <div
                                key={i}
                                className="architectural-card reveal reveal-stagger"
                                style={{
                                    padding: '40px 32px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'left',
                                    '--delay': i
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ width: 48, height: 48, background: 'rgba(0,0,0,0.04)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--text-primary)' }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title.toUpperCase()}</h4>
                                <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '100px 0', background: 'transparent' }}>
                <div className="container">
                    <div className="text-center mb-16 reveal">
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>THE PROCESS</h2>
                    </div>
                    <div className="grid-4" style={{ gap: 1, background: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
                        {[
                            { step: '01', title: 'SELECT SERVICE', desc: 'Browse and select from 25+ professional solutions.' },
                            { step: '02', title: 'SCHEDULE SLOT', desc: 'Pick your preferred date and time.' },
                            { step: '03', title: 'EXPERT ARRIVAL', desc: 'A certified engineer arrives at your doorstep.' },
                            { step: '04', title: 'QUALITY CHECK', desc: 'Complete the job and rate your experience.' },
                        ].map((s, i) => (
                            <div key={s.step} className="reveal reveal-stagger" style={{ textAlign: 'left', background: 'var(--bg-card)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'background 0.3s', '--delay': i }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                            >
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--border-color)', lineHeight: 1, letterSpacing: '-0.04em' }}>{s.step}</div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>{s.title}</h4>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="texture-overlay" style={{ padding: '120px 0', background: 'var(--color-primary-100)', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div className="reveal" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ color: '#fff', marginBottom: 24, fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.04em' }}>READY FOR PRECISION?</h2>
                    <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: 48, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: 700 }}>EXPERIENCE THE EARTHSPACE ENGINEERING STANDARD TODAY.</p>
                    <Link to="/customer/services">
                        <button
                            className="btn btn-lg animate-pulse"
                            style={{
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                padding: '20px 60px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                letterSpacing: '0.15em'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.letterSpacing = '0.3em';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.letterSpacing = '0.15em';
                            }}
                        >
                            EXPLORE SOLUTIONS
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="texture-overlay" style={{ background: '#050505', color: 'rgba(255,255,255,.5)', padding: '80px 0 40px', borderTop: '1px solid #1a1a1a' }}>
                <div className="container">
                    <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 60, marginBottom: 80 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                <img src="/logo.png" alt="EarthSpace" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
                                <span style={{ fontWeight: 900, color: '#fff', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SERVICES</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,.6)' }}>
                                ENGINEERING-LED FACILITY MANAGEMENT AND PRECISION MAINTENANCE FOR MODERN RESIDENTIAL SPACES.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', marginBottom: 24, fontSize: '0.8rem', letterSpacing: '0.1em' }}>SOLUTIONS</h4>
                            {['AC SERVICES', 'ELECTRICAL', 'PLUMBING', 'APPLIANCE REPAIR', 'HANDYMAN'].map(s => (
                                <Link key={s} to="/customer/services" style={{ display: 'block', fontSize: '0.75rem', marginBottom: 12, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>{s}</Link>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', marginBottom: 24, fontSize: '0.8rem', letterSpacing: '0.1em' }}>CONNECT</h4>
                            <div style={{ fontSize: '0.75rem', lineHeight: 2 }}>
                                <div style={{ marginBottom: 8 }}>📞 +91-9999-999999</div>
                                <div style={{ marginBottom: 8 }}>✉️ SUPPORT@EARTHSPACESERVICES.COM</div>
                                <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                                    <div style={{ width: 32, height: 32, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'scale(1)'; }}>IN</div>
                                    <div style={{ width: 32, height: 32, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'scale(1)'; }}>TW</div>
                                    <div style={{ width: 32, height: 32, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'scale(1)'; }}>IG</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                        <div style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            © 2024 EARTHSPACE SERVICES. ALL RIGHTS RESERVED.
                        </div>
                        <div style={{ display: 'flex', gap: 24, fontSize: '0.7rem' }}>
                            <span style={{ cursor: 'pointer' }}>PRIVACY POLICY</span>
                            <span style={{ cursor: 'pointer' }}>TERMS OF SERVICE</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* WhatsApp FAB */}
            <a href="https://wa.me/919999999999?text=Hello%20Earthspace%20Services%2C%20I%20need%20help." target="_blank" rel="noreferrer">
                <button className="whatsapp-fab animate-pulse" title="WhatsApp Support" style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', background: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </button>
            </a>
        </div>
    );
}
