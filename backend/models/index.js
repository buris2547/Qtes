const sequelize = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const StockTransaction = require('./StockTransaction');

// Define associations
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products'
});

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

Product.hasMany(StockTransaction, {
  foreignKey: 'product_id',
  as: 'transactions'
});

StockTransaction.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

module.exports = {
  sequelize,
  Category,
  Product,
  StockTransaction
};
