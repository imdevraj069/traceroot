import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Batch from '../models/batch.model.js';
import QualityMetric from '../models/qualityMetric.model.js';

export const getBatchStats = asyncHandler(async (req, res) => {
    // 1. Status Distribution
    const statusDistribution = await Batch.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 2. Average Quality Score (Monthly)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const qualityTrends = await QualityMetric.aggregate([
        {
            $match: {
                createdAt: { $gte: sixMonthsAgo },
                score: { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                avgScore: { $avg: "$score" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 3. Regional Distribution (Origin)
    const regionalDistribution = await Batch.aggregate([
        { $group: { _id: "$origin", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    // 4. Monthly Batch Creation Volume
    const monthlyVolume = await Batch.aggregate([
        {
            $match: {
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 5. Summary Metrics
    const totalBatches = await Batch.countDocuments();
    const activeBatches = await Batch.countDocuments({
        status: { $nin: ['Completed', 'Cancelled'] }
    });

    // Approximate active users based on batch creation
    const distinctUsers = await Batch.distinct('createdBy');
    const totalUsers = distinctUsers.length;

    // Overall Average Quality Score
    const overallQuality = await QualityMetric.aggregate([
        { $match: { score: { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: "$score" } } }
    ]);
    const averageQuality = overallQuality.length > 0 ? Math.round(overallQuality[0].avg * 10) / 10 : 0;

    // Format Data for Frontend
    const stats = {
        totalBatches,
        activeBatches,
        totalUsers,
        averageQuality,
        statusDistribution: statusDistribution.map(item => ({ name: item._id, value: item.count })),
        qualityTrends: qualityTrends.map(item => ({
            name: `${new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' })}`,
            score: Math.round(item.avgScore)
        })),
        regionalDistribution: regionalDistribution.map(item => ({ name: item._id, value: item.count })),
        monthlyVolume: monthlyVolume.map(item => ({
            name: `${new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' })}`,
            batches: item.count
        }))
    };

    res.status(200).json(new ApiResponse(200, stats, "Analytics fetched successfully"));
});
