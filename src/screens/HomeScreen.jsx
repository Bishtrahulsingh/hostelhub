import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Home, Users, Building, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import PropertyCard from '../components/properties/PropertyCard';
import RoommateCard from '../components/roommates/RoommateCard';
import Loader from '../components/ui/Loader';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recentRoommates, setRecentRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const { data } = await axios.get('/api/properties?limit=3');
        setFeaturedProperties(data.properties.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      }
    };

    const fetchRecentRoommates = async () => {
      try {
        const { data } = await axios.get('/api/roommates?limit=3');
        setRecentRoommates(data.roommates.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent roommates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
    fetchRecentRoommates();
  }, []);

const navigate = useNavigate();

const handleSearch = (e) => {
  e.preventDefault();
  navigate(`/properties?keyword=${searchQuery}`);
};

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[url('/public/hostelbackground.jpg')] bg-center text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Find Your Perfect <span className="text-amber-300">Accommodation</span> & <span className="text-amber-300">Roommates</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Discover hostels, PG accommodations, and connect with potential roommates in your desired location.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Search by location, property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-gray-800 rounded-l-md focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Button type="submit" variant="secondary" className="rounded-l-none">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            What are you looking for?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/properties?propertyType=Hostel" className="group">
              <div className="bg-white rounded-lg p-6 shadow-md text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Building className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hostels</h3>
                <p className="text-gray-600">Find affordable hostels with all essential amenities for students.</p>
              </div>
            </Link>
            
            <Link to="/properties?propertyType=PG" className="group">
              <div className="bg-white rounded-lg p-6 shadow-md text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="bg-amber-100 text-amber-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                  <Home className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">PG Accommodations</h3>
                <p className="text-gray-600">Explore comfortable PG options with meals and other facilities.</p>
              </div>
            </Link>
            
            <Link to="/roommates" className="group">
              <div className="bg-white rounded-lg p-6 shadow-md text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="bg-purple-100 text-purple-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Roommates</h3>
                <p className="text-gray-600">Connect with potential roommates who match your preferences.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Properties</h2>
            <Link to="/properties">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          {loading ? (
            <Loader />
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No properties found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Roommates Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Recent Roommate Listings</h2>
            <Link to="/roommates">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          {loading ? (
            <Loader />
          ) : recentRoommates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentRoommates.map((roommate) => (
                <RoommateCard key={roommate._id} roommate={roommate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No roommate listings found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Why Choose Rentalhub?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">All our listings are verified to ensure you get authentic options.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Contact</h3>
              <p className="text-gray-600">Connect directly with property owners and potential roommates.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Filters</h3>
              <p className="text-gray-600">Find exactly what you're looking for with our advanced filters.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Listing</h3>
              <p className="text-gray-600">List your property or profile as a potential roommate for free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Are you a property owner?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            List your property on Rentalhub and connect with thousands of people looking for accommodation.
          </p>
          <Link to="/register">
            <Button variant="primary" className="bg-white text-amber-600 hover:bg-gray-100">
              List Your Property
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;