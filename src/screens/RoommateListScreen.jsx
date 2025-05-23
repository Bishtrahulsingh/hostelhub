import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RoommateFilter from '../components/roommates/RoommateFilter';
import RoommateCard from '../components/roommates/RoommateCard';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

const RoommateListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    gender: searchParams.get('gender') || '',
    minBudget: searchParams.get('minBudget') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    occupation: searchParams.get('occupation') || '',
    preferences: {
      smoking: searchParams.get('smoking') === 'true',
      veg: searchParams.get('veg') === 'true',
    },
  });

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.gender) queryParams.append('gender', filters.gender);
        if (filters.minBudget) queryParams.append('minBudget', filters.minBudget);
        if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget);
        if (filters.occupation) queryParams.append('occupation', filters.occupation);
        if (filters.preferences.smoking) queryParams.append('smoking', 'true');
        if (filters.preferences.veg) queryParams.append('veg', 'true');
        
        queryParams.append('pageNumber', page);

        const { data } = await axios.get(`/api/roommates?${queryParams.toString()}`);
        
        setRoommates(data.roommates);
        setPage(data.page);
        setPages(data.pages);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to fetch roommate listings'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    
    // Update URL params for better sharing and navigation
    const params = new URLSearchParams();
    if (newFilters.location) params.append('location', newFilters.location);
    if (newFilters.gender) params.append('gender', newFilters.gender);
    if (newFilters.minBudget) params.append('minBudget', newFilters.minBudget);
    if (newFilters.maxBudget) params.append('maxBudget', newFilters.maxBudget);
    if (newFilters.occupation) params.append('occupation', newFilters.occupation);
    if (newFilters.preferences.smoking) params.append('smoking', 'true');
    if (newFilters.preferences.veg) params.append('veg', 'true');
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      gender: '',
      minBudget: '',
      maxBudget: '',
      occupation: '',
      preferences: {
        smoking: false,
        veg: false,
      },
    });
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Roommates</h1>
      
      <RoommateFilter 
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
      ) : roommates.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No roommate listings found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {roommates.map((roommate) => (
              <RoommateCard key={roommate._id} roommate={roommate} />
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

export default RoommateListScreen;