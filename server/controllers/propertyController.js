import asyncHandler from 'express-async-handler';
import Property from '../models/propertyModel.js';

const getProperties = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { 'address.city': { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};
  const propertyTypeFilter = req.query.propertyType
    ? { propertyType: req.query.propertyType }
    : {};

  const priceFilter = {};
  if (req.query.minPrice) {
    priceFilter.price = { ...priceFilter.price, $gte: Number(req.query.minPrice) };
  }
  if (req.query.maxPrice) {
    priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.maxPrice) };
  }

  const genderFilter = req.query.gender
    ? { gender: req.query.gender }
    : {};

  const amenitiesFilter = {};
  if (req.query.wifi === 'true') {
    amenitiesFilter['amenities.wifi'] = true;
  }
  if (req.query.ac === 'true') {
    amenitiesFilter['amenities.ac'] = true;
  }
  if (req.query.food === 'true') {
    amenitiesFilter['amenities.food'] = true;
  }
  if (req.query.parking === 'true') {
    amenitiesFilter['amenities.parking'] = true;
  }

  const filters = {
    ...keyword,
    ...propertyTypeFilter,
    ...priceFilter,
    ...genderFilter,
    ...amenitiesFilter,
  };

  const count = await Property.countDocuments(filters);
  const properties = await Property.find(filters)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    properties,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    'owner',
    'name email'
  );

  if (property) {
    return res.json(property);
  } else {
    return res.status(404).json({ message: 'Property not found' });
  }
});

const createProperty = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    address,
    propertyType,
    price,
    deposit,
    amenities,
    gender,
    contactInfo,
    images,
  } = req.body;

  const property = new Property({
    owner: req.user._id,
    name,
    description,
    address,
    propertyType,
    price,
    deposit,
    amenities: amenities || {},
    gender,
    contactInfo,
    images: images || [],
    rating: 0,
    numReviews: 0,
  });

  const createdProperty = await property.save();
  return res.status(201).json(createdProperty);
});

const updateProperty = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    address,
    propertyType,
    price,
    deposit,
    amenities,
    gender,
    contactInfo,
    availability,
    images,
  } = req.body;

  const property = await Property.findById(req.params.id);

  if (property) {
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    property.name = name || property.name;
    property.description = description || property.description;
    property.address = address || property.address;
    property.propertyType = propertyType || property.propertyType;
    property.price = price || property.price;
    property.deposit = deposit || property.deposit;
    property.amenities = amenities || property.amenities;
    property.gender = gender || property.gender;
    property.contactInfo = contactInfo || property.contactInfo;
    property.availability = availability !== undefined ? availability : property.availability;
    
    if (images && images.length > 0) {
      property.images = images;
    }

    const updatedProperty = await property.save();
    return res.json(updatedProperty);
  } else {
    return res.status(404).json({ message: 'Property not found' });
  }
});

const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    await Property.deleteOne({ _id: property._id });
    return res.json({ message: 'Property removed' });
  } else {
    return res.status(404).json({ message: 'Property not found' });
  }
});

const createPropertyReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const property = await Property.findById(req.params.id);

  if (property) {
    const alreadyReviewed = property.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Property already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    property.reviews.push(review);

    property.numReviews = property.reviews.length;

    property.rating =
      property.reviews.reduce((acc, item) => item.rating + acc, 0) /
      property.reviews.length;

    await property.save();
    return res.status(201).json({ message: 'Review added' });
  } else {
    return res.status(404).json({ message: 'Property not found' });
  }
});

export {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  createPropertyReview,
};