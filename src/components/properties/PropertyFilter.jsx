import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Button from '../ui/Button';

const PropertyFilter = ({ onFilterChange, clearFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    gender: '',
    amenities: {
      wifi: false,
      ac: false,
      food: false,
      parking: false,
    },
  });

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      amenities: {
        ...prevFilters.amenities,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setFilters({
      keyword: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      gender: '',
      amenities: {
        wifi: false,
        ac: false,
        food: false,
        parking: false,
      },
    });
    clearFilters();
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleInputChange}
            placeholder="Search by property name or city..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <button
          onClick={handleFilterToggle}
          className="ml-4 flex items-center text-teal-600 hover:text-teal-800"
        >
          <SlidersHorizontal className="h-5 w-5 mr-1" />
          <span>Filters</span>
        </button>
      </div>

      {isFilterOpen && (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Types</option>
                <option value="Hostel">Hostel</option>
                <option value="PG">PG</option>
                <option value="Flat">Flat</option>
                <option value="Room">Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (₹)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleInputChange}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={filters.amenities.wifi}
                  onChange={handleAmenityChange}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">WiFi</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="ac"
                  checked={filters.amenities.ac}
                  onChange={handleAmenityChange}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">AC</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="food"
                  checked={filters.amenities.food}
                  onChange={handleAmenityChange}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">Food</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="parking"
                  checked={filters.amenities.parking}
                  onChange={handleAmenityChange}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">Parking</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={handleClear}>
              Clear All
            </Button>
            <Button type="submit" variant="primary">
              Apply Filters
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PropertyFilter;