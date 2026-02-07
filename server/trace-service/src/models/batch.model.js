import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true
    },
    batchNumber: {
        type: String,
        trim: true
    },
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    variety: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be positive']
    },
    unit: {
        type: String,
        default: 'kg'
    },
    origin: {
        type: String,
        required: [true, 'Origin is required']
    },
    currentLocation: {
        type: String
    },
    harvestDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    nfcTagId: {
        type: String,
        unique: true,
        sparse: true
    },
    quality: {
        type: String,
        enum: ['Premium', 'Standard', 'Economy'],
        default: 'Standard'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blockchainTxHash: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: [
            'Created',
            'Harvested',
            'Processing',
            'Quality Check',
            'Packaged',
            'In Transit',
            'In Distribution',
            'Delivered',
            'Completed',
            'Cancelled'
        ],
        default: 'Created'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update lastUpdated on save
batchSchema.pre('save', function () {
    this.lastUpdated = new Date();
});

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
