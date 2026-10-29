import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [30, 'El nombre debe tener como máximo 30 caracteres']
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: [200, 'La descripción no puede superar los 200 caracteres']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate de eventos que pertenecen a la categoría (N:M)
categorySchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'categories'
});

// Middleware en cascada: Al eliminar una categoría, la remueve del array categories en Event
// const removeCategoryFromEvents = async function (next) {
//   const query = this.getQuery();
//   const categoryId = query._id;

//   if (categoryId) {
//     await mongoose.model('Event').updateMany(
//       { categories: categoryId },
//       { $pull: { categories: categoryId } }
//     );
//   }
//   next();
// };

categorySchema.pre('findOneAndDelete', removeCategoryFromEvents);
categorySchema.pre('deleteOne', { document: false, query: true }, removeCategoryFromEvents);

export const Category = mongoose.model('Category', categorySchema);