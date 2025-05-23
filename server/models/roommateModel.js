import mongoose from 'mongoose';

const roommateSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    occupation: {
      type: String,
      required: true,
      enum: ['Student', 'Working Professional', 'Other'],
    },
    budget: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    preferences: {
      smoking: { type: Boolean, default: false },
      drinking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      veg: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Roommate = mongoose.model('Roommate', roommateSchema);

export default Roommate;