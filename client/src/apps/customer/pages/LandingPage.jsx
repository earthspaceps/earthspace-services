import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/AuthContext';
import { Zap, Droplets, Wrench, Settings, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    .lp-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .lp-root { font-family: 'Inter', sans-serif; background: #000; color: #fff; overflow-x: hidden; min-height: 100vh; }

    /* Animated gradient orbs */
    .lp-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
        animation: orbFloat 8s ease-in-out infinite;
    }
    @keyframes orbFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-30px) scale(1.05); }
    }

    /* Navbar */
    .lp-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 5%; height: 80px;
        transition: all 0.4s ease;
    }
    .lp-nav.scrolled {
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        height: 64px;
    }
    .lp-nav-links { display: flex; align-items: center; gap: 2rem; }
    .lp-nav-link { color: rgba(255,255,255,0.65); font-size: 0.85rem; font-weight: 500; text-decoration: none; transition: color 0.2s; }
    .lp-nav-link:hover { color: #fff; }

    /* Hero */
    .lp-hero {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        text-align: center; padding: 140px 5% 100px; position: relative; overflow: hidden;
    }
    .lp-badge {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 6px 6px 6px 16px; border-radius: 40px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.04);
        font-size: 0.8rem; color: rgba(255,255,255,0.7);
        text-decoration: none; margin-bottom: 2.5rem;
        transition: all 0.3s ease;
    }
    .lp-badge:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.07); }
    .lp-badge-dot { background: rgba(255,255,255,0.12); border-radius: 50%; padding: 5px; display: flex; }
    .lp-h1 {
        font-size: clamp(2.8rem, 8vw, 5.5rem);
        font-weight: 800; line-height: 1.05; letter-spacing: -0.04em;
        margin-bottom: 1.5rem; color: #fff;
    }
    .lp-h1 span { background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .lp-hero-sub { font-size: 1.1rem; color: rgba(255,255,255,0.55); max-width: 560px; margin: 0 auto 3rem; line-height: 1.7; font-weight: 400; }
    .lp-cta-group { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .lp-btn-primary {
        padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;
        background: #fff; color: #000; border: none; cursor: pointer;
        text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        transition: all 0.3s ease; letter-spacing: 0.01em;
    }
    .lp-btn-primary:hover { background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(255,255,255,0.15); }
    .lp-btn-ghost {
        padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 0.9rem;
        background: transparent; color: rgba(255,255,255,0.75);
        border: 1px solid rgba(255,255,255,0.15); cursor: pointer;
        text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        transition: all 0.3s ease;
    }
    .lp-btn-ghost:hover { border-color: rgba(255,255,255,0.4); color: #fff; background: rgba(255,255,255,0.04); }

    /* Stats ticker */
    .lp-stats {
        display: flex; gap: 0; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 4rem;
        padding-top: 0;
    }
    .lp-stat { flex: 1; padding: 1.5rem 2rem; border-right: 1px solid rgba(255,255,255,0.06); text-align: center; }
    .lp-stat:last-child { border-right: none; }
    .lp-stat-num { font-size: 2rem; font-weight: 800; color: #fff; line-height: 1; }
    .lp-stat-lbl { font-size: 0.7rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px; font-weight: 600; }

    /* Section */
    .lp-section { padding: 7rem 5%; position: relative; }
    .lp-section-tag { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.35); font-weight: 700; margin-bottom: 1rem; }
    .lp-section-h2 { font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; letter-spacing: -0.03em; color: #fff; line-height: 1.1; }
    .lp-section-sub { color: rgba(255,255,255,0.5); font-size: 1rem; margin-top: 0.75rem; max-width: 500px; line-height: 1.7; font-weight: 400; }
    .lp-divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); margin: 0; }

    /* Service cards */
    .lp-services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-top: 3rem; }
    .lp-service-card {
        background: rgba(255,255,255,0.035);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px; padding: 28px;
        display: flex; flex-direction: column; gap: 16px;
        transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        cursor: default;
    }
    .lp-service-card:hover {
        background: rgba(255,255,255,0.065);
        border-color: rgba(255,255,255,0.18);
        transform: translateY(-6px);
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .lp-service-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); }
    .lp-service-h3 { font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; text-transform: uppercase; }
    .lp-service-desc { font-size: 0.85rem; color: rgba(255,255,255,0.45); line-height: 1.6; flex: 1; }
    .lp-service-feats { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; display: flex; flex-direction: column; gap: 8px; }
    .lp-service-feat { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
    .lp-service-feat-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }

    /* Process steps */
    .lp-steps-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; margin-top: 3rem; }
    .lp-step { background: #000; padding: 32px 28px; display: flex; flex-direction: column; gap: 12px; transition: background 0.3s; }
    .lp-step:hover { background: rgba(255,255,255,0.03); }
    .lp-step-num { font-size: 2.5rem; font-weight: 900; color: rgba(255,255,255,0.08); line-height: 1; letter-spacing: -0.04em; }
    .lp-step-title { font-size: 0.9rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.02em; }
    .lp-step-desc { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.6; }

    /* Why us */
    .lp-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
    .lp-why-points { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2.5rem; }
    .lp-why-point-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); font-weight: 800; margin-bottom: 8px; }
    .lp-why-point-desc { font-size: 0.85rem; color: rgba(255,255,255,0.35); line-height: 1.6; }
    .lp-why-visual {
        height: 380px; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px;
        background: rgba(255,255,255,0.02);
        display: flex; align-items: center; justify-content: center;
        position: relative; overflow: hidden;
    }
    .lp-why-grid-bg {
        position: absolute; inset: 0;
        background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
        background-size: 40px 40px;
    }

    /* Footer */
    .lp-footer { padding: 6rem 5% 3rem; background: rgba(255,255,255,0.015); border-top: 1px solid rgba(255,255,255,0.06); }
    .lp-footer-cta-h2 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1.5rem; }
    .lp-footer-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 3rem; margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.06); }
    .lp-footer-link-title { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.35); font-weight: 800; margin-bottom: 1.2rem; }
    .lp-footer-link { color: rgba(255,255,255,0.45); text-decoration: none; font-size: 0.85rem; display: block; margin-bottom: 0.7rem; transition: color 0.2s; }
    .lp-footer-link:hover { color: #fff; }
    .lp-footer-bottom { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; color: rgba(255,255,255,0.25); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; flex-wrap: wrap; gap: 1rem; }

    /* WhatsApp */
    .whatsapp-fab { position: fixed; bottom: 28px; right: 28px; z-index: 999; width: 56px; height: 56px; background: #25d366; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 8px 30px rgba(37,211,102,0.4); transition: all 0.3s ease; }
    .whatsapp-fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(37,211,102,0.6); }

    /* Responsive */
    @media (max-width: 768px) {
        .lp-nav-links { display: none; }
        .lp-h1 { font-size: 2.5rem; }
        .lp-why-grid { grid-template-columns: 1fr; }
        .lp-why-visual { display: none; }
        .lp-stats { flex-direction: column; }
        .lp-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .lp-stat:last-child { border-bottom: none; }
        .lp-why-points { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
        .lp-section { padding: 5rem 1rem; }
        .lp-hero { padding: 120px 1rem 80px; }
        .lp-h1 { font-size: 2rem; }
        .lp-footer { padding: 4rem 1rem 2rem; }
    }
`;

const LandingPage = () => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const services = [
        { icon: <Zap size={22} color="rgba(255,255,255,0.7)" />, title: 'Electrical Services', desc: 'Expert wiring, fault detection, repairs, and full electrical installations.', color: '#f59e0b' },
        { icon: <Droplets size={22} color="rgba(255,255,255,0.7)" />, title: 'Plumbing Solutions', desc: 'Fixing leaks, pipe replacements, and complete plumbing system setup.', color: '#3b82f6' },
        { icon: <Wrench size={22} color="rgba(255,255,255,0.7)" />, title: 'HVAC & AC Service', desc: 'Maintain your cooling and heating systems for maximum efficiency.', color: '#22c55e' },
        { icon: <Settings size={22} color="rgba(255,255,255,0.7)" />, title: 'General Maintenance', desc: 'Annual inspections, on-demand repairs, and preventive home care.', color: '#a855f7' },
    ];

    const steps = [
        { n: '01', title: 'Select Service', desc: 'Browse our catalog and choose the solution you need.' },
        { n: '02', title: 'Schedule Date', desc: 'Pick a date and time slot that fits your schedule.' },
        { n: '03', title: 'Verified Arrival', desc: 'A background-checked technician arrives on time.' },
        { n: '04', title: 'Digital Payment', desc: 'Seamless billing with digital receipt and service report.' },
    ];

    return (
        <div className="lp-root">
            <style>{STYLES}</style>

            {/* Background orbs */}
            <div className="lp-orb" style={{ width: 500, height: 500, top: -200, right: -100, background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent)', animationDelay: '0s' }} />
            <div className="lp-orb" style={{ width: 400, height: 400, top: '40%', left: -150, background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent)', animationDelay: '3s' }} />
            <div className="lp-orb" style={{ width: 350, height: 350, bottom: '20%', right: '10%', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)', animationDelay: '5s' }} />

            {/* Navbar */}
            <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,0.8)' }} />
                    <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff' }}>EarthSpace <span style={{ fontWeight: 300, opacity: 0.45 }}>Services</span></span>
                </div>
                <div className="lp-nav-links">
                    <a href="#services" className="lp-nav-link">Services</a>
                    <a href="#process" className="lp-nav-link">Process</a>
                    <a href="#why-us" className="lp-nav-link">Why Us</a>
                    <a href="#contact" className="lp-nav-link">Contact</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <Link to="/customer" className="lp-btn-primary" style={{ padding: '10px 22px' }}>Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Sign In</Link>
                            <Link to="/login?mode=register" className="lp-btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <section className="lp-hero">
                <div style={{ maxWidth: 800, position: 'relative', zIndex: 2 }}>
                    <a href="#services" className="lp-badge">
                        Empowered by EarthSpace Project Solutions LLP
                        <div className="lp-badge-dot"><ArrowRight size={12} /></div>
                    </a>
                    <h1 className="lp-h1">
                        Modern Home Services<br />
                        <span>Built on Precision.</span>
                    </h1>
                    <p className="lp-hero-sub">
                        Specialized facility maintenance by certified engineers. From electrical to HVAC — done right, every time.
                    </p>
                    <div className="lp-cta-group">
                        <Link to={user ? '/customer/services' : '/login'} className="lp-btn-primary">
                            Book a Service <ArrowRight size={16} />
                        </Link>
                        <a href="#services" className="lp-btn-ghost">Explore Services</a>
                    </div>

                    {/* Stats */}
                    <div className="lp-stats">
                        {[
                            { num: '500+', lbl: 'Jobs Completed' },
                            { num: '50+', lbl: 'Verified Engineers' },
                            { num: '98%', lbl: 'Satisfaction Rate' },
                            { num: '24hr', lbl: 'Response Time' },
                        ].map(s => (
                            <div key={s.lbl} className="lp-stat">
                                <div className="lp-stat-num">{s.num}</div>
                                <div className="lp-stat-lbl">{s.lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="lp-divider" />

            {/* Services Section */}
            <section id="services" className="lp-section" style={{ position: 'relative' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '1rem' }}>
                        <div>
                            <p className="lp-section-tag">Our Core Scope</p>
                            <h2 className="lp-section-h2">Precision Maintenance<br />for Every System.</h2>
                        </div>
                        <p className="lp-section-sub" style={{ maxWidth: 360 }}>
                            Specialized systems maintenance designed to preserve the structural and functional excellence of your property.
                        </p>
                    </div>
                    <div className="lp-services-grid">
                        {services.map((s, i) => (
                            <div key={i} className="lp-service-card">
                                <div className="lp-service-icon" style={{ borderColor: `${s.color}22`, background: `${s.color}10` }}>
                                    {s.icon}
                                </div>
                                <h3 className="lp-service-h3">{s.title}</h3>
                                <p className="lp-service-desc">{s.desc}</p>
                                <div className="lp-service-feats">
                                    <div className="lp-service-feat"><div className="lp-service-feat-dot" />Certified Professionals</div>
                                    <div className="lp-service-feat"><div className="lp-service-feat-dot" />Material Warranty</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="lp-divider" />

            {/* Process Section */}
            <section id="process" className="lp-section">
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div>
                        <p className="lp-section-tag">How It Works</p>
                        <h2 className="lp-section-h2">The Blueprint Process</h2>
                        <p className="lp-section-sub">Four simple steps from booking to completion.</p>
                    </div>
                    <div className="lp-steps-grid">
                        {steps.map((s, i) => (
                            <div key={i} className="lp-step">
                                <div className="lp-step-num">{s.n}</div>
                                <div className="lp-step-title">{s.title}</div>
                                <div className="lp-step-desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="lp-divider" />

            {/* Why Us */}
            <section id="why-us" className="lp-section">
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div className="lp-why-grid">
                        <div>
                            <p className="lp-section-tag">Why EarthSpace</p>
                            <h2 className="lp-section-h2">Engineered<br /><span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>Reliability.</span></h2>
                            <div className="lp-why-points">
                                {[
                                    { t: '01. Verified', d: 'Rigorous background checks for every professional technician we deploy.' },
                                    { t: '02. Transparent', d: 'Architecture-grade estimates with zero hidden costs or surprise charges.' },
                                    { t: '03. On-Time', d: 'Guaranteed punctuality with real-time tracking for your booking.' },
                                    { t: '04. Insured', d: 'Every job is backed by material warranty and service guarantee.' },
                                ].map(p => (
                                    <div key={p.t}>
                                        <div className="lp-why-point-title">{p.t}</div>
                                        <div className="lp-why-point-desc">{p.d}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lp-why-visual">
                            <div className="lp-why-grid-bg" />
                            <div style={{ position: 'relative', textAlign: 'center' }}>
                                <ShieldCheck size={72} strokeWidth={1} style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)' }} />
                                <div style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>100%</div>
                                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginTop: 8, fontWeight: 700 }}>Service Compliance</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="lp-divider" />

            {/* Footer CTA + Links */}
            <footer id="contact" className="lp-footer">
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', paddingBottom: '3rem' }}>
                        <h2 className="lp-footer-cta-h2">Ready to Maintain?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', fontSize: '1rem' }}>Schedule your first service in under 2 minutes.</p>
                        <Link to={user ? '/customer/services' : '/login'} className="lp-btn-primary" style={{ fontSize: '0.95rem', padding: '16px 40px' }}>
                            Start Booking <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="lp-footer-links">
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                                <span style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.05em' }}>EARTHSPACE SERVICES</span>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', lineHeight: 1.7 }}>A specialized maintenance division of EarthSpace Project Solutions LLP.</p>
                        </div>
                        <div>
                            <div className="lp-footer-link-title">Resources</div>
                            <a href="#" className="lp-footer-link">Tech Insights</a>
                            <a href="#" className="lp-footer-link">Project Portfolio</a>
                            <a href="#" className="lp-footer-link">Career Openings</a>
                        </div>
                        <div>
                            <div className="lp-footer-link-title">Contact Hub</div>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>support@earthspace.pro</p>
                            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>+91 96057 69752</p>
                        </div>
                    </div>
                    <div className="lp-footer-bottom">
                        <span>© 2026 EarthSpace Project Solutions LLP.</span>
                        <span>Engineered for Precision.</span>
                    </div>
                </div>
            </footer>

            {/* WhatsApp FAB */}
            <a href="https://wa.me/919605769752" target="_blank" rel="noreferrer" className="whatsapp-fab">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </a>
        </div>
    );
};

export default LandingPage;
