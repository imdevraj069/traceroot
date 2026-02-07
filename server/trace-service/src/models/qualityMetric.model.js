import mongoose from 'mongoose';

const qualityMetricSchema = new mongoose.Schema({
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    metricType: {
        type: String,
        required: [true, 'Metric type is required'],
        enum: ['temperature', 'pH', 'moisture', 'purity', 'weight', 'other']
    },
    value: {
        type: String,
        required: [true, 'Value is required']
    },
    unit: {
        type: String
    },
    inspectorId: {
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

const QualityMetric = mongoose.model('QualityMetric', qualityMetricSchema);

export default QualityMetric;
