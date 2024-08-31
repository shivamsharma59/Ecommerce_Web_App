const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String },
    description : {type : String},
    price: { type: Number },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 }  // New field for stock quantity
});

module.exports = mongoose.model('Product', productSchema);
