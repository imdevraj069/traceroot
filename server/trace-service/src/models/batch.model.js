import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true
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
    location: {
        type: String,
        required: [true, 'Location is required']
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
        enum: ['created', 'inspected', 'shipped', 'delivered'],
        default: 'created'
    }
}, {
    timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
