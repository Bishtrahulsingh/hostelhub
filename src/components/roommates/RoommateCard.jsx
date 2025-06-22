import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Briefcase, CreditCard } from 'lucide-react';
import Button from '../ui/Button';

const RoommateCard = ({ roommate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/3 flex justify-center">
          <div className="h-40 w-40 sm:h-32 sm:w-32 rounded-full overflow-hidden">
            <img
              src={roommate.profileImage || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'}
              alt={roommate.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="sm:w-2/3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800">{roommate.name}</h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
              {roommate.gender}, {roommate.age}
            </span>
          </div>
          
          <div className="mt-2 flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
            <span>{roommate.location}</span>
          </div>
          
          <div className="mt-2 flex items-center text-gray-600 text-sm">
            <Briefcase className="h-4 w-4 mr-1 text-blue-600" />
            <span>{roommate.occupation}</span>
          </div>
          
          <div className="mt-2 flex items-center text-gray-600 text-sm">
            <CreditCard className="h-4 w-4 mr-1 text-blue-600" />
            <span>Budget: ₹{roommate.budget.toLocaleString()}/month</span>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {roommate.preferences.smoking && (
              <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                Smoker
              </span>
            )}
            {roommate.preferences.drinking && (
              <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                Drinks
              </span>
            )}
            {roommate.preferences.pets && (
              <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                Pet Friendly
              </span>
            )}
            {roommate.preferences.veg && (
              <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                Vegetarian
              </span>
            )}
          </div>
          
          <div className="mt-4">
            <Link to={`/roommates/${roommate._id}`}>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;