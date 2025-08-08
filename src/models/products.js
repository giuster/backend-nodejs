const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

let Product;
try {
  Product = mongoose.model('Product', ProductSchema);
} catch (err) {
  Product = mongoose.models.Product;
}

const inMemoryStore = {
  _data: [],
  _id: 1,
  list() { return this._data; },
  create(obj) { const item = { id: this._id++, ...obj }; this._data.push(item); return item; },
  find(id) { return this._data.find(x => String(x.id) === String(id)); },
  update(id, changes) {
    const idx = this._data.findIndex(x => String(x.id) === String(id));
    if (idx === -1) return null;
    this._data[idx] = { ...this._data[idx], ...changes };
    return this._data[idx];
  },
  remove(id) {
    const idx = this._data.findIndex(x => String(x.id) === String(id));
    if (idx === -1) return false;
    this._data.splice(idx, 1);
    return true;
  }
};

module.exports = {
  async list() {
    if (mongoose.connection.readyState === 1) return Product.find().lean();
    return inMemoryStore.list();
  },
  async create(payload) {
    if (mongoose.connection.readyState === 1) return Product.create(payload);
    return inMemoryStore.create(payload);
  },
  async find(id) {
    if (mongoose.connection.readyState === 1) return Product.findById(id).lean();
    return inMemoryStore.find(id);
  },
  async update(id, changes) {
    if (mongoose.connection.readyState === 1) {
      return Product.findByIdAndUpdate(id, changes, { new: true }).lean();
    }
    return inMemoryStore.update(id, changes);
  },
  async remove(id) {
    if (mongoose.connection.readyState === 1) {
      const res = await Product.findByIdAndDelete(id);
      return !!res;
    }
    return inMemoryStore.remove(id);
  }
};
