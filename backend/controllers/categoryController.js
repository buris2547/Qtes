const { Category } = require('../models');
const { validationResult } = require('express-validator');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      data: categories,
      message: 'ดึงข้อมูลหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ถูกต้อง', errors: errors.array() });
  }

  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json({
      success: true,
      data: category,
      message: 'สร้างหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ถูกต้อง', errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่' });
    }

    await category.update({ name, description });
    res.json({
      success: true,
      data: category,
      message: 'อัปเดตหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่' });
    }

    await category.destroy();
    res.json({
      success: true,
      message: 'ลบหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
