import { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { FacultyCard } from './components/FacultyCard';
import { FilterPanel } from './components/FilterPanel';
import { StatsCards } from './components/StatsCards';
import { useFacultyData } from './hooks/useFacultyData';
import { filterFacultyProfiles, sortFacultyProfiles } from './utils/filters';
import type { Filters, SortOption } from './types';

function App() {
  const { loading, error, profiles, workshops } = useFacultyData();
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    workshops: [],
    year: null
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('lastName');

  const filteredAndSortedProfiles = useMemo(() => {
    const filtered = filterFacultyProfiles(profiles, filters);
    return sortFacultyProfiles(filtered, sortOption);
  }, [profiles, filters, sortOption]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary-600 rounded-full animate-spin border-t-transparent absolute top-0"></div>
          </div>
          <div className="text-gray-600 font-medium">Loading faculty data...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-red-600 font-medium">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <StatsCards 
        profiles={profiles} 
        workshops={workshops} 
      />
      
      <FilterPanel
        filters={filters}
        sortOption={sortOption}
        workshops={workshops}
        onFiltersChange={setFilters}
        onSortChange={setSortOption}
        totalCount={profiles.length}
        filteredCount={filteredAndSortedProfiles.length}
      />

      {filteredAndSortedProfiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No faculty members found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
          <button
            onClick={() => setFilters({
              search: '',
              workshops: [],
              year: null
            })}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProfiles.map((profile, index) => (
            <div
              key={profile.faculty.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-slide-up"
            >
              <FacultyCard
                profile={profile}
                workshops={workshops}
              />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default App;