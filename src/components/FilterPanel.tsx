import React from 'react';
import type { Filters, SortOption, Workshop } from '../types';

interface FilterPanelProps {
  filters: Filters;
  sortOption: SortOption;
  workshops: { [key: string]: Workshop };
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  sortOption,
  workshops,
  onFiltersChange,
  onSortChange,
  totalCount,
  filteredCount
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2010 }, (_, i) => 2011 + i);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Faculty
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Name..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Workshop Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Workshop
          </label>
          <select
            value={filters.workshops[0] || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              workshops: e.target.value ? [e.target.value] : []
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="">All Workshops</option>
            {Object.values(workshops).map(workshop => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.shortName} - {workshop.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Year
          </label>
          <select
            value={filters.year || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              year: e.target.value ? parseInt(e.target.value) : null
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sort by
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-sm"
          >
            <option value="lastName">Last Name</option>
            <option value="firstName">First Name</option>
            <option value="participationCount">Years (High to Low)</option>
            <option value="recentYear">Most Recent</option>
            <option value="firstYear">First Year</option>
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of <span className="font-semibold text-gray-900">{totalCount}</span> faculty members
        </span>
        {(filters.search || filters.workshops.length > 0 || filters.year !== null) && (
          <button
            onClick={() => onFiltersChange({
              search: '',
              workshops: [],
              year: null
            })}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};