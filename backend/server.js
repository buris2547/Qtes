require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Category } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// Setup database and start server
const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    // Seed default categories if empty
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'IT Equipment' },
        { name: 'Office Supply' },
        { name: 'Furniture' },
        { name: 'Electronics' },
        { name: 'Miscellaneous' }
      ];
      await Category.bulkCreate(defaultCategories);
      console.log('Default categories seeded');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
