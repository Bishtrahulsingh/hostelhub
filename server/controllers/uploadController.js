import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// @desc    Upload image to cloudinary
// @route   POST /api/upload
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  try {
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            upload_preset: 'hostel_pg_finder',
            folder: 'hostel_pg_finder',
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadResponse = await streamUpload();

    res.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Image upload failed');
  }
});

export { uploadImage };