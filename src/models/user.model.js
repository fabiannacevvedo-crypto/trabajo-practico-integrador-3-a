import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [3, 'El username debe tener al menos 3 caracteres'],
      maxlength: [20, 'El username debe tener como máximo 20 caracteres']
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      // match: [/^\S+@\S+\.\S+$/, 'Por favor, ingrese un email válido']
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    // Relación 1:1 Embebida dentro del mismo esquema
    profile: {
      firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre debe tener como máximo 50 caracteres']
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
        maxlength: [50, 'El apellido debe tener como máximo 50 caracteres']
      },
      birthDate: {
        type: Date,
        default: null
      },
      phone: {
        type: String,
        default: null
      }
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Hash de contraseña antes de guardar
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Virtual populate de eventos organizados por el usuario (1:N)
userSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'organizer'
});

// Middleware Query para Ignorar Usuarios Eliminados Lógicamente (Soft Delete)
// const excludeDeleted = function (next) {
//   this.where({ deletedAt: null });
//   next();
// };

// userSchema.pre('find', excludeDeleted);
// userSchema.pre('findOne', excludeDeleted);
// userSchema.pre('findOneAndUpdate', excludeDeleted);
// userSchema.pre('countDocuments', excludeDeleted);

// Middleware en cascada: Al eliminar lógicamente un usuario, cancela o elimina sus eventos
// userSchema.pre('findOneAndUpdate', async function (next) {
//   const update = this.getUpdate();
//   if (update.deletedAt || (update.$set && update.$set.deletedAt)) {
//     const userId = this.getQuery()._id;
//     // Cancela o actualiza el estado de los eventos asociados al usuario lógicamente eliminado
//     await mongoose.model('Event').updateMany(
//       { organizer: userId },
//       { $set: { status: 'cancelled' } }
//     );
//   }
//   next();
// });

export const User = mongoose.model('User', userSchema);