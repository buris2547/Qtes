const { Product, Category, StockTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();
    
    const lowStockCount = await Product.count({
      where: { current_stock: { [Op.lt]: 5 } }
    });

    // Calculate total stock value
    const products = await Product.findAll({
      attributes: ['cost_price', 'current_stock']
    });
    const totalStockValue = products.reduce((acc, curr) => {
      return acc + (parseFloat(curr.cost_price) * curr.current_stock);
    }, 0);

    const recentTransactions = await StockTransaction.findAll({
      include: [{ model: Product, as: 'product' }],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        lowStockCount,
        totalStockValue,
        recentTransactions
      },
      message: 'ดึงข้อมูลสรุปสำหรับแดชบอร์ดสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
