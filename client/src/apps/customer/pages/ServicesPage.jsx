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
            <div style={{ background: 'var(--bg-dark)', padding: '40px var(--content-padding)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                    <h2 style={{ color: '#fff', marginBottom: 8, fontSize: '2rem' }}>SOLUTIONS</h2>
                    <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Precision engineering for your home</p>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, maxWidth: 600 }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-400)' }} />
                            <input className="form-control" style={{ paddingLeft: 40, borderRadius: 0, border: 'none' }} placeholder="Search solutions..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" type="submit" style={{ padding: '0 32px' }}>SEARCH</button>
                    </form>
                </div>
            </div>

            <div className="container" style={{ padding: '24px var(--content-padding)' }}>
                {/* Category Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                    <button onClick={() => setCategory('')} className={`btn btn-sm ${!activeCategory ? 'btn-primary' : 'btn-outline'}`} style={{ borderRadius: 0 }}>ALL SOLUTIONS</button>
                    {categories.map(cat => (
                        <button key={cat.slug} onClick={() => setCategory(cat.slug)}
                            className={`btn btn-sm ${activeCategory === cat.slug ? 'btn-primary' : 'btn-outline'}`}
                            style={{ borderRadius: 0 }}>
                            {cat.name.toUpperCase()}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-center"><div className="spinner"></div></div>
                ) : services.length === 0 ? (
                    <div className="text-center" style={{ padding: 60 }}>
                        <Wrench size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                        <h3>No services found</h3>
                        <p>Try a different search or category.</p>
                    </div>
                ) : (
                    <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {services.map(service => {
                            const catSlug = service.category?.slug || '';
                            const color = CATEGORY_COLORS[catSlug] || '#3b82f6';
                            const Icon = CATEGORY_ICONS[catSlug] || Wrench;
                            return (
                                <div key={service.id} className="service-card" style={{ borderRadius: 0, border: '1px solid var(--border-color)', background: '#fff' }}>
                                    <div className="service-card-header" style={{ background: '#000', padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,.15)', color: '#fff', padding: '2px 8px', letterSpacing: '0.1em', fontWeight: 600 }}>{service.category?.name.toUpperCase()}</span>
                                            <Icon size={18} color="#fff" strokeWidth={1.5} />
                                        </div>
                                        <h3 style={{ color: '#fff', fontSize: '1rem', letterSpacing: '0.02em' }}>{service.name.toUpperCase()}</h3>
                                    </div>
                                    <div className="service-card-body">
                                        <p className="text-sm" style={{ marginBottom: 16, lineHeight: 1.6 }}>{service.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, color: '#64748b', fontSize: '0.8rem' }}>
                                            <Clock size={14} />{service.durationMinutes} mins estimated
                                            <span style={{ margin: '0 4px' }}>·</span>
                                            <Star size={14} style={{ color: '#fbbf24' }} />4.8 rated
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <div className="service-price">{formatPrice(service)}</div>
                                                <div className="service-price-label">{service.priceType === 'starting_from' ? 'Final price after inspection' : 'Flat price'}</div>
                                            </div>
                                            <Link to={`/customer/book?service=${service.id}&name=${encodeURIComponent(service.name)}&price=${service.basePrice}`}>
                                                <button className="btn btn-primary btn-sm">Book Now</button>
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
