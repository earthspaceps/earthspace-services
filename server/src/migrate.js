const { sequelize } = require('./config/database');

async function migrate() {
    try {
        console.log('Starting migration...');
        await sequelize.authenticate();
        console.log('Database connected.');

        // Add payment_method column
        await sequelize.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_method') THEN
                    ALTER TABLE bookings ADD COLUMN payment_method payment_method DEFAULT 'cash';
                END IF;
            END $$;
        `);
        console.log('Column payment_method checked/added.');

        // Add payment_status column
        await sequelize.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_status') THEN
                    ALTER TABLE bookings ADD COLUMN payment_status payment_status DEFAULT 'pending';
                END IF;
            END $$;
        `);
        // Add address columns to users
        await sequelize.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address_line1') THEN
                    ALTER TABLE users ADD COLUMN address_line1 TEXT;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address_line2') THEN
                    ALTER TABLE users ADD COLUMN address_line2 TEXT;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='pincode') THEN
                    ALTER TABLE users ADD COLUMN pincode VARCHAR(10);
                END IF;
            END $$;
        `);
        console.log('User address columns checked/added.');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
