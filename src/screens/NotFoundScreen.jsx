import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundScreen = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-9xl font-bold text-teal-600">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 mb-2 text-center">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" className="flex items-center">
          <Home className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundScreen;