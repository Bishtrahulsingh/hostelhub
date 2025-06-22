import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RoommateFilter from '../components/roommates/RoommateFilter';
import RoommateCard from '../components/roommates/RoommateCard';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const RoommateListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(1);

  const page = parseInt(searchParams.get('page')) || 1;

  // Initial filters from URL
  const initialFilters = {
    location: searchParams.get('location') || '',
    gender: searchParams.get('gender') || '',
    minBudget: searchParams.get('minBudget') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    occupation: searchParams.get('occupation') || '',
    preferences: {
      smoking: searchParams.get('smoking') === 'true',
      veg: searchParams.get('veg') === 'true',
    },
  };

  const [filters, setFilters] = useState(initialFilters);
  const debouncedFilters = useDebounce(filters, 500);

  // Fetch roommates based on current searchParams
  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`/api/roommates?${searchParams.toString()}`);
        setRoommates(data.roommates);
        setPages(data.pages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch roommate listings');
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, [searchParams]);

  // Update searchParams when filters change (debounced)
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.location) params.set('location', debouncedFilters.location);
    if (debouncedFilters.gender) params.set('gender', debouncedFilters.gender);
    if (debouncedFilters.minBudget) params.set('minBudget', debouncedFilters.minBudget);
    if (debouncedFilters.maxBudget) params.set('maxBudget', debouncedFilters.maxBudget);
    if (debouncedFilters.occupation) params.set('occupation', debouncedFilters.occupation);

    if (debouncedFilters.preferences.smoking) params.set('smoking', 'true');
    else params.delete('smoking');

    if (debouncedFilters.preferences.veg) params.set('veg', 'true');
    else params.delete('veg');

    params.set('page', '1'); // reset page
    setSearchParams(params);
  }, [debouncedFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // just update state, searchParams is handled by useEffect
  };

  const clearFilters = () => {
    const cleared = {
      location: '',
      gender: '',
      minBudget: '',
      maxBudget: '',
      occupation: '',
      preferences: { smoking: false, veg: false },
    };

    setFilters(cleared);
    setSearchParams({ page: '1' }); // reset URL
  };

  const goToPage = (newPage) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('page', newPage);
    setSearchParams(updatedParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Roommates</h1>

      <RoommateFilter
        filters={filters}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {roommates.map((roommate) => (
              <RoommateCard key={roommate._id} roommate={roommate} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <Button
                  onClick={() => goToPage(Math.max(page - 1, 1))}
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
                  onClick={() => goToPage(Math.min(page + 1, pages))}
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
