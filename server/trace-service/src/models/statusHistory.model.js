import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    status: {
        type: String,
        required: true,
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
        ]
    },
    location: {
        type: String
    },
    notes: {
        type: String
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blockchainTxHash: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for querying by batch
statusHistorySchema.index({ batchId: 1, createdAt: -1 });

const StatusHistory = mongoose.model('StatusHistory', statusHistorySchema);

export default StatusHistory;
