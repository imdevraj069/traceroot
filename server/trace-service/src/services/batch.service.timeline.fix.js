// FIX for getBatchTimeline - Replace the existing function with this:

export const getBatchTimeline = async (id) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    const statusHistory = await StatusHistory.find({ batchId: id }).sort({ createdAt: 1 });
    const qualityMetrics = await QualityMetric.find({ batchId: id }).sort({ createdAt: 1 });

    const timeline = [];

    // Add batch creation event
    timeline.push({
        type: 'batch_created',
        event: 'Batch Created',
        timestamp: batch.createdAt,
        location: batch.origin,
        description: `${batch.productName} batch created with quantity ${batch.quantity} ${batch.unit}`
    });

    // Add status changes to timeline
    statusHistory.forEach(history => {
        timeline.push({
            type: 'status_change',
            event: history.status,
            timestamp: history.createdAt,
            location: history.location,
            description: history.notes || `Status changed to ${history.status}`
        });
    });

    // Add quality metrics to timeline
    qualityMetrics.forEach(metric => {
        timeline.push({
            type: 'quality_check',
            event: 'Quality Check',
            timestamp: metric.createdAt,
            description: `${metric.metricType}: Score ${metric.score}/100 - ${metric.status}`
        });
    });

    // Sort by timestamp (ascending - oldest first)
    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return timeline;
};

// KEY FIXES:
// 1. Changed metric.value ${metric.unit} to metric.metricType: Score ${metric.score}/100
// 2. Added batch creation event with proper formatting
// 3. Fixed timestamp sorting to use .getTime() for proper numeric comparison
// 4. Properly formatted quality metric description using actual stored fields
