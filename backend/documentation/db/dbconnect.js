const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/aggribid", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('### Mongo DB connected...');
  } catch (err) {
    console.log(err);
    // Quit server if db connection fails
    process.exit(1);
  }
};

module.exports = connectDb;
