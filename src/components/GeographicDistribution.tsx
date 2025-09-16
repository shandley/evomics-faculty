import React, { useMemo, useState } from 'react';
import { FacultyMap } from './FacultyMap';
import { aggregateFacultyByLocation, getLocationStatistics } from '../utils/geocoding';
import type { EnrichedFacultyProfile, Workshop } from '../types';
import type { FacultyLocation } from '../utils/geocoding';

interface GeographicDistributionProps {
  faculty: EnrichedFacultyProfile[];
  workshops: { [key: string]: Workshop };
}

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({
  faculty,
  workshops
}) => {
  const [selectedLocation, setSelectedLocation] = useState<FacultyLocation | null>(null);
  const [showStats, setShowStats] = useState(true);
  
  // Aggregate faculty by location
  const locations = useMemo(() => aggregateFacultyByLocation(faculty), [faculty]);
  
  // Calculate statistics
  const stats = useMemo(() => getLocationStatistics(locations), [locations]);
  
  // Count faculty with unknown locations
  const unknownCount = useMemo(() => {
    return faculty.filter(f => 
      !f.enrichment?.professional?.affiliation || 
      f.enrichment.professional.affiliation === 'Unknown'
    ).length;
  }, [faculty]);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Geographic Distribution</h2>
        <p className="text-gray-600">
          Faculty members are distributed across {stats.totalLocations} institutions in {stats.totalCountries} countries
        </p>
        {unknownCount > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            ({unknownCount} faculty member{unknownCount !== 1 ? 's' : ''} not shown due to unknown affiliation)
          </p>
        )}
      </div>
      
      {/* Map Container */}
      <div className="relative h-[600px] mb-6">
        <FacultyMap 
          locations={locations} 
          workshops={workshops}
          onLocationClick={setSelectedLocation}
        />
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Top Countries</h3>
          <div className="space-y-2">
            {stats.topCountries.map(([country, count], index) => (
              <div key={country} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {country}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-24">
                    <div
                      className="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${(count / stats.topCountries[0][1]) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Cities */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Top Cities</h3>
          <div className="space-y-2">
            {stats.topCities.slice(0, 10).map(([city, count], index) => (
              <div key={city} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {city}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-24">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${(count / stats.topCities[0][1]) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-slate-600">{stats.totalLocations}</p>
          <p className="text-sm text-gray-600">Institutions</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.totalCountries}</p>
          <p className="text-sm text-gray-600">Countries</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-violet-600">{stats.totalCities}</p>
          <p className="text-sm text-gray-600">Cities</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-700">{faculty.length - unknownCount}</p>
          <p className="text-sm text-gray-600">Mapped Faculty</p>
        </div>
      </div>
    </div>
  );
};