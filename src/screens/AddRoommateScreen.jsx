import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Plus, Upload } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const AddRoommateScreen = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    occupation: 'Working Professional',
    budget: '',
    location: '',
    description: '',
    contactInfo: {
      phone: '',
      email: '',
    },
    preferences: {
      smoking: false,
      drinking: false,
      pets: false,
      veg: false,
    },
  });

  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        contactInfo: {
          phone: user.phone || '',
          email: user.email || '',
        },
      }));
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('image', image);
      
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
   
    if (!formData.name || !formData.age || !formData.budget || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!formData.contactInfo.phone || !formData.contactInfo.email) {
      toast.error('Please fill in contact information');
      return;
    }
    
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }
      
      setIsSubmitting(true);
   
      const roommateData = {
        ...formData,
        age: Number(formData.age),
        budget: Number(formData.budget),
        profileImage: imageUrl || user.profileImage || '',
      };
      
      await axios.post('/api/roommates', roommateData);
      
      toast.success('Roommate listing added successfully');
      navigate('/roommates');
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to add roommate listing'
      );
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold mb-8">Create Roommate Listing</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : user?.profileImage || 'https://share.google/images/uAIyvIQUWc2i38KfD'
                      }
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
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
                <p className="text-sm text-gray-600 mt-2">
                  Upload a profile picture (optional)
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
                
                <Input
                  label="Age"
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  required
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <select
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Roommate Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Monthly Budget (₹)"
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter your monthly budget"
                  required
                />
                
                <Input
                  label="Preferred Location"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter preferred location (city/area)"
                  required
                />
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About Me & Preferences
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe yourself and what you're looking for in a roommate"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Lifestyle Preferences</h2>
              <div className="grid grid-cols-2 gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.smoking"
                    checked={formData.preferences.smoking}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Smoking</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.drinking"
                    checked={formData.preferences.drinking}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Drinking</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.pets"
                    checked={formData.preferences.pets}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Pet Friendly</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.veg"
                    checked={formData.preferences.veg}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Vegetarian</span>
                </label>
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  id="contactInfo.phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
                
                <Input
                  label="Email Address"
                  id="contactInfo.email"
                  name="contactInfo.email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/roommates')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isUploading || isSubmitting}
                className="flex items-center"
              >
                {isUploading || isSubmitting ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Listing
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoommateScreen;