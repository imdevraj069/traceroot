import mongoose from 'mongoose';

const qualityMetricSchema = new mongoose.Schema({
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        default: null  // Optional - can be global metric
    },
    productName: {
        type: String,
        default: ''  // Auto-filled from batch if linked
    },
    // From original repo structure
    category: {
        type: String,
        required: [true, 'Category is required'],
        // e.g., 'Organic Certification', 'Purity Analysis', 'Heavy Metals', 'Curcumin Content'
    },
    score: {
        type: Number,
        required: [true, 'Score is required'],
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['Certified', 'Passed', 'Clear', 'Monitoring', 'Failed'],
        default: 'Passed'
    },
    notes: {
        type: String,
        default: ''
    },
    // Legacy fields for backward compatibility
    metricType: {
        type: String,
        enum: ['temperature', 'pH', 'moisture', 'purity', 'weight', 'curcumin_content', 'heavy_metals', 'organic', 'other'],
        default: 'other'
    },
    value: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    },
    passed: {
        type: Boolean,
        default: true
    },
    // Inspector info
    inspectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    inspectorName: {
        type: String,
        default: ''
    },
    // Lab test report info
    labName: {
        type: String,
        default: ''
    },
    testMethod: {
        type: String,
        default: ''  // e.g., 'HPLC', 'Gas Chromatography', 'Spectrophotometry'
    },
    reportNumber: {
        type: String,
        default: ''
    },
    reportUrl: {
        type: String,
        default: ''  // URL to uploaded PDF/document
    },
    testDate: {
        type: Date,
        default: null
    },
    // Blockchain tracking
    blockchainTxHash: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
qualityMetricSchema.index({ batchId: 1 });
qualityMetricSchema.index({ category: 1 });
qualityMetricSchema.index({ status: 1 });

const QualityMetric = mongoose.model('QualityMetric', qualityMetricSchema);

export default QualityMetric;
