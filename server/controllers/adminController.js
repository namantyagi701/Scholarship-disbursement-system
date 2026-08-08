import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// Admin can create users with any role (student, sag, finance, admin)
export const createUser = async (req, res) => {
    const { fullName, email, mobile, password, role } = req.body;

    if (!fullName || !email || !mobile || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required (fullName, email, mobile, password, role)' });
    }

    const allowedRoles = ['student', 'sag', 'finance', 'admin'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ success: false, message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}` });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ fullName, email, mobile, password: hashedPassword, role });
        await user.save();

        // Notify the new user via email
        const mailOptions = {
            to: email,
            subject: `Account Created — ${role.toUpperCase()} Role`,
            text: `Hello ${fullName},\n\nYour account has been created by an administrator.\n\nEmail: ${email}\nRole: ${role}\n\nPlease log in and change your password.`
        };
        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: `User created successfully with role: ${role}`,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel
            .find({})
            .select("-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt")
            .sort({ createdAt: -1 });

        return res.json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const suspendUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot suspend an admin" });
        }

        user.accountStatus = "suspended";
        await user.save();

        return res.json({ success: true, message: `User ${user.email} suspended` });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const activateUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.accountStatus = "active";
        await user.save();

        return res.json({ success: true, message: `User ${user.email} activated` });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot delete an admin" });
        }

        await userModel.findByIdAndDelete(req.params.id);

        return res.json({ success: true, message: `User ${user.email} deleted` });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};