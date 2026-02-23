import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import userModel from './models/userModel.js';
import connectDB from './config/mongodb.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
            process.exit(1);
        }

        const existing = await userModel.findOne({ email });
        if (existing) {
            console.log('Admin user already exists, skipping seed.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            fullName: 'Super Admin',
            email,
            mobile: '0000000000',
            password: hashedPassword,
            role: 'admin',
            isEmailVerified: true
        });

        console.log(`Admin user created successfully!\n  Email: ${email}\n  Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
