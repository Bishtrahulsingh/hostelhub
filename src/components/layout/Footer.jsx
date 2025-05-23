import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Home className="h-6 w-6 text-teal-400 mr-2" />
              <span className="text-white font-bold text-xl">HostelHub</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Finding the perfect accommodation and roommates made easy. Your one-stop solution for all your housing needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/roommates" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  Find Roommates
                </Link>
              </li>
              <li>
                <Link to="/add-property" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  List Property
                </Link>
              </li>
              <li>
                <Link to="/add-roommate" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  Find Roommate
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?propertyType=Hostel" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  Hostels
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=PG" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  PG Accommodations
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Flat" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  Flats
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Room" className="text-gray-300 hover:text-teal-400 transition duration-300">
                  Single Rooms
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-teal-400 mr-2 mt-0.5" />
                <span className="text-gray-300">123 Main Street, Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-teal-400 mr-2" />
                <span className="text-gray-300">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-teal-400 mr-2" />
                <span className="text-gray-300">info@hostelhub.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} HostelHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;