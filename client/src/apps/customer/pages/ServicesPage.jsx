import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Wind, Zap, Droplets, Wrench, Hammer, Clock, Star } from 'lucide-react';
import api from '../../../shared/api';

const CATEGORY_ICONS = { 'ac-services': Wind, 'electrical': Zap, 'plumbing': Droplets, 'appliance-repair': Wrench, 'handyman': Hammer };
const CATEGORY_COLORS = { 'ac-services': '#000', 'electrical': '#000', 'plumbing': '#000', 'appliance-repair': '#000', 'handyman': '#000' };

export default function ServicesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const activeCategory = searchParams.get('category') || '';

    useEffect(() => {
        api.get('/services/categories').then(({ data }) => setCategories(data.data.categories || [])).catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        if (search) params.set('search', search);
        params.set('limit', '50');
        api.get(`/services?${params}`).then(({ data }) => setServices(data.data.services || [])).catch(console.error).finally(() => setLoading(false));
    }, [activeCategory, search]);

    const handleSearch = (e) => { e.preventDefault(); setSearchParams(prev => { if (search) prev.set('search', search); else prev.delete('search'); return prev; }); };

    const setCategory = (slug) => setSearchParams(slug ? { category: slug } : {});

    const formatPrice = (service) => {
        const prefix = service.priceType === 'starting_from' ? 'Starts ₹' : service.priceType === 'estimate' ? 'Est. ₹' : '₹';
        return `${prefix}${service.basePrice}`;
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
            {/* Header */}
            <div style={{ background: '#000', padding: '80px var(--content-padding)', borderBottom: '1px solid #333' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <h2 style={{ color: '#fff', marginBottom: 12, fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>SOLUTIONS</h2>
                        <p style={{ color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.75rem', fontWeight: 700 }}>PRECISION ENGINEERING FOR YOUR HOME</p>
                    </div>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, flex: '1 1 400px', maxWidth: 600 }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input className="form-control" style={{ paddingLeft: 48, borderRadius: '999px', border: 'none', height: 56, background: '#111', color: '#fff' }} placeholder="SEARCH SOLUTIONS..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" type="submit" style={{ padding: '0 40px', height: 56 }}>SEARCH</button>
                    </form>
                </div>
            </div>

            <div className="container" style={{ padding: '24px var(--content-padding)' }}>
                {/* Category Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                    <button onClick={() => setCategory('')} className={`btn btn-sm ${!activeCategory ? 'btn-primary' : 'btn-outline'}`}>ALL SOLUTIONS</button>
                    {categories.map(cat => (
                        <button key={cat.slug} onClick={() => setCategory(cat.slug)}
                            className={`btn btn-sm ${activeCategory === cat.slug ? 'btn-primary' : 'btn-outline'}`}>
                            {cat.name.toUpperCase()}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-center"><div className="spinner"></div></div>
                ) : services.length === 0 ? (
                    <div className="card" style={{ padding: '80px 40px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                            <div style={{ background: '#111', color: '#fff', padding: 20, borderRadius: '16px' }}>
                                <Wrench size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 style={{ textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.02em', fontSize: '1.5rem', margin: 0 }}>NO SOLUTIONS FOUND</h3>
                                <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>ENGINEERING QUERY RETURNED ZERO MATCHES</p>
                            </div>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', maxWidth: 400, lineHeight: 1.8 }}>PLEASE ADJUST YOUR FILTER PARAMETERS OR SEARCH QUERY. OUR CORE SCOPE COVERS ELECTRICAL, PLUMBING, HVAC, AND GENERAL STRUCTURAL MAINTENANCE.</p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: 40, padding: '16px 40px' }}
                            onClick={() => { setSearch(''); setCategory(''); }}
                        >
                            RESET CATALOG
                        </button>
                    </div>
                ) : (
                    <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
                        {services.map(service => {
                            const catSlug = service.category?.slug || '';
                            const Icon = CATEGORY_ICONS[catSlug] || Wrench;
                            return (
                                <div
                                    key={service.id}
                                    className="service-card card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ background: '#0A0D14', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                            <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,.1)', color: '#fff', padding: '3px 10px', letterSpacing: '0.15em', fontWeight: 800 }}>{service.category?.name.toUpperCase()}</span>
                                            <Icon size={20} color="#fff" strokeWidth={1} />
                                        </div>
                                        <h3 style={{ color: '#fff', fontSize: '1.1rem', letterSpacing: '0.04em', fontWeight: 800 }}>{service.name.toUpperCase()}</h3>
                                    </div>
                                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <p style={{ fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>{service.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <Clock size={14} />{service.durationMinutes} MINS
                                            <span style={{ margin: '0 4px', opacity: 0.3 }}>|</span>
                                            <Star size={14} style={{ color: 'var(--color-warning)' }} /> 4.8 RATING
                                        </div>
                                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                                            <div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{formatPrice(service)}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{service.priceType === 'starting_from' ? 'AFTER INSPECTION' : 'FIXED RATE'}</div>
                                            </div>
                                            <Link to={`/customer/book?service=${service.id}&name=${encodeURIComponent(service.name)}&price=${service.basePrice}`}>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    style={{
                                                        padding: '10px 20px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    BOOK NOW
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* WhatsApp FAB */}
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
                <button className="whatsapp-fab">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </button>
            </a>
        </div>
    );
}
