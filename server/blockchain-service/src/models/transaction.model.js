import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    txHash: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['batch_creation', 'nfc_verification', 'quality_metric'],
        required: true
    },
    batchId: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending'
    },
    blockNumber: {
        type: Number
    },
    gasUsed: {
        type: String
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
