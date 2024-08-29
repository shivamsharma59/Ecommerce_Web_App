const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String },
    price: { type: Number },
    imageUrl : {type : String}
});

module.exports = mongoose.model('Product', productSchema);
