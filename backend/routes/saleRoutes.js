import express from 'express';
import Sale from '../models/saleModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create sale
router.post('/', protect, async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sales by store
router.get('/:storeId', protect, async (req, res) => {
  try {
    const sales = await Sale.find({ store: req.params.storeId })
      .populate({
        path: 'items.product',
        select: 'name price',
      })
      .sort('-createdAt');
    res.json(sales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sales metrics
router.get('/:storeId/metrics', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      store: req.params.storeId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const [totalSales, totalOrders] = await Promise.all([
      Sale.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Sale.countDocuments(query),
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales[0]?.total / totalOrders : 0,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;