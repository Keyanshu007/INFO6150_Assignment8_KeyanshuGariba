const mongoose = require('mongoose');

// Define the User Schema with updated field names
const userSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true
    }
});

// Create a unique index for the Email field to ensure uniqueness
userSchema.index({ Email: 1 }, { unique: true });

// Export the User model based on the schema
module.exports = mongoose.model('User', userSchema);