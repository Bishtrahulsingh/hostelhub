import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropertyFilter from '../components/properties/PropertyFilter';
import PropertyCard from '../components/properties/PropertyCard';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

const PropertyListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    gender: searchParams.get('gender') || '',
    amenities: {
      wifi: searchParams.get('wifi') === 'true',
      ac: searchParams.get('ac') === 'true',
      food: searchParams.get('food') === 'true',
      parking: searchParams.get('parking') === 'true',
    },
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        
        if (filters.keyword) queryParams.append('keyword', filters.keyword);
        if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.gender) queryParams.append('gender', filters.gender);
        if (filters.amenities.wifi) queryParams.append('wifi', 'true');
        if (filters.amenities.ac) queryParams.append('ac', 'true');
        if (filters.amenities.food) queryParams.append('food', 'true');
        if (filters.amenities.parking) queryParams.append('parking', 'true');
        
        queryParams.append('pageNumber', page);

        const { data } = await axios.get(`/api/properties?${queryParams.toString()}`);
        
        setProperties(data.properties);
        setPage(data.page);
        setPages(data.pages);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to fetch properties'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    
    // Update URL params for better sharing and navigation
    const params = new URLSearchParams();
    if (newFilters.keyword) params.append('keyword', newFilters.keyword);
    if (newFilters.propertyType) params.append('propertyType', newFilters.propertyType);
    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
    if (newFilters.gender) params.append('gender', newFilters.gender);
    if (newFilters.amenities.wifi) params.append('wifi', 'true');
    if (newFilters.amenities.ac) params.append('ac', 'true');
    if (newFilters.amenities.food) params.append('food', 'true');
    if (newFilters.amenities.parking) params.append('parking', 'true');
    
    setSearchParams(params);
  };

  const clearFilters = () => {
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
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      
      <PropertyFilter 
        onFilterChange={handleFilterChange} 
        clearFilters={clearFilters} 
      />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No properties found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
          
          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="rounded-r-none"
                >
                  Previous
                </Button>
                <div className="flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                  Page {page} of {pages}
                </div>
                <Button
                  onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                  disabled={page === pages}
                  variant="outline"
                  className="rounded-l-none"
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyListScreen;