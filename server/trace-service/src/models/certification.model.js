import mongoose from 'mongoose';

/**
 * Certification Model
 * Tracks certifications like USDA Organic, Fair Trade, ISO standards, etc.
 * Based on original repo's certification structure
 */
const certificationSchema = new mongoose.Schema({
    // Certification name (e.g., "USDA Organic", "Fair Trade", "ISO 22000")
    name: {
        type: String,
        required: [true, 'Certification name is required']
    },
    // Whether the certification is currently active
    active: {
        type: Boolean,
        default: true
    },
    // Date when certification was issued
    issuedDate: {
        type: Date,
        default: null
    },
    // Expiry date of the certification
    expiryDate: {
        type: Date,
        default: null
    },
    // Organization that issued the certification
    issuingBody: {
        type: String,
        default: ''  // e.g., "USDA", "Fair Trade USA", "Bureau Veritas"
    },
    // Unique certificate reference number
    certificateNumber: {
        type: String,
        default: ''
    },
    // URL to the certificate document/PDF
    documentUrl: {
        type: String,
        default: ''
    },
    // Type of certification
    type: {
        type: String,
        enum: ['organic', 'quality', 'safety', 'environmental', 'social', 'other'],
        default: 'other'
    },
    // Scope/coverage of the certification
    scope: {
        type: String,
        default: ''  // e.g., "All turmeric products", "Processing facility"
    },
    // Link to specific batch (optional - most certifications are company-wide)
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        default: null
    },
    // Audit/inspection details
    lastAuditDate: {
        type: Date,
        default: null
    },
    nextAuditDate: {
        type: Date,
        default: null
    },
    auditNotes: {
        type: String,
        default: ''
    },
    // Company/organization holding the certification
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Can be linked to an organization user
        default: null
    },
    organizationName: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
certificationSchema.index({ name: 1 });
certificationSchema.index({ active: 1 });
certificationSchema.index({ expiryDate: 1 });
certificationSchema.index({ type: 1 });

// Virtual to check if certification is expired
certificationSchema.virtual('isExpired').get(function () {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
});

// Virtual to get days until expiry
certificationSchema.virtual('daysUntilExpiry').get(function () {
    if (!this.expiryDate) return null;
    const now = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are included in JSON
certificationSchema.set('toJSON', { virtuals: true });
certificationSchema.set('toObject', { virtuals: true });

const Certification = mongoose.model('Certification', certificationSchema);

export default Certification;
