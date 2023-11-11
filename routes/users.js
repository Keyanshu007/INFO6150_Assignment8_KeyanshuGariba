const express = require('express');
const router = express.Router();
const User = require("../models/user"); // Import the User model
const bcrypt = require('bcrypt');

// GET: Retrieve all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a new user
router.post('/', async (req, res) => {
    const { FullName, Email, Password } = req.body;

    // Validate FullName, Email, and Password format
    const fullNameRegex = /^[a-zA-Z]+('[a-zA-Z]+)? [a-zA-Z]+('[a-zA-Z]+)?$/;
    if (!fullNameRegex.test(FullName)) {
        return res.status(400).json({ error: 'Invalid FullName format' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ error: 'Invalid Email format' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(Password)) {
        return res.status(400).json({ error: 'Invalid Password format' });
    }

    // Hash the Password before storing it
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new User object based on the model
    const newUser = new User({ FullName, Email, Password: hashedPassword });

    try {
        // Save the new user and handle potential errors
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'User creation failed. Email already exists.' });
    }
});

// PUT: Update user information
router.put('/', async (req, res) => {
    try {
        const { Email, FullName, Password } = req.body;

        // Validate password format
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(Password)) {
            return res.status(400).json({ error: 'Invalid Password format' });
        }

        // Find the user based on the provided email
        const user = await User.findOne({ Email });

        if (!user) {
            return res.status(404).json({ message: "Cannot change the email of the user" });
        }

        // Update the user's information
        user.FullName = FullName || user.FullName;
        user.Password = Password ? await bcrypt.hash(Password, 10) : user.Password;
        await user.save();

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Remove a user by their email
router.delete('/', async (req, res) => {
    try {
        const { Email } = req.body;

        // Find and delete the user based on the provided email
        const user = await User.findOneAndDelete({ Email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
