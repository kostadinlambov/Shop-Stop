const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: mongoose.SchemaTypes.String, requires: true},
    description: {type: mongoose.SchemaTypes.String},
    price: {type: mongoose.SchemaTypes.Number, min: 0, max: Number.MAX_VALUE, default: 0 },
    image: {type: mongoose.SchemaTypes.String},
    isBought: {type: mongoose.Schema.Types.Boolean, default: false},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
   // creator: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
})

mongoose.model('Product', productSchema);

module.exports = mongoose.model('Product');