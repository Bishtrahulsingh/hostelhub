import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Wifi, 
  AirVent, 
  Utensils, 
  Car, 
  ShieldCheck, 
  Shirt, 
  DollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

const PropertyDetailScreen = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/properties/${id}`);
        setProperty(data);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Property not found'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (review.comment.trim() === '') {
      toast.error('Please enter a comment');
      return;
    }
    
    try {
      setSubmittingReview(true);
      await axios.post(`/api/properties/${id}/reviews`, review);
      
      // Refetch property to get updated reviews
      const { data } = await axios.get(`/api/properties/${id}`);
      setProperty(data);
      
      setReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully');
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to submit review'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/properties">
            <Button variant="outline">Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const defaultImage = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/properties" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative rounded-lg overflow-hidden mb-6 h-[400px]">
            <img
              src={property.images[activeImageIndex] || defaultImage}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {property.propertyType}
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {property.images.length > 1 && (
            <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
              {property.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer ${
                    activeImageIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image || defaultImage}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Property Details */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <span>
                {property.address.street}, {property.address.city}, {property.address.state}, {property.address.zipCode}
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-5 w-5 ${
                    star <= property.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {property.rating.toFixed(1)} ({property.numReviews} reviews)
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-gray-500 text-sm">Rent</p>
                  <p className="font-semibold">₹{property.price.toLocaleString()}/month</p>
                </div>
              </div>
              
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-gray-500 text-sm">Deposit</p>
                  <p className="font-semibold">₹{property.deposit.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                <Shirt className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-gray-500 text-sm">Gender</p>
                  <p className="font-semibold">{property.gender}</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {property.description}
            </p>
            
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {property.amenities.wifi && (
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 text-blue-600 mr-2" />
                  <span>WiFi</span>
                </div>
              )}
              {property.amenities.ac && (
                <div className="flex items-center">
                  <AirVent className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Air Conditioning</span>
                </div>
              )}
              {property.amenities.food && (
                <div className="flex items-center">
                  <Utensils className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Food Included</span>
                </div>
              )}
              {property.amenities.parking && (
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Parking</span>
                </div>
              )}
              {property.amenities.security && (
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Security</span>
                </div>
              )}
              {property.amenities.laundry && (
                <div className="flex items-center">
                  <Shirt className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Laundry</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-6">Reviews</h2>
            
            {property.reviews.length === 0 ? (
              <p className="text-gray-600 mb-6">No reviews yet.</p>
            ) : (
              <div className="space-y-6 mb-8">
                {property.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium mr-2">{review.name}</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {user ? (
              <div>
                <h3 className="font-semibold mb-3">Write a Review</h3>
                <form onSubmit={submitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={review.rating}
                      onChange={handleReviewChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comment
                    </label>
                    <textarea
                      name="comment"
                      value={review.comment}
                      onChange={handleReviewChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Share your experience..."
                    ></textarea>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={submittingReview}
                  >
                    {submittingReview ? <Loader size="sm" /> : 'Submit Review'}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  Please{' '}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    sign in
                  </Link>{' '}
                  to write a review.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Contact Info */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{property.contactInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{property.contactInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Contact Person</p>
                  <p className="font-medium">{property.contactInfo.name}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 mb-4">
                Interested in this property? Contact the owner directly.
              </p>
              
              <a href={`tel:${property.contactInfo.phone}`}>
                <Button variant="primary" fullWidth className="mb-3">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Owner
                </Button>
              </a>
              
              <a href={`mailto:${property.contactInfo.email}?subject=Inquiry about ${property.name}`}>
                <Button variant="outline" fullWidth>
                  <Mail className="h-5 w-5 mr-2" />
                  Email Owner
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailScreen;