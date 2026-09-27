const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');

// Validation rules
const productValidation = [
  body('name').notEmpty().withMessage('กรุณาระบุชื่อสินค้า').isLength({ max: 200 }).withMessage('ชื่อสินค้าต้องไม่เกิน 200 ตัวอักษร'),
  body('sku').notEmpty().withMessage('กรุณาระบุ SKU').isLength({ max: 50 }).withMessage('SKU ต้องไม่เกิน 50 ตัวอักษร'),
  body('cost_price').notEmpty().withMessage('กรุณาระบุราคาสินค้า').isNumeric().withMessage('ราคาสินค้าต้องเป็นตัวเลข').custom(value => Number(value) >= 0).withMessage('ราคาสินค้าต้องไม่ติดลบ'),
  body('current_stock').isInt({ min: 0 }).withMessage('สต็อกปัจจุบันต้องเป็นตัวเลขจำนวนเต็มและไม่ติดลบ'),
  body('category_id').optional({ nullable: true }).isInt().withMessage('รหัสหมวดหมู่ไม่ถูกต้อง')
];

const updateProductValidation = [
  body('name').notEmpty().withMessage('กรุณาระบุชื่อสินค้า').isLength({ max: 200 }).withMessage('ชื่อสินค้าต้องไม่เกิน 200 ตัวอักษร'),
  body('sku').notEmpty().withMessage('กรุณาระบุ SKU').isLength({ max: 50 }).withMessage('SKU ต้องไม่เกิน 50 ตัวอักษร'),
  body('cost_price').notEmpty().withMessage('กรุณาระบุราคาสินค้า').isNumeric().withMessage('ราคาสินค้าต้องเป็นตัวเลข').custom(value => Number(value) >= 0).withMessage('ราคาสินค้าต้องไม่ติดลบ'),
  body('category_id').optional({ nullable: true }).isInt().withMessage('รหัสหมวดหมู่ไม่ถูกต้อง')
];

// CRITICAL: low-stock must be before /:id
router.get('/low-stock', productController.getLowStockProducts);

router.get('/', productController.getAllProducts);
router.post('/', productValidation, productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', updateProductValidation, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
