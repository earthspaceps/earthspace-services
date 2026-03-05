import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/AuthContext';
import {
    Briefcase,
    Wrench,
    Zap,
    Droplets,
    Settings,
    ShieldCheck,
    Shield,
    Clock,
    CreditCard,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ArrowRight,
    Menu,
    X,
    MapPin,
    Star
} from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Plan2: Intersection Observer for Reveal Animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const services = [
        { icon: <Zap size={24} />, title: 'Electrical Services', desc: 'Expert wiring, repairs, and installations.' },
        { icon: <Droplets size={24} />, title: 'Plumbing Solutions', desc: 'Fixing leaks and full plumbing setup.' },
        { icon: <Wrench size={24} />, title: 'HVAC & AC Service', desc: 'Maintain your cooling systems efficiently.' },
        { icon: <Settings size={24} />, title: 'General Maintenance', desc: 'Annual and on-demand home care.' },
    ];

    const steps = [
        { n: "01", title: "Select Service", desc: "Choose the maintenance you need via our portal." },
        { n: "02", title: "Schedule Date", desc: "Pick a time slot that fits your busy schedule." },
        { n: "03", title: "Verified Service", desc: "A qualified technician arrives at your door." },
        { n: "04", title: "Digital Payment", desc: "Seamless billing and completion report." },
    ];

    return (
        <div className="landing-container" style={{
            backgroundColor: '#ffffff',
            color: '#050505',
            fontFamily: "'Inter', sans-serif",
            overflowX: 'hidden',
            lineHeight: 1.6
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                .blueprint-bg {
                    background-image: 
                        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                .nav-link {
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.1em;
                    font-weight: 600;
                    color: #050505;
                    text-decoration: none;
                    transition: opacity 0.3s;
                }

                .nav-link:hover {
                    opacity: 0.6;
                }

                .hero-headline {
                    font-size: clamp(3rem, 8vw, 6rem);
                    font-weight: 800;
                    line-height: 0.95;
                    letter-spacing: -0.05em;
                    text-transform: uppercase;
                }

                .btn-bw {
                    display: inline-block;
                    padding: 1.2rem 3rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-size: 0.75rem;
                    cursor: pointer;
                    border: 1px solid #050505;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    text-decoration: none;
                }

                .btn-bw-filled {
                    background: #050505;
                    color: #ffffff;
                }

                .btn-bw-filled:hover {
                    background: transparent;
                    color: #050505;
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 12px 12px 0px #000;
                }

                .btn-bw-outline:hover {
                    background: #050505;
                    color: #ffffff;
                    transform: translateY(-2px);
                }

                .service-card {
                    padding: 4rem 3rem;
                    border: 1px solid #050505;
                    transition: all 0.4s ease;
                    background: #fff;
                }

                .service-card:hover {
                    background: #050505;
                    color: #ffffff;
                    transform: translateY(-10px);
                }

                .footer-link {
                    color: #999;
                    text-decoration: none;
                    transition: color 0.3s;
                    font-size: 0.9rem;
                }

                .footer-link:hover {
                    color: #fff;
                }

                @keyframes revealUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .reveal {
                    animation: revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .mobile-menu-enter {
                    animation: slideDown 0.4s ease forwards;
                }

                @keyframes slideDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
            `}</style>

            {/* Navbar */}
            <nav className={`customer-navbar ${scrolled ? 'shrunk' : ''}`} style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                backgroundColor: scrolled ? 'rgba(0,0,0,0.9)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                padding: '0 5%',
                height: scrolled ? '70px' : '90px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: 8, background: '#fff', borderRadius: 8 }}>
                        <img src="/logo.png" alt="EarthSpace" style={{ height: '24px', filter: 'grayscale(100%) brightness(0)' }} />
                    </div>
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '1.1rem', color: '#fff' }}>SERVICES</span>
                </div>

                <div className="desktop-links" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <a href="#services" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>Features</a>
                    <a href="#process" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>Solutions</a>
                    <a href="#" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>Pricing</a>
                    <a href="#" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>About</a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Login</Link>
                    <Link to="/login" style={{
                        padding: '10px 24px',
                        backgroundColor: '#fff',
                        color: '#000',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        transition: 'transform 0.3s'
                    }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="texture-overlay" style={{
                background: '#000',
                color: '#fff',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '140px 5% 100px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)' }}></div>

                <div className="reveal active" style={{ maxWidth: '1000px', position: 'relative', zIndex: 2 }}>
                    {/* Pill Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '6px 6px 6px 16px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '40px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '3rem',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.8)'
                    }}>
                        Introducing Precision Tech for 2026
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', padding: '4px' }}>
                            <ArrowRight size={14} />
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 10vw, 5.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: '-0.04em',
                        marginBottom: '2rem',
                        color: '#fff'
                    }}>
                        Modern Solutions for <br />
                        <span style={{ color: '#fff' }}>Home Engineering.</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: 'rgba(255,255,255,0.6)',
                        maxWidth: '700px',
                        margin: '0 auto 3.5rem',
                        fontWeight: 400,
                        lineHeight: 1.6
                    }}>
                        Highly precise specialized systems maintenance for modern living and workspaces. Experience maintenance that feels the way it should.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to="/login" style={{
                            padding: '16px 36px',
                            backgroundColor: '#fff',
                            color: '#000',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: 700,
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: '0 10px 30px rgba(255,255,255,0.1)'
                        }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            Start Maintaining
                        </Link>
                        <a href="#services" style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            Request a survey <ArrowRight size={18} />
                        </a>
                    </div>
                </div>

                {/* Side Arrows Visual */}
                <div style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, cursor: 'pointer' }} className="desktop-links">
                    <ChevronDown size={40} style={{ transform: 'rotate(90deg)' }} strokeWidth={1} />
                </div>
                <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, cursor: 'pointer' }} className="desktop-links">
                    <ChevronDown size={40} style={{ transform: 'rotate(-90deg)' }} strokeWidth={1} />
                </div>
            </section>

            {/* Services Section */}
            <section id="services" style={{ padding: '8rem 5%', borderBottom: '1px solid #e5e5e5' }}>
                <div className="grid-2 reveal" style={{ gap: '4rem', marginBottom: '6rem', alignItems: 'end' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textTransform: 'uppercase', fontWeight: 800, margin: 0, lineHeight: 0.9 }}>
                        Our <br />Core Scope
                    </h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
                        Specialized systems maintenance designed to preserve the structural and functional excellence of your property.
                    </p>
                </div>

                <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', backgroundColor: '#050505', border: '1px solid #050505' }}>
                    {services.map((s, i) => (
                        <div key={i} className="service-card">
                            <div style={{ marginBottom: '2rem', opacity: 0.4 }}>{s.icon}</div>
                            <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 700 }}>{s.title}</h3>
                            <p style={{ fontSize: '1rem', fontWeight: 300 }}>{s.desc}</p>
                            <ul style={{ listStyle: 'none', marginTop: '2rem', padding: 0 }}>
                                <li style={{ padding: '0.8rem 0', borderTop: '1px solid rgba(0,0,0,0.1)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Certified Pros</li>
                                <li style={{ padding: '0.8rem 0', borderTop: '1px solid rgba(0,0,0,0.1)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Material Warranty</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section id="process" style={{ padding: '8rem 5%', backgroundColor: '#f4f4f4' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '-0.02em' }}>The Blueprint Process</h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
                    {steps.map((s, i) => (
                        <div key={i} className="reveal reveal-stagger" style={{ flex: 1, minWidth: '240px', borderTop: '1px solid #050505', paddingTop: '2.5rem', '--delay': i }}>
                            <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#e5e5e5', display: 'block', lineHeight: 1, marginBottom: '1rem' }}>{s.n}</span>
                            <h4 style={{ textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>{s.title}</h4>
                            <p style={{ fontSize: '0.95rem', color: '#666', fontWeight: 300 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Us Section */}
            <section style={{ padding: '8rem 5%', backgroundColor: '#050505', color: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textTransform: 'uppercase', fontWeight: 800, lineHeight: 0.9, color: '#fff', marginBottom: '2.5rem' }}>
                            Engineered <br /><span style={{ color: '#999', fontStyle: 'italic', fontWeight: 300 }}>Reliability</span>
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            <div>
                                <h5 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>01. VERIFIED</h5>
                                <p style={{ color: '#999', fontSize: '0.95rem' }}>Rigorous background checks for every professional technician.</p>
                            </div>
                            <div>
                                <h5 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>02. PRICING</h5>
                                <p style={{ color: '#999', fontSize: '0.95rem' }}>Transparent, architecture-grade estimates with no hidden costs.</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '400px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div className="blueprint-bg" style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)' }}></div>
                        <div style={{ position: 'relative', textAlign: 'center' }}>
                            <ShieldCheck size={80} strokeWidth={1} style={{ marginBottom: '2rem' }} />
                            <div style={{ fontSize: '3rem', fontWeight: 800 }}>100%</div>
                            <div style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', color: '#999' }}>Service Compliance</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="texture-overlay" style={{ padding: '8rem 5% 4rem', backgroundColor: '#050505', color: '#fff', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', fontWeight: 800, color: '#fff', marginBottom: '2rem' }}>Ready to Maintain?</h2>
                <div style={{ marginBottom: '4rem' }}>
                    <Link to="/login" className="btn-bw" style={{ borderColor: '#fff', color: '#fff' }}>Start Booking</Link>
                </div>

                <div style={{ borderTop: '1px solid #fff', paddingTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'left' }}>
                    <div>
                        <img src="/logo.png" alt="EarthSpace" style={{ height: '32px', filter: 'brightness(0) invert(1)', marginBottom: '24px' }} />
                        <p style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.8 }}>A specialized maintenance division of<br />EarthSpace Project Solutions LLP.</p>
                    </div>
                    <div>
                        <h5 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.7rem', marginBottom: '24px', color: '#fff', fontWeight: 900 }}>RESOURCES</h5>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}><a href="#" className="footer-link">TECH INSIGHTS</a></li>
                            <li style={{ marginBottom: '12px' }}><a href="#" className="footer-link">PROJECT PORTFOLIO</a></li>
                            <li style={{ marginBottom: '12px' }}><a href="#" className="footer-link">CAREER OPENINGS</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.7rem', marginBottom: '24px', color: '#fff', fontWeight: 900 }}>CONTACT HUB</h5>
                        <p style={{ color: '#999', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em', marginBottom: '8px' }}>SUPPORT@EARTHSPACE.PRO</p>
                        <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 900 }}>+91 96057 69752</p>
                    </div>
                </div>
                <div style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#666', fontWeight: 800, letterSpacing: '0.1em' }}>
                    <span>© 2026 EARTHSPACE PROJECT SOLUTIONS LLP.</span>
                    <span>ENGINEERED FOR PRECISION.</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
