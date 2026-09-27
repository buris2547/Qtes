const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const stockController = require('../controllers/stockController');

// Validation rules
const adjustStockValidation = [
  body('product_id').notEmpty().withMessage('กรุณาระบุรหัสสินค้า').isInt().withMessage('รหัสสินค้าต้องเป็นตัวเลข'),
  body('adjustment')
    .notEmpty()
    .withMessage('กรุณาระบุจำนวนที่ปรับปรุง')
    .isInt()
    .withMessage('จำนวนที่ปรับปรุงต้องเป็นตัวเลขจำนวนเต็ม (บวกหรือลบ)')
    .custom(value => Number(value) !== 0)
    .withMessage('จำนวนที่ปรับปรุงต้องไม่เป็นศูนย์'),
  body('reason').optional({ nullable: true }).isLength({ max: 255 }).withMessage('เหตุผลต้องไม่เกิน 255 ตัวอักษร')
];

router.patch('/adjust', adjustStockValidation, stockController.adjustStock);
router.get('/transactions', stockController.getAllTransactions);
router.get('/transactions/:productId', stockController.getTransactionsByProductId);

module.exports = router;
