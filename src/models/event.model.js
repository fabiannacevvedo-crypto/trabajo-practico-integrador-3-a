import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [150, 'El título debe tener como máximo 150 caracteres']
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [20, 'La descripción debe tener al menos 20 caracteres']
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria']
    },
    endDate: {
      type: Date,
      required: [true, 'La fecha de fin es obligatoria']
    },
    capacity: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: 'La capacidad debe ser un número entero'
      },
      min: [1, 'La capacidad mínima debe ser 1']
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'El precio no puede ser negativo']
    },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'finished'],
      default: 'scheduled'
    },
    // Relación 1:1 Embebida (Location)
    location: {
      venue: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'El lugar debe tener al menos 3 caracteres'],
        maxlength: [100, 'El lugar debe tener como máximo 100 caracteres']
      },
      address: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
        maxlength: [150, 'La dirección debe tener como máximo 150 caracteres']
      },
      city: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'La ciudad debe tener al menos 2 caracteres'],
        maxlength: [50, 'La ciudad debe tener como máximo 50 caracteres']
      }
    },
    // Relación 1:N Referenciada
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Relación N:M Referenciada
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Event = mongoose.model('Event', eventSchema);