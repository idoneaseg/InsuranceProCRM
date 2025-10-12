import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const index = async (req, res) => {
    const result = await User.find({ deleted: false });
    const totalRecords = await User.countDocuments();
    res.send({ result, total_recodes: totalRecords });
};

const view = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "No data found." });
    res.status(200).json(user);
};

const edit = async (req, res) => {
    try {
        const result = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    emailAddress: req.body.emailAddress,
                    modifiedOn: req.body.modifiedOn
                }
            }
        );
        res.status(200).json({ result, message: 'User updated successfully' });
    } catch (err) {
        console.error('Failed to update User:', err);
        res.status(400).json({ error: 'Failed to update User' });
    }
};

const deleteData = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role !== 'admin') {
            await User.findByIdAndUpdate(userId, { deleted: true });
            res.send({ message: 'User deleted successfully' });
        } else {
            res.send({ message: 'Admin cannot be deleted' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
};

const register = async (req, res) => {
    try {
        const { firstName, lastName, emailAddress, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ emailAddress });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            emailAddress,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;
        const user = await User.findOne({ emailAddress });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1d' });
        res.setHeader('Authorization', token);
        res.status(200).json({ token, user, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

export default { index, view, edit, deleteData, register, login };