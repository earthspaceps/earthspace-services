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
    'ac-services': '#3b82f6',
    'electrical': '#f59e0b',
    'plumbing': '#06b6d4',
    'appliance-repair': '#8b5cf6',
    'handyman': '#10b981',
};

const WHY_CHOOSE = [
    { icon: <Shield size={24} />, title: 'Verified Experts', desc: 'All technicians are background-checked and certified.' },
    { icon: <Clock size={24} />, title: 'Same-Day Service', desc: 'Book anytime, get service within hours.' },
    { icon: <CheckCircle size={24} />, title: 'Guaranteed Quality', desc: '100% satisfaction or we redo the job free.' },
    { icon: <Star size={24} />, title: '4.8★ Rated', desc: 'Trusted by thousands of happy customers.' },
];

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
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/customer/services?search=${encodeURIComponent(search)}`);
    };

    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <h1 style={{ marginBottom: 12 }}>Your Home, <span style={{ color: '#93c5fd' }}>Our Expertise</span></h1>
                    <p className="hero-tagline">Reliable Home Maintenance Experts at Your Doorstep.<br />Book verified technicians in minutes.</p>
                    <form className="hero-search" onSubmit={handleSearch}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search AC repair, electrician, plumber..." />
                        <button type="submit">Search</button>
                    </form>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: 'rgba(255,255,255,.7)', fontSize: '0.85rem' }}>
                        <MapPin size={14} /> {location}
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <div style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)', padding: '20px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
                    {[['50,000+', 'Happy Customers'], ['1,200+', 'Verified Technicians'], ['25+', 'Services'], ['4.8/5', 'Average Rating']].map(([v, l]) => (
                        <div key={l} style={{ textAlign: 'center', color: '#fff' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{v}</div>
                            <div style={{ fontSize: '0.8rem', opacity: .8 }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Categories */}
            <section style={{ padding: '60px 0', background: '#fff' }}>
                <div className="container">
                    <div className="text-center mb-6">
                        <h2>Our Services</h2>
                        <p style={{ marginTop: 8 }}>Choose from our wide range of professional home services</p>
                    </div>
                    <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
                        {(categories.length > 0 ? categories : [
                            { slug: 'ac-services', name: 'AC Services', description: 'Repair, installation & maintenance' },
                            { slug: 'electrical', name: 'Electrical', description: 'Wiring, switches & CCTV' },
                            { slug: 'plumbing', name: 'Plumbing', description: 'Leak, drain & pipe repair' },
                            { slug: 'appliance-repair', name: 'Appliance Repair', description: 'Fridge, AC, washer & more' },
                            { slug: 'handyman', name: 'Handyman', description: 'Furniture, carpentry & drilling' },
                        ]).map(cat => {
                            const Icon = CATEGORY_ICONS[cat.slug] || Wrench;
                            const color = CATEGORY_COLORS[cat.slug] || '#3b82f6';
                            return (
                                <Link key={cat.slug} to={`/customer/services?category=${cat.slug}`}>
                                    <div className="service-cat-card">
                                        <div className="cat-icon" style={{ background: `${color}15`, color }}>
                                            <Icon size={28} />
                                        </div>
                                        <h3>{cat.name}</h3>
                                        <p>{cat.description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ padding: '60px 0', background: 'var(--color-grey-50)' }}>
                <div className="container">
                    <div className="text-center mb-6">
                        <h2>Why Earthspace Services?</h2>
                        <p style={{ marginTop: 8 }}>We set the standard for home maintenance services</p>
                    </div>
                    <div className="grid-4">
                        {WHY_CHOOSE.map((item, i) => (
                            <div key={i} className="card card-body text-center" style={{ padding: 28 }}>
                                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#2563eb' }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ marginBottom: 8 }}>{item.title}</h4>
                                <p className="text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '60px 0', background: '#fff' }}>
                <div className="container">
                    <div className="text-center mb-6"><h2>How It Works</h2></div>
                    <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        {[
                            { step: '01', title: 'Choose Service', desc: 'Browse and select from 25+ home services.' },
                            { step: '02', title: 'Book a Slot', desc: 'Pick your preferred date and time.' },
                            { step: '03', title: 'Expert Arrives', desc: 'A verified technician comes to your home.' },
                            { step: '04', title: 'Pay & Rate', desc: 'Pay securely and rate your experience.' },
                        ].map(s => (
                            <div key={s.step} className="text-center">
                                <div style={{ width: 56, height: 56, borderRadius: 50, background: 'linear-gradient(135deg,#2563eb,#1e40af)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, margin: '0 auto 16px' }}>{s.step}</div>
                                <h4 style={{ marginBottom: 8 }}>{s.title}</h4>
                                <p className="text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '60px var(--content-padding)', background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', textAlign: 'center', color: '#fff' }}>
                <h2 style={{ color: '#fff', marginBottom: 12 }}>Ready to Book Your First Service?</h2>
                <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: 28 }}>Get started in under 2 minutes. No registration required to browse.</p>
                <Link to="/customer/services">
                    <button className="btn" style={{ background: '#fff', color: '#2563eb', fontSize: '1rem', padding: '14px 32px' }}>
                        Browse Services →
                    </button>
                </Link>
            </section>

            {/* Footer */}
            <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,.7)', padding: '40px var(--content-padding)' }}>
                <div className="container">
                    <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wrench size={18} color="#fff" /></div>
                                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>Earthspace Services</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>Reliable Home Maintenance Experts at Your Doorstep.</p>
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', marginBottom: 12 }}>Services</h4>
                            {['AC Services', 'Electrical', 'Plumbing', 'Appliance Repair', 'Handyman'].map(s => (
                                <div key={s} style={{ fontSize: '0.85rem', marginBottom: 6 }}>{s}</div>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', marginBottom: 12 }}>Contact</h4>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div style={{ marginBottom: 6 }}>📞 +91-9999-999999</div>
                                <div style={{ marginBottom: 6 }}>✉️ support@earthspaceservices.com</div>
                                <div>🌐 www.earthspaceservices.com</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20, textAlign: 'center', fontSize: '0.8rem' }}>
                        © 2024 Earthspace Services. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* WhatsApp FAB */}
            <a href="https://wa.me/919999999999?text=Hello%20Earthspace%20Services%2C%20I%20need%20help." target="_blank" rel="noreferrer">
                <button className="whatsapp-fab" title="WhatsApp Support">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </button>
            </a>
        </div>
    );
}
