import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Briefcase, 
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronLeft
} from 'lucide-react';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

const RoommateDetailScreen = () => {
  const { id } = useParams();
  
  const [roommate, setRoommate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoommate = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/roommates/${id}`);
        setRoommate(data);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Roommate listing not found'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoommate();
  }, [id]);

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
          <Link to="/roommates">
            <Button variant="outline">Back to Roommates</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!roommate) return null;

  const defaultImage = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/roommates" className="text-teal-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Roommates
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Profile Image */}
          <div className="md:w-1/3 p-6 flex justify-center">
            <div className="w-64 h-64 rounded-full overflow-hidden">
              <img
                src={roommate.profileImage || defaultImage}
                alt={roommate.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Roommate Details */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{roommate.name}</h1>
              <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                {roommate.gender}, {roommate.age}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-teal-600 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="font-medium">{roommate.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-teal-600 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Occupation</p>
                  <p className="font-medium">{roommate.occupation}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-teal-600 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Budget</p>
                  <p className="font-medium">₹{roommate.budget.toLocaleString()}/month</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-teal-600 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Looking Since</p>
                  <p className="font-medium">{new Date(roommate.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {roommate.description}
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Preferences</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  {roommate.preferences.smoking ? (
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Smoking</span>
                </div>
                
                <div className="flex items-center">
                  {roommate.preferences.drinking ? (
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Drinking</span>
                </div>
                
                <div className="flex items-center">
                  {roommate.preferences.pets ? (
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Pets</span>
                </div>
                
                <div className="flex items-center">
                  {roommate.preferences.veg ? (
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Vegetarian</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="font-medium">{roommate.contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{roommate.contactInfo.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`tel:${roommate.contactInfo.phone}`} className="flex-1">
                  <Button variant="primary" fullWidth>
                    <Phone className="h-5 w-5 mr-2" />
                    Call
                  </Button>
                </a>
                
                <a href={`mailto:${roommate.contactInfo.email}?subject=Roommate Inquiry`} className="flex-1">
                  <Button variant="outline" fullWidth>
                    <Mail className="h-5 w-5 mr-2" />
                    Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateDetailScreen;