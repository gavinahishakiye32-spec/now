// Run once to create the default admin user
// node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('Admin user updated with admin role.');
      } else {
        console.log('Admin user already exists.');
      }
    } else {
      await User.create({ username: 'admin', password: 'Admin@1234', role: 'admin' });
      console.log('Admin user created: username=admin, password=Admin@1234');
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
