import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, Users, Search } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-teal-700 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <Home className="h-8 w-8 text-white mr-2" />
            <span className="text-white font-bold text-xl">HostelHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/properties" className="text-white hover:text-teal-100 transition duration-300">
              Properties
            </Link>
            <Link to="/roommates" className="text-white hover:text-teal-100 transition duration-300">
              Find Roommates
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-white hover:text-teal-100">
                  <span className="mr-2">{user.name}</span>
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                  >
                    Profile
                  </Link>
                  {user.isOwner && (
                    <>
                      <Link 
                        to="/my-properties" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      >
                        My Properties
                      </Link>
                      <Link 
                        to="/add-property" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      >
                        Add Property
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/add-roommate" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                  >
                    Add Roommate Listing
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-teal-100 transition duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-teal-50 transition duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-teal-500">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/properties" 
                  className="block text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link 
                  to="/roommates" 
                  className="block text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Roommates
                </Link>
              </li>
              
              {user ? (
                <>
                  <li>
                    <Link 
                      to="/profile" 
                      className="block text-white py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  {user.isOwner && (
                    <>
                      <li>
                        <Link 
                          to="/my-properties" 
                          className="block text-white py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Properties
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/add-property" 
                          className="block text-white py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Add Property
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link 
                      to="/add-roommate" 
                      className="block text-white py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Roommate Listing
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-white py-2"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block text-white py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block bg-white text-teal-600 px-4 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;