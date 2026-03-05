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
            <section className="hero" style={{ background: 'var(--bg-dark)', padding: '80px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div className="hero-content" style={{ textAlign: 'center', color: '#fff' }}>
                    <h1 style={{ marginBottom: 16, color: '#fff' }}>PRECISION <span style={{ color: 'var(--color-primary-300)' }}>HOME CARE</span></h1>
                    <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>ENGINEERING-LED FACILITY MANAGEMENT</p>
                    <form className="hero-search" onSubmit={handleSearch} style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 0 }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..." style={{ flex: 1, padding: '16px 20px', borderRadius: 0, border: 'none' }} />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 32px' }}>SEARCH</button>
                    </form>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, color: 'rgba(255,255,255,.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <MapPin size={14} /> {location}
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <div style={{ background: '#000', padding: '32px 0', borderBottom: '1px solid #333' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
                    {[['50K+', 'CUSTOMERS'], ['1.2K+', 'ENGINEERS'], ['25+', 'SOLUTIONS'], ['4.8/5', 'RATING']].map(([v, l]) => (
                        <div key={l} style={{ textAlign: 'center', color: '#fff' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{v}</div>
                            <div style={{ fontSize: '0.7rem', opacity: .6, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4 }}>{l}</div>
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
            <section style={{ padding: '80px 0', background: '#f8f8f8', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div className="text-center mb-6">
                        <h2 style={{ fontSize: '2.5rem' }}>WHY EARTHSPACE?</h2>
                        <p style={{ marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Setting the benchmark in facility management</p>
                    </div>
                    <div className="grid-4">
                        {WHY_CHOOSE.map((item, i) => (
                            <div key={i} className="card card-body text-center" style={{ padding: 32, borderRadius: 0, border: '1px solid #eee' }}>
                                <div style={{ width: 64, height: 64, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#fff' }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ marginBottom: 12 }}>{item.title}</h4>
                                <p style={{ fontSize: '0.85rem', fontWeight: 300 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '80px 0', background: '#fff' }}>
                <div className="container">
                    <div className="text-center mb-6"><h2 style={{ fontSize: '2.5rem' }}>HOW IT WORKS</h2></div>
                    <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
                        {[
                            { step: '01', title: 'SELECT SERVICE', desc: 'Browse and select from 25+ professional solutions.' },
                            { step: '02', title: 'SCHEDULE SLOT', desc: 'Pick your preferred date and time.' },
                            { step: '03', title: 'EXPERT ARRIVAL', desc: 'A certified engineer arrives at your doorstep.' },
                            { step: '04', title: 'QUALITY CHECK', desc: 'Complete the job and rate your experience.' },
                        ].map(s => (
                            <div key={s.step} className="text-center">
                                <div style={{ fontSize: '4rem', fontWeight: 900, color: '#f0f0f0', lineHeight: 1, marginBottom: -20 }}>{s.step}</div>
                                <h4 style={{ marginBottom: 12, position: 'relative', zIndex: 1 }}>{s.title}</h4>
                                <p style={{ fontSize: '0.85rem', fontWeight: 300 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '100px var(--content-padding)', background: '#000', textAlign: 'center', color: '#fff' }}>
                <h2 style={{ color: '#fff', marginBottom: 16, fontSize: '3rem' }}>READY FOR PRECISION?</h2>
                <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: 40, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.9rem' }}>Experience the EarthSpace standard today.</p>
                <Link to="/customer/services">
                    <button className="btn btn-primary btn-lg" style={{ background: '#fff', color: '#000', border: 'none' }}>
                        EXPLORE SOLUTIONS
                    </button>
                </Link>
            </section>

            {/* Footer */}
            <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,.7)', padding: '40px var(--content-padding)' }}>
                <div className="container">
                    <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <img src="/logo.png" alt="EarthSpace" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
                                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SERVICES</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', lineHeight: 1.8, fontWeight: 300 }}>Engineering-led facility management and precision maintenance for modern residential spaces.</p>
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
