// softDelete.js
module.exports = function softDeletePlugin(schema, options = {}) {
  schema.add({
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  });

  // Auto-filter deleted documents unless explicitly included
  schema.pre(/^find/, function (next) {
    if (!this.getFilter().includeDeleted) {
      this.where({ isDeleted: false });
    } else {
      this.setQuery({ ...this.getFilter(), includeDeleted: undefined });
    }
    next();
  });

  // --- Static Methods ---

  // Soft delete a single document
  schema.statics.softDeleteById = async function (id) {
    return this.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  };

  // Restore a single soft-deleted document
  schema.statics.restoreById = async function (id) {
    return this.findByIdAndUpdate(id, {
      isDeleted: false,
      deletedAt: null,
    });
  };

  // Soft delete multiple documents
  schema.statics.softDeleteMany = async function (filter = {}) {
    return this.updateMany(filter, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  };

  // Restore multiple documents
  schema.statics.restoreMany = async function (filter = {}) {
    return this.updateMany(filter, {
      isDeleted: false,
      deletedAt: null,
    });
  };

  // Find documents including soft-deleted ones
  schema.statics.findIncludingDeleted = function (filter = {}) {
    return this.find({ ...filter, includeDeleted: true });
  };
};
