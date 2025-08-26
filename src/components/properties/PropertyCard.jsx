import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wifi, AirVent, Utensils, Car } from 'lucide-react';
import Button from '../ui/Button';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0] || 'https://share.google/images/cQJ6sPIh35UYRTCaE'}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-sm font-semibold">
          {property.propertyType}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white text-xl font-semibold truncate">{property.name}</h3>
          <div className="flex items-center text-white text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{property.address.city}, {property.address.state}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xl font-bold text-gray-800">₹{property.price.toLocaleString()}</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <div className="text-sm text-gray-600">
            For {property.gender}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.wifi && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
              <Wifi className="h-3 w-3 mr-1" /> Wifi
            </span>
          )}
          {property.amenities.ac && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
              <AirVent className="h-3 w-3 mr-1" /> AC
            </span>
          )}
          {property.amenities.food && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
              <Utensils className="h-3 w-3 mr-1" /> Food
            </span>
          )}
          {property.amenities.parking && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
              <Car className="h-3 w-3 mr-1" /> Parking
            </span>
          )}
        </div>
        
        <Link to={`/properties/${property._id}`}>
          <Button variant="outline" fullWidth>
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;