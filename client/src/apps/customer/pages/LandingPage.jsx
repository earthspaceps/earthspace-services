import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    ChevronRight,
    ArrowRight,
    Menu,
    X,
    MapPin,
    Star
} from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
                    transform: translateY(-2px);
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
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                borderBottom: scrolled ? '1px solid #e5e5e5' : 'none',
                padding: '1.5rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.4s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo.png" alt="EarthSpace" style={{ height: '40px', filter: 'grayscale(100%) contrast(120%)' }} />
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', fontSize: '1.2rem' }}>SERVICES</span>
                </div>

                <div className="desktop-links" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                    <a href="#services" className="nav-link">Services</a>
                    <a href="#process" className="nav-link">Process</a>
                    <Link to="/login" className="btn-bw btn-bw-outline" style={{ padding: '0.6rem 1.5rem' }}>Login</Link>
                </div>

                <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} className="mobile-toggle">
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Hero Section */}
            <section className="blueprint-bg" style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '0 5%',
                position: 'relative',
                borderBottom: '1px solid #e5e5e5'
            }}>
                <div className="reveal" style={{ maxWidth: '900px' }}>
                    <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em', marginBottom: '1.5rem', color: '#666' }}>
                        Structural Integrity • Professional Care
                    </div>
                    <h1 className="hero-headline">
                        Home <span style={{ fontWeight: 300, fontStyle: 'italic', color: '#666' }}>Maintenance</span><br />
                        As Architecture.
                    </h1>
                    <p style={{ fontSize: '1.25rem', margin: '2.5rem 0 3.5rem', maxWidth: '600px', fontWeight: 300, borderLeft: '1px solid #050505', paddingLeft: '2rem' }}>
                        Precision-led facility management and maintenance for modern living spaces. Managed by EarthSpace Project Solutions.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/login" className="btn-bw btn-bw-filled">Book a Service</Link>
                        <a href="#services" className="btn-bw btn-bw-outline">Explore Scope</a>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" style={{ padding: '8rem 5%', borderBottom: '1px solid #e5e5e5' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '6rem', alignItems: 'end' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textTransform: 'uppercase', fontWeight: 800, margin: 0, lineHeight: 0.9 }}>
                        Our <br />Core Scope
                    </h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
                        Specialized systems maintenance designed to preserve the structural and functional excellence of your property.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', backgroundColor: '#050505', border: '1px solid #050505' }}>
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
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '-0.02em' }}>The Blueprint Process</h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
                    {steps.map((s, i) => (
                        <div key={i} style={{ flex: 1, minWidth: '240px', borderTop: '1px solid #050505', paddingTop: '2.5rem' }}>
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
            <footer style={{ padding: '8rem 5% 4rem', backgroundColor: '#050505', color: '#fff', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', fontWeight: 800, color: '#fff', marginBottom: '2rem' }}>Ready to Maintain?</h2>
                <div style={{ marginBottom: '4rem' }}>
                    <Link to="/login" className="btn-bw" style={{ borderColor: '#fff', color: '#fff' }}>Start Booking</Link>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                    <div>
                        <img src="/logo.png" alt="EarthSpace" style={{ height: '30px', filter: 'brightness(0) invert(1)', marginBottom: '1.5rem' }} />
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>A specialized maintenance division of EarthSpace Project Solutions LLP.</p>
                    </div>
                    <div>
                        <h5 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '1.5rem', color: '#fff' }}>Links</h5>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}><a href="#" className="footer-link">Insights</a></li>
                            <li style={{ marginBottom: '0.5rem' }}><a href="#" className="footer-link">Projects</a></li>
                            <li style={{ marginBottom: '0.5rem' }}><a href="#" className="footer-link">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '1.5rem', color: '#fff' }}>Contact</h5>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>contact@earthspaceprojects.in</p>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>+91 96057 69752</p>
                    </div>
                </div>
                <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#444' }}>
                    <span>© 2026 EarthSpace Project Solutions LLP.</span>
                    <span>DESIGNED FOR PRECISION.</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
