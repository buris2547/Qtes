const { Product, StockTransaction, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.adjustStock = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ถูกต้อง', errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const { product_id, adjustment, reason } = req.body;
    
    const product = await Product.findByPk(product_id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้า' });
    }

    const stock_before = product.current_stock;
    const stock_after = stock_before + adjustment;

    if (stock_after < 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'สต็อกไม่เพียงพอ' });
    }

    const type = adjustment > 0 ? 'IN' : 'OUT';
    const quantity = Math.abs(adjustment);

    // Update product stock
    await product.update({ current_stock: stock_after }, { transaction });

    // Create transaction record
    const stockTransaction = await StockTransaction.create({
      product_id,
      type,
      quantity,
      stock_before,
      stock_after,
      reason
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      data: {
        product,
        transaction: stockTransaction
      },
      message: 'ปรับปรุงสต็อกสำเร็จ'
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const { product_id, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (product_id) {
      whereClause.product_id = product_id;
    }
    if (type) {
      whereClause.type = type;
    }

    const { count, rows } = await StockTransaction.findAndCountAll({
      where: whereClause,
      include: [{ model: Product, as: 'product' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      },
      message: 'ดึงข้อมูลประวัติการทำรายการสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionsByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const transactions = await StockTransaction.findAll({
      where: { product_id: productId },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: transactions,
      message: 'ดึงข้อมูลประวัติการทำรายการของสินค้าสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
