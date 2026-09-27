const { Product, Category, StockTransaction } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { search, category_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category_id) {
      whereClause.category_id = category_id;
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: [{ model: Category, as: 'category' }],
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
      message: 'ดึงข้อมูลสินค้าสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { 
          model: StockTransaction, 
          as: 'transactions',
          limit: 5,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้า' });
    }

    res.json({
      success: true,
      data: product,
      message: 'ดึงข้อมูลสินค้าสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ถูกต้อง', errors: errors.array() });
  }

  try {
    const { name, sku, cost_price, current_stock, category_id } = req.body;
    const product = await Product.create({ name, sku, cost_price, current_stock, category_id });
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'สร้างสินค้าสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ถูกต้อง', errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, sku, cost_price, category_id } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้า' });
    }

    await product.update({ name, sku, cost_price, category_id });
    res.json({
      success: true,
      data: product,
      message: 'อัปเดตสินค้าสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้า' });
    }

    await product.destroy();
    res.json({
      success: true,
      message: 'ลบสินค้าสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        current_stock: {
          [Op.lt]: 5
        }
      },
      include: [{ model: Category, as: 'category' }],
      order: [['current_stock', 'ASC']]
    });

    res.json({
      success: true,
      data: products,
      message: 'ดึงข้อมูลสินค้าสต็อกต่ำสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
