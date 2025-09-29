function toPlain(x) {
  if (!x) return {};
  if (typeof x.toObject === 'function') return x.toObject(); // Mongoose doc
  if (x._doc) return x._doc;                                 // dự phòng
  return x;                                                  // plain object
}
module.exports = { toPlain };