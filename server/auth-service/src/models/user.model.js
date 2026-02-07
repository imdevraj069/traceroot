import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'supplier', 'manufacturer', 'distributor', 'retailer', 'user'],
        default: 'user'
    },
    walletAddress: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        trim: true
    },
    organization: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
