const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');

// Validation rules
const categoryValidation = [
  body('name').notEmpty().withMessage('กรุณาระบุชื่อหมวดหมู่').isLength({ max: 100 }).withMessage('ชื่อหมวดหมู่ต้องไม่เกิน 100 ตัวอักษร')
];

router.get('/', categoryController.getAllCategories);
router.post('/', categoryValidation, categoryController.createCategory);
router.put('/:id', categoryValidation, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
