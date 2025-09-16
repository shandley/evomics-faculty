import React, { useMemo, useState, useCallback } from 'react';
import type { EnrichedFacultyProfile, Workshop } from '../types';
import { generateTimelineData, calculateYearChanges, getFacultyCareer } from '../utils/timelineAnalysis';
import type { TimelineData, TimelineYear } from '../utils/timelineAnalysis';

interface TimelineVisualizationProps {
  faculty: EnrichedFacultyProfile[];
  workshops: { [key: string]: Workshop };
  onFacultyClick?: (facultyId: string) => void;
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  faculty,
  workshops,
  onFacultyClick
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'geographic'>('overview');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  
  // Generate timeline data
  const timelineData = useMemo(() => 
    generateTimelineData(faculty, workshops), 
    [faculty, workshops]
  );
  
  // Get data for selected year
  const selectedYearData = useMemo(() => {
    if (!selectedYear) return null;
    return timelineData.years.find(y => y.year === selectedYear);
  }, [selectedYear, timelineData]);
  
  // Get previous year data for comparison
  const previousYearData = useMemo(() => {
    if (!selectedYear) return null;
    const index = timelineData.years.findIndex(y => y.year === selectedYear);
    return index > 0 ? timelineData.years[index - 1] : null;
  }, [selectedYear, timelineData]);
  
  // Calculate changes
  const yearChanges = useMemo(() => {
    if (!selectedYearData) return null;
    return calculateYearChanges(selectedYearData, previousYearData);
  }, [selectedYearData, previousYearData]);
  
  // Get selected faculty career
  const selectedFacultyCareer = useMemo(() => {
    if (!selectedFacultyId) return null;
    return getFacultyCareer(selectedFacultyId, faculty);
  }, [selectedFacultyId, faculty]);
  
  // Workshop colors matching our design system
  const workshopColors: Record<string, string> = {
    wog: '#64748b',      // slate
    wpsg: '#8b5cf6',     // violet
    wphylo: '#10b981',   // emerald
  };
  
  // Calculate timeline dimensions
  const timelineWidth = 1200;
  const yearWidth = timelineWidth / timelineData.allYears.length;
  const timelineHeight = 200;
  
  // Handle year click
  const handleYearClick = (year: number) => {
    setSelectedYear(year === selectedYear ? null : year);
  };
  
  // Get faculty for a specific year and workshop
  const getFacultyForYearWorkshop = (year: number, workshopId: string) => {
    const yearData = timelineData.years.find(y => y.year === year);
    if (!yearData || !yearData.workshops[workshopId]) return [];
    
    return yearData.workshops[workshopId].faculty.map(id => {
      const profile = faculty.find(f => f.faculty.id === id);
      return profile ? {
        id,
        name: `${profile.faculty.firstName} ${profile.faculty.lastName}`,
        isNew: yearData.workshops[workshopId].newFaculty.includes(id)
      } : null;
    }).filter(Boolean);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Workshop Timeline</h2>
        <p className="text-gray-600">
          Explore the evolution of Evomics workshops from {timelineData.minYear} to {timelineData.maxYear}
        </p>
      </div>
      
      {/* View Mode Selector - Modern Tab Style */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setViewMode('overview')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              viewMode === 'overview'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('geographic')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              viewMode === 'geographic'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Geographic Spread
          </button>
        </div>
      </div>
      
      {/* Timeline Visualization */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Year labels */}
          <div className="flex justify-between mb-2 px-2">
            {timelineData.allYears.map((year, index) => (
              <div key={year} className="text-center" style={{ width: yearWidth }}>
                {(index === 0 || year % 5 === 0) && (
                  <span className="text-sm text-gray-600">{year}</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Main timeline */}
          <div className="relative bg-white rounded-lg border border-gray-200 p-6">
            {/* Different views based on mode */}
            {viewMode === 'overview' && (
              <div className="space-y-8">
                {/* Workshop tracks */}
                {Object.entries(workshops).map(([workshopId, workshop]) => (
                  <div key={workshopId} className="relative">
                    <div className="flex items-center mb-3">
                      <div className="text-sm font-semibold text-gray-900 w-32">
                        {workshop.name}
                      </div>
                      <div className="flex-1 h-px bg-gray-200 ml-4" />
                    </div>

                    {/* Year blocks - simplified */}
                    <div className="relative h-16 flex items-end">
                      {timelineData.years.map((yearData, index) => {
                        const workshopData = yearData.workshops[workshopId];
                        if (!workshopData) return null;

                        const isSelected = yearData.year === selectedYear;
                        const isHovered = yearData.year === hoveredYear;
                        const hasNewFaculty = workshopData.newFaculty.length > 0;

                        // Simple dot visualization
                        return (
                          <div
                            key={yearData.year}
                            className="relative flex-1 flex justify-center items-end cursor-pointer group"
                            onClick={() => handleYearClick(yearData.year)}
                            onMouseEnter={() => setHoveredYear(yearData.year)}
                            onMouseLeave={() => setHoveredYear(null)}
                          >
                            {/* Faculty count dots */}
                            <div className="relative">
                              <div
                                className={`rounded-full transition-all duration-200 ${
                                  hasNewFaculty ? 'ring-2 ring-offset-2 ring-yellow-400' : ''
                                }`}
                                style={{
                                  width: `${Math.min(32, 8 + workshopData.totalFaculty * 1.5)}px`,
                                  height: `${Math.min(32, 8 + workshopData.totalFaculty * 1.5)}px`,
                                  backgroundColor: workshopColors[workshopId],
                                  opacity: isSelected || isHovered ? 1 : 0.7,
                                }}
                              />

                              {/* Hover tooltip */}
                              {(isHovered || isSelected) && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                  {workshopData.totalFaculty} faculty
                                  {hasNewFaculty && ` (+${workshopData.newFaculty.length} new)`}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            
                {/* Summary Statistics */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {faculty.length}
                      </div>
                      <div className="text-xs text-gray-500">Total Faculty</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600">
                        {timelineData.years[timelineData.years.length - 1]?.totals.facultyCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">Active This Year</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {timelineData.years[timelineData.years.length - 1]?.totals.countryCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-600">
                        {Object.keys(workshops).length}
                      </div>
                      <div className="text-xs text-gray-500">Active Workshops</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            
            
            {/* Geographic Spread View */}
            {viewMode === 'geographic' && (
              <div className="relative h-full">
                <div className="text-sm font-medium text-gray-700 mb-2">Geographic Expansion</div>
                <div className="relative h-48">
                  {/* Country count over time */}
                  <div className="mb-4">
                    <svg width={timelineWidth} height={120}>
                      {/* COVID-19 indicator */}
                      {timelineData.years.map((yearData, index) => {
                        if (yearData.year === 2021) {
                          return (
                            <rect
                              key="covid-rect-geo"
                              x={index * yearWidth}
                              y={0}
                              width={yearWidth}
                              height={120}
                              fill="#9CA3AF"
                              opacity={0.2}
                            />
                          );
                        }
                        return null;
                      })}
                      
                      <polyline
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        points={timelineData.years.map((yearData, index) => {
                          const x = index * yearWidth + yearWidth / 2;
                          const y = 120 - (yearData.totals.countryCount / 30) * 100; // Scale to max 30 countries
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      {timelineData.years.map((yearData, index) => {
                        const x = index * yearWidth + yearWidth / 2;
                        const y = 120 - (yearData.totals.countryCount / 30) * 100;
                        
                        return (
                          <g key={yearData.year}>
                            <circle
                              cx={x}
                              cy={y}
                              r="3"
                              fill="#10B981"
                              className="cursor-pointer"
                              onClick={() => handleYearClick(yearData.year)}
                            />
                            {(hoveredYear === yearData.year || selectedYear === yearData.year) && (
                              <text x={x} y={y - 10} textAnchor="middle" className="text-xs fill-gray-700">
                                {yearData.totals.countryCount}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Countries represented</p>
                  
                  {/* Top countries bar */}
                  <div className="mt-4 flex gap-2">
                    {selectedYearData && (() => {
                      const countries = new Map<string, number>();
                      Object.values(selectedYearData.workshops).forEach(workshop => {
                        workshop.countries.forEach((count, country) => {
                          countries.set(country, (countries.get(country) || 0) + count);
                        });
                      });
                      const topCountries = Array.from(countries.entries())
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5);
                      
                      return topCountries.map(([country, count]) => (
                        <div key={country} className="text-xs">
                          <div className="font-medium">{country}</div>
                          <div className="text-gray-500">{count} faculty</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Cumulative faculty line chart */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Cumulative Faculty Growth
            </div>
            <svg width={timelineWidth} height={80}>
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                points={timelineData.years.map((yearData, index) => {
                  const x = index * yearWidth + yearWidth / 2;
                  const y = 80 - (yearData.totals.facultyCount / 170) * 70; // Scale to max
                  return `${x},${y}`;
                }).join(' ')}
              />
              {/* Data points */}
              {timelineData.years.map((yearData, index) => {
                const x = index * yearWidth + yearWidth / 2;
                const y = 80 - (yearData.totals.facultyCount / 170) * 70;
                const isSelected = yearData.year === selectedYear;
                
                return (
                  <circle
                    key={yearData.year}
                    cx={x}
                    cy={y}
                    r={isSelected ? 5 : 3}
                    fill="#3B82F6"
                    className="cursor-pointer"
                    onClick={() => handleYearClick(yearData.year)}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
      
      {/* Selected Year Details */}
      {selectedYearData && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">
            {selectedYearData.year} Overview
          </h3>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">
                {selectedYearData.totals.facultyCount}
              </p>
              <p className="text-sm text-blue-600">Total Faculty</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">
                {selectedYearData.totals.newFacultyCount}
              </p>
              <p className="text-sm text-green-600">New Faculty</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-700">
                {selectedYearData.totals.workshopCount}
              </p>
              <p className="text-sm text-purple-600">Active Workshops</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-700">
                {selectedYearData.totals.topicCount}
              </p>
              <p className="text-sm text-amber-600">Research Topics</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-700">
                {selectedYearData.totals.countryCount}
              </p>
              <p className="text-sm text-red-600">Countries</p>
            </div>
          </div>
          
          {/* Workshop Details */}
          <div className="space-y-3">
            {Object.entries(selectedYearData.workshops).map(([workshopId, data]) => (
              <div key={workshopId} className="bg-white rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">
                  {workshops[workshopId].name}
                </h4>
                <div className="text-sm text-gray-600">
                  <p>{data.totalFaculty} faculty ({data.newFaculty.length} new, {data.returningFaculty.length} returning)</p>
                  {data.faculty.length <= 10 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {getFacultyForYearWorkshop(selectedYearData.year, workshopId).map(f => f && (
                        <button
                          key={f.id}
                          onClick={() => {
                            setSelectedFacultyId(f.id);
                            onFacultyClick?.(f.id);
                          }}
                          className={`px-2 py-1 rounded text-xs ${
                            f.isNew 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-700'
                          } hover:bg-opacity-75`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Year-over-year changes */}
          {yearChanges && previousYearData && (
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <span className={yearChanges.facultyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {yearChanges.facultyGrowth >= 0 ? '+' : ''}{yearChanges.facultyGrowth}
                </span> faculty from {previousYearData.year}
              </p>
              {yearChanges.facultyRetention > 0 && (
                <p>{yearChanges.facultyRetention.toFixed(0)}% faculty retention</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};