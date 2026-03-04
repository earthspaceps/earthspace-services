const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        const adminEmail = 'admin@earthspaceservices.com';
        const password = 'admin123';

        const existing = await User.findOne({ where: { email: adminEmail } });

        if (existing) {
            console.log('Admin user already exists. Updating password to ensure it matches: Admin@123');
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(password, salt);
            await existing.update({ passwordHash: hash, role: 'admin', isActive: true });
            console.log('Admin user updated.');
        } else {
            console.log('Admin user not found. Creating...');
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(password, salt);
            await User.create({
                name: 'Earthspace Admin',
                email: adminEmail,
                phone: '+911234567890',
                passwordHash: hash,
                role: 'admin',
                isActive: true
            });
            console.log('Admin user created successfully.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
}

seedAdmin();
