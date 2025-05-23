import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const propertySchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['Hostel', 'PG', 'Flat', 'Room'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    deposit: {
      type: Number,
      required: true,
      default: 0,
    },
    amenities: {
      wifi: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      food: { type: Boolean, default: false },
      tv: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      cleaning: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Unisex'],
    },
    contactInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;