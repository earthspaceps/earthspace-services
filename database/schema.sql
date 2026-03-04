-- ================================================================
-- Earthspace Services Platform - PostgreSQL Database Schema
-- ================================================================
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ================================================================
-- ENUMS
-- ================================================================
CREATE TYPE user_role AS ENUM ('customer', 'technician', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'assigned', 'on_the_way', 'started', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE payment_method AS ENUM ('online', 'cash', 'wallet');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE technician_status AS ENUM ('pending_verification', 'verified', 'suspended', 'inactive');
CREATE TYPE notification_channel AS ENUM ('push', 'sms', 'email', 'whatsapp');
CREATE TYPE complaint_status AS ENUM ('open', 'in_review', 'resolved', 'closed');
-- ================================================================
-- CORE USER TABLE
-- ================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role NOT NULL DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    profile_image_url TEXT,
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP,
    wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
-- ================================================================
-- TECHNICIANS TABLE
-- ================================================================
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status technician_status DEFAULT 'pending_verification',
    specializations TEXT[], -- Array of service category slugs
    experience_years INT DEFAULT 0,
    id_proof_url TEXT,
    certificate_url TEXT,
    bio TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_jobs INT DEFAULT 0,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    is_available BOOLEAN DEFAULT false,
    commission_rate DECIMAL(5,2) DEFAULT 20.00, -- percentage admin takes
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    bank_account_number VARCHAR(30),
    bank_ifsc VARCHAR(15),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_technicians_user_id ON technicians(user_id);
CREATE INDEX idx_technicians_status ON technicians(status);
CREATE INDEX idx_technicians_availability ON technicians(is_available);
-- ================================================================
-- SERVICE CATEGORIES
-- ================================================================
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
-- ================================================================
-- SERVICES (Subservices)
-- ================================================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    price_type VARCHAR(20) DEFAULT 'fixed', -- fixed, estimate, starting_from
    duration_minutes INT DEFAULT 60,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_services_category ON services(category_id);
-- ================================================================
-- CUSTOMER ADDRESSES
-- ================================================================
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
-- ================================================================
-- BOOKINGS
-- ================================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id),
    technician_id UUID REFERENCES technicians(id),
    service_id UUID NOT NULL REFERENCES services(id),
    address_id UUID REFERENCES customer_addresses(id),
    status booking_status DEFAULT 'pending',
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    estimated_duration_minutes INT,
    address_snapshot JSONB, -- snapshot at time of booking
    service_snapshot JSONB, -- snapshot at time of booking
    special_instructions TEXT,
    estimated_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    work_proof_url TEXT,
    payment_method payment_method DEFAULT 'cash',
    payment_status payment_status DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_technician ON bookings(technician_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
-- Sequential booking number function
CREATE SEQUENCE booking_number_seq START 100001;
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ES' || TO_CHAR(NOW(), 'YYYY') || LPAD(nextval('booking_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;
-- ================================================================
-- PAYMENTS
-- ================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    technician_id UUID REFERENCES technicians(id),
    amount DECIMAL(12,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    commission_amount DECIMAL(12,2),
    technician_payout DECIMAL(12,2),
    method payment_method NOT NULL DEFAULT 'cash',
    status payment_status DEFAULT 'pending',
    gateway_transaction_id VARCHAR(255),
    gateway_order_id VARCHAR(255),
    gateway_response JSONB,
    invoice_number VARCHAR(50) UNIQUE,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
-- ================================================================
-- RATINGS & REVIEWS
-- ================================================================
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    technician_id UUID NOT NULL REFERENCES technicians(id),
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_ratings_technician ON ratings(technician_id);
-- ================================================================
-- NOTIFICATIONS
-- ================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    channel notification_channel DEFAULT 'push',
    is_read BOOLEAN DEFAULT false,
    metadata JSONB,
    sent_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
-- ================================================================
-- COMPLAINTS
-- ================================================================
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status complaint_status DEFAULT 'open',
    admin_response TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- ================================================================
-- AUDIT LOGS
-- ================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID,
    actor_role user_role,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_logs_created ON audit_logs(created_at);
-- ================================================================
-- SEED DATA - SERVICE CATEGORIES & SERVICES
-- ================================================================
INSERT INTO service_categories (name, slug, description, icon_name, sort_order) VALUES
('AC Services', 'ac-services', 'Expert AC repair, installation, gas refill and maintenance', 'wind', 1),
('Electrical', 'electrical', 'Professional electrical repairs and installations', 'zap', 2),
('Plumbing', 'plumbing', 'Complete plumbing solutions for your home', 'droplets', 3),
('Appliance Repair', 'appliance-repair', 'Repair for all home appliances', 'wrench', 4),
('Handyman', 'handyman', 'General home repair and maintenance', 'hammer', 5);
-- AC Services
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'AC Repair', 'ac-repair', 'Diagnose and fix all AC problems including cooling issues, leaks, and more', 499, 'starting_from', 90, 1 FROM service_categories WHERE slug = 'ac-services';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'AC Installation', 'ac-installation', 'Professional installation of split and window AC units', 999, 'starting_from', 120, 2 FROM service_categories WHERE slug = 'ac-services';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'AC Gas Refill', 'ac-gas-refill', 'Recharge your AC refrigerant gas for optimal cooling', 799, 'fixed', 60, 3 FROM service_categories WHERE slug = 'ac-services';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'AC Maintenance', 'ac-maintenance', 'Complete AC servicing, cleaning, and performance check', 349, 'fixed', 60, 4 FROM service_categories WHERE slug = 'ac-services';
-- Electrical
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Switch/Socket Repair', 'switch-socket-repair', 'Repair or replace faulty switches and sockets', 199, 'starting_from', 30, 1 FROM service_categories WHERE slug = 'electrical';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Wiring', 'wiring', 'House wiring, rewiring, and electrical point installation', 599, 'starting_from', 120, 2 FROM service_categories WHERE slug = 'electrical';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Fan Installation', 'fan-installation', 'Ceiling fan, exhaust fan installation and repair', 249, 'fixed', 45, 3 FROM service_categories WHERE slug = 'electrical';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Light Installation', 'light-installation', 'LED, tube, and decorative light installation', 199, 'fixed', 30, 4 FROM service_categories WHERE slug = 'electrical';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'MCB/Fuse Repair', 'mcb-fuse-repair', 'Fix tripping MCBs, blown fuses, and distribution boards', 299, 'starting_from', 45, 5 FROM service_categories WHERE slug = 'electrical';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'CCTV Installation', 'cctv-installation', 'Security camera installation and configuration', 1499, 'starting_from', 180, 6 FROM service_categories WHERE slug = 'electrical';
-- Plumbing
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Leak Repair', 'leak-repair', 'Fix pipe leaks, seepage, and water damage', 299, 'starting_from', 60, 1 FROM service_categories WHERE slug = 'plumbing';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Pipe Replacement', 'pipe-replacement', 'Replace old, damaged, or blocked pipes', 799, 'starting_from', 120, 2 FROM service_categories WHERE slug = 'plumbing';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Drain Cleaning', 'drain-cleaning', 'Unclog blocked kitchen, bathroom, and floor drains', 399, 'fixed', 60, 3 FROM service_categories WHERE slug = 'plumbing';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Tap Installation', 'tap-installation', 'Install or replace kitchen and bathroom taps', 249, 'fixed', 30, 4 FROM service_categories WHERE slug = 'plumbing';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Toilet Repair', 'toilet-repair', 'Fix flush, leakage, blockage, and toilet seat issues', 299, 'starting_from', 60, 5 FROM service_categories WHERE slug = 'plumbing';
-- Appliance Repair
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Refrigerator Repair', 'refrigerator-repair', 'Fix cooling, compressor, ice maker, and door seal issues', 399, 'starting_from', 90, 1 FROM service_categories WHERE slug = 'appliance-repair';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Washing Machine Repair', 'washing-machine-repair', 'Repair drum, motor, draining, and control board issues', 449, 'starting_from', 90, 2 FROM service_categories WHERE slug = 'appliance-repair';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Microwave Repair', 'microwave-repair', 'Fix heating, turntable, door, and panel issues', 349, 'starting_from', 60, 3 FROM service_categories WHERE slug = 'appliance-repair';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'RO Purifier Repair', 'ro-purifier-repair', 'Service and repair of RO water purifiers', 299, 'starting_from', 60, 4 FROM service_categories WHERE slug = 'appliance-repair';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Geyser Repair', 'geyser-repair', 'Fix heating element, thermostat, and tank issues', 399, 'starting_from', 75, 5 FROM service_categories WHERE slug = 'appliance-repair';
-- Handyman
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Furniture Assembly', 'furniture-assembly', 'Assemble flat-pack furniture from IKEA, Pepperfry, and more', 399, 'starting_from', 90, 1 FROM service_categories WHERE slug = 'handyman';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Wall Drilling', 'wall-drilling', 'Drill holes for shelves, curtain rods, paintings, and more', 199, 'starting_from', 30, 2 FROM service_categories WHERE slug = 'handyman';
INSERT INTO services (category_id, name, slug, description, base_price, price_type, duration_minutes, sort_order)
SELECT id, 'Carpentry Fixes', 'carpentry-fixes', 'Fix wooden doors, windows, wardrobes, and cabinets', 499, 'starting_from', 90, 3 FROM service_categories WHERE slug = 'handyman';
-- ================================================================
-- UPDATE TRIGGER FOR updated_at
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Default admin user (password: Admin@123 - change immediately)
INSERT INTO users (name, email, phone, role, password_hash) VALUES
('Earthspace Admin', 'admin@earthspaceservices.com', '+911234567890', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniIMZlWvHJ7/aX3PQmVfVkMOa');
