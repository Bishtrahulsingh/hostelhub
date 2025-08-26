import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Save, Upload, X, Plus } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const EditPropertyScreen = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    propertyType: 'PG',
    price: '',
    deposit: '',
    gender: 'Unisex',
    amenities: {
      wifi: false,
      ac: false,
      food: false,
      tv: false,
      parking: false,
      laundry: false,
      cleaning: false,
      security: false,
    },
    contactInfo: {
      name: '',
      phone: '',
      email: '',
    },
    availability: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (!user.isOwner) {
        toast.error('Only property owners can edit properties');
        navigate('/');
        return;
      }
      
      fetchProperty();
    }
  }, [id, user, authLoading, navigate]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/properties/${id}`);
      console.log(data)
      if (data.owner._id.toString() !== user._id.toString()) {
        toast.error('You can only edit your own properties');
        navigate('/my-properties');
        return;
      }
      
      setProperty(data);
      setExistingImages(data.images || []);
      
      setFormData({
        name: data.name,
        description: data.description,
        address: data.address,
        propertyType: data.propertyType,
        price: data.price,
        deposit: data.deposit,
        gender: data.gender,
        amenities: data.amenities,
        contactInfo: data.contactInfo,
        availability: data.availability,
      });
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch property'
      );
      navigate('/my-properties');
    } finally {
      setIsLoading(false);
    }
  };

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
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages(prevImages => [...prevImages, ...files]);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (newImages.length === 0) return [];

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const imageUrls = [];
      const totalImages = newImages.length;
      
      for (let i = 0; i < totalImages; i++) {
        const formData = new FormData();
        formData.append('image', newImages[i]);
        
        const { data } = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        imageUrls.push(data.url);
        setUploadProgress(Math.round(((i + 1) / totalImages) * 100));
      }
      
      return imageUrls;
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to upload images'
      );
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.zipCode) {
      toast.error('Please fill in all address fields');
      return;
    }
    
    if (!formData.contactInfo.name || !formData.contactInfo.phone || !formData.contactInfo.email) {
      toast.error('Please fill in all contact information');
      return;
    }
    
    try {
      let newImageUrls = [];
      if (newImages.length > 0) {
        newImageUrls = await uploadImages();
      }
      
      setIsSubmitting(true);
      
      const allImages = [...existingImages, ...newImageUrls];
      
      if (allImages.length === 0) {
        toast.error('At least one property image is required');
        setIsSubmitting(false);
        return;
      }
      
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        deposit: Number(formData.deposit),
        images: allImages,
      };
      
      await axios.put(`/api/properties/${id}`, propertyData);
      
      toast.success('Property updated successfully');
      navigate('/my-properties');
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update property'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Property Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter property name"
                  required
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="PG">PG</option>
                    <option value="Flat">Flat</option>
                    <option value="Room">Room</option>
                  </select>
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your property, including features and surroundings"
                    required
                  ></textarea>
                </div>
                
                <Input
                  label="Monthly Rent (₹)"
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter monthly rent"
                  required
                />
                
                <Input
                  label="Security Deposit (₹)"
                  id="deposit"
                  name="deposit"
                  type="number"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="Enter security deposit amount"
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
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Not Available</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    required
                  />
                </div>
                
                <Input
                  label="City"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
                
                <Input
                  label="State"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                />
                
                <Input
                  label="Zip Code"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  placeholder="Enter zip code"
                  required
                />
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.wifi"
                    checked={formData.amenities.wifi}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">WiFi</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.ac"
                    checked={formData.amenities.ac}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Air Conditioning</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.food"
                    checked={formData.amenities.food}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Food Included</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.tv"
                    checked={formData.amenities.tv}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">TV</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.parking"
                    checked={formData.amenities.parking}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Parking</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.laundry"
                    checked={formData.amenities.laundry}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Laundry</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.cleaning"
                    checked={formData.amenities.cleaning}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Cleaning</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amenities.security"
                    checked={formData.amenities.security}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Security</span>
                </label>
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Contact Name"
                  id="contactInfo.name"
                  name="contactInfo.name"
                  value={formData.contactInfo.name}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                  required
                />
                
                <Input
                  label="Contact Phone"
                  id="contactInfo.phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  placeholder="Enter contact phone"
                  required
                />
                
                <Input
                  label="Contact Email"
                  id="contactInfo.email"
                  name="contactInfo.email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  placeholder="Enter contact email"
                  required
                />
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Property Images</h2>
              
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Current Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-32">
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block w-full">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-700">Upload additional images</p>
                      <p className="text-sm text-gray-500">PNG, JPG or JPEG (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              {newImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">New Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {newImages.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-32">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {isUploading && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Uploading images: {uploadProgress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/my-properties')}
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
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
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

export default EditPropertyScreen;