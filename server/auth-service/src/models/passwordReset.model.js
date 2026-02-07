import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    usedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for cleanup of expired tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for checking if token is expired
passwordResetSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expiresAt;
});

// Virtual for checking if token is valid
passwordResetSchema.virtual('isValid').get(function () {
    return !this.usedAt && !this.isExpired;
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;
