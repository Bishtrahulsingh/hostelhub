import asyncHandler from 'express-async-handler';
import Roommate from '../models/roommateModel.js';

const getRoommates = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const locationFilter = req.query.location?.trim()
    ? { location: { $regex: req.query.location.trim(), $options: 'i' } }
    : {};

  const genderFilter = req.query.gender
    ? { gender: req.query.gender }
    : {};

  const budgetFilter = {};
  if (req.query.minBudget) {
    budgetFilter.budget = {
      ...budgetFilter.budget,
      $gte: Number(req.query.minBudget),
    };
  }
  if (req.query.maxBudget) {
    budgetFilter.budget = {
      ...budgetFilter.budget,
      $lte: Number(req.query.maxBudget),
    };
  }

  const occupationFilter = req.query.occupation
    ? { occupation: req.query.occupation }
    : {};

  const preferencesFilter = {};
  if (req.query.smoking === 'true') {
    preferencesFilter['preferences.smoking'] = true;
  }
  if (req.query.veg === 'true') {
    preferencesFilter['preferences.veg'] = true;
  }

  const activeFilter = { isActive: true };

  const filters = {
    ...locationFilter,
    ...genderFilter,
    ...budgetFilter,
    ...occupationFilter,
    ...preferencesFilter,
    ...activeFilter,
  };


  const count = await Roommate.countDocuments(filters);
  const roommates = await Roommate.find(filters)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    roommates,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const getRoommateById = asyncHandler(async (req, res) => {
  const roommate = await Roommate.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (roommate) {
    res.json(roommate);
  } else {
    res.status(404);
    throw new Error('Roommate listing not found');
  }
});
const createRoommate = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    gender,
    occupation,
    budget,
    location,
    description,
    profileImage,
    contactInfo,
    preferences,
  } = req.body;

  const roommate = new Roommate({
    user: req.user._id,
    name: name || req.user.name,
    age,
    gender,
    occupation,
    budget,
    location,
    description,
    profileImage: profileImage || req.user.profileImage,
    contactInfo: contactInfo || {
      phone: req.user.phone,
      email: req.user.email,
    },
    preferences: preferences || {},
    isActive: true,
  });

  const createdRoommate = await roommate.save();
  res.status(201).json(createdRoommate);
});

const updateRoommate = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    gender,
    occupation,
    budget,
    location,
    description,
    profileImage,
    contactInfo,
    preferences,
    isActive,
  } = req.body;

  const roommate = await Roommate.findById(req.params.id);

  if (roommate) {
    if (roommate.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only update your own listings');
    }

    roommate.name = name || roommate.name;
    roommate.age = age || roommate.age;
    roommate.gender = gender || roommate.gender;
    roommate.occupation = occupation || roommate.occupation;
    roommate.budget = budget || roommate.budget;
    roommate.location = location || roommate.location;
    roommate.description = description || roommate.description;
    roommate.profileImage = profileImage || roommate.profileImage;
    roommate.contactInfo = contactInfo || roommate.contactInfo;
    roommate.preferences = preferences || roommate.preferences;
    roommate.isActive = isActive !== undefined ? isActive : roommate.isActive;

    const updatedRoommate = await roommate.save();
    res.json(updatedRoommate);
  } else {
    res.status(404);
    throw new Error('Roommate listing not found');
  }
});

const deleteRoommate = asyncHandler(async (req, res) => {
  const roommate = await Roommate.findById(req.params.id);

  if (roommate) {
    if (roommate.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only delete your own listings');
    }
 
    await Roommate.deleteOne({ _id: roommate._id });
    res.json({ message: 'Roommate listing removed' });
  } else {
    res.status(404);
    throw new Error('Roommate listing not found');
  } 
});

export {
  getRoommates,
  getRoommateById,
  createRoommate,
  updateRoommate,
  deleteRoommate,
};
