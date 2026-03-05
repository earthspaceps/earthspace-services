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
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-size: 0.8rem;
                    cursor: pointer;
                    border-radius: 999px;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    text-decoration: none;
                    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
                    color: #000;
                    box-shadow: 
                        0 4px 12px rgba(0, 0, 0, 0.08), 
                        inset 0 1px 0 rgba(255, 255, 255, 1),
                        inset 0 -1px 2px rgba(0, 0, 0, 0.05);
                }

                .btn-bw-filled {
                    background: linear-gradient(180deg, #050505 0%, #262626 100%);
                    color: #fff;
                    border: 1px solid #000;
                    box-shadow: 
                        0 4px 12px rgba(0, 0, 0, 0.2), 
                        inset 0 1px 1px rgba(255, 255, 255, 0.2);
                }

                .btn-bw-filled:hover {
                    background: #ffffff;
                    color: #050505;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                }

                .btn-bw-outline:hover {
                    background: #f8fafc;
                    color: #050505;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                .service-card {
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    height: 100%;
                }

                .service-card:hover {
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
                    <a href="#services" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>Services</a>
                    <a href="#process" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>Process</a>
                    <a href="#why-us" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>Why Us</a>
                    <a href="#contact" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontSize: '0.9rem' }}>Contact</a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Sign In</Link>
                    <Link to="/login?mode=register" style={{
                        padding: '10px 24px',
                        backgroundColor: '#fff',
                        color: '#000',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        transition: 'transform 0.3s'
                    }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        Register
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
                    <a href="#services" style={{
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
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none'
                    }}>
                        Empowered by EarthSpace Project Solutions
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', padding: '4px' }}>
                            <ArrowRight size={14} />
                        </div>
                    </a>

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
                    </div>
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
                        <div key={i} className="service-card" style={{ display: 'flex', flexDirection: 'column', border: 'none' }}>
                            <div className="card-header" style={{ backgroundColor: '#ffffff', padding: '3.5rem 2.5rem 2rem', color: '#000' }}>
                                <div style={{ marginBottom: '1.5rem', color: '#000' }}>{s.icon}</div>
                                <h3 style={{ fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: 0, fontWeight: 900, letterSpacing: '-0.02em' }}>{s.title}</h3>
                            </div>
                            <div className="card-body" style={{
                                padding: '2.5rem 2.5rem 4rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderTop: 'none',
                                flex: 1,
                                color: 'rgba(255,255,255,0.8)'
                            }}>
                                <p style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.7, marginBottom: '2.5rem', color: 'rgba(255,255,255,0.6)' }}>{s.desc}</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: '#fff' }}>✓</span> Certified Pros
                                    </li>
                                    <li style={{ padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: '#fff' }}>✓</span> Material Warranty
                                    </li>
                                </ul>
                            </div>
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
            <section id="why-us" style={{ padding: '8rem 5%', backgroundColor: '#050505', color: '#fff' }}>
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
            <footer id="contact" className="texture-overlay" style={{ padding: '8rem 5% 4rem', backgroundColor: '#050505', color: '#fff', textAlign: 'center' }}>
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

            {/* WhatsApp FAB */}
            <a href="https://wa.me/919605769752" target="_blank" rel="noreferrer" className="whatsapp-fab">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </a>
        </div>
    );
};

export default LandingPage;
