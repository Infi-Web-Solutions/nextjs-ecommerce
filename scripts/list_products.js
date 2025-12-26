
const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  en: String,
  fr: String,
  de: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: translationSchema,
  description: translationSchema,
  price: Number,
  image: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function listProducts() {
  try {
    const uri = process.env.MONGO_URL || "mongodb://localhost:27017/projectstructure";
    await mongoose.connect(uri);
    const products = await Product.find({}).limit(5);
    console.log(JSON.stringify(products, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listProducts();
