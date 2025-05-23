import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { User, Upload } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const ProfileScreen = () => {
  const { user, loading: authLoading, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
  });

  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      setIsUploading(true);
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.url;
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to upload image'
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsUpdating(true);
      
      let imageUrl = formData.profileImage;
      if (image) {
        const uploadedImageUrl = await uploadImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      const updatedUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage: imageUrl,
      };

      if (formData.password) {
        updatedUser.password = formData.password;
      }

      await updateProfile(updatedUser);
      toast.success('Profile updated successfully');
      
      // Reset password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
        profileImage: imageUrl,
      });
      
      setImage(null);
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update profile'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : formData.profileImage || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
                  }
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-xl font-semibold mt-4">{formData.name}</h2>
            <p className="text-gray-600">{user?.isOwner ? 'Property Owner' : 'User'}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Phone Number"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              
              <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-4">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <p className="text-gray-600 mb-4">Leave blank to keep your current password</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="New Password"
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  
                  <Input
                    label="Confirm New Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isUploading || isUpdating}
              >
                {isUploading || isUpdating ? <Loader size="sm" /> : 'Update Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;