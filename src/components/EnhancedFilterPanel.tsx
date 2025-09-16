import React, { useState } from 'react';
import type { Filters, SortOption, Workshop } from '../types';
import { TopicFilter } from './TopicFilter';
import { SearchWithSuggestions } from './SearchWithSuggestions';

interface EnhancedFilterPanelProps {
  filters: Filters;
  sortOption: SortOption;
  workshops: { [key: string]: Workshop };
  availableSpecializations: string[];
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sort: SortOption) => void;
  onExport?: () => void;
  totalCount: number;
  filteredCount: number;
}

export const EnhancedFilterPanel: React.FC<EnhancedFilterPanelProps> = ({
  filters,
  sortOption,
  workshops,
  availableSpecializations,
  onFiltersChange,
  onSortChange,
  onExport,
  totalCount,
  filteredCount
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2010 }, (_, i) => 2011 + i);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Evomics Faculty Alumni',
          text: 'Check out this filtered view of Evomics faculty',
          url: url
        });
      } catch (err) {
        // User cancelled share
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const handleTopicToggle = (topicId: string) => {
    const currentTopics = filters.topics || [];
    const newTopics = currentTopics.includes(topicId)
      ? currentTopics.filter(id => id !== topicId)
      : [...currentTopics, topicId];
    
    onFiltersChange({
      ...filters,
      topics: newTopics
    });
  };

  const handleClearTopics = () => {
    onFiltersChange({
      ...filters,
      topics: []
    });
  };

  const handleIncludeChildrenChange = (include: boolean) => {
    onFiltersChange({
      ...filters,
      includeChildTopics: include
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Faculty
          </label>
          <div className="relative">
            <SearchWithSuggestions
              value={filters.search}
              onChange={(value) => onFiltersChange({ ...filters, search: value })}
              placeholder="Search by name..."
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Topic Filter */}
        <div>
          <TopicFilter
            selectedTopics={filters.topics || []}
            onTopicToggle={handleTopicToggle}
            onClearTopics={handleClearTopics}
            includeChildren={filters.includeChildTopics !== false}
            onIncludeChildrenChange={handleIncludeChildrenChange}
          />
        </div>

        {/* Workshop Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            Workshop
          </label>
          <select
            value={filters.workshops[0] || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              workshops: e.target.value ? [e.target.value] : []
            })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white text-sm appearance-none cursor-pointer"
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
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Year
          </label>
          <select
            value={filters.year || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              year: e.target.value ? parseInt(e.target.value) : null
            })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white text-sm appearance-none cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Teaching Specializations Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Specialization
          </label>
          <select
            value={filters.teachingSpecializations?.[0] || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              teachingSpecializations: e.target.value ? [e.target.value] : []
            })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white text-sm appearance-none cursor-pointer"
          >
            <option value="">All Specializations</option>
            {availableSpecializations.map(spec => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            Sort by
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-sm appearance-none cursor-pointer"
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
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of <span className="font-semibold text-gray-900">{totalCount}</span> faculty members
            {filters.topics && filters.topics.length > 0 && (
              <span className="ml-2">
                • <span className="font-semibold text-primary-600">{filters.topics.length}</span> topic{filters.topics.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </span>
          
          <div className="flex items-center gap-3">
            {/* Export Button */}
            {onExport && (
              <button
                onClick={onExport}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:border-gray-300 hover:text-gray-700 hover:shadow-sm transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            )}
            
            {/* Share Button */}
            <div className="relative">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:border-gray-300 hover:text-gray-700 hover:shadow-sm transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.438 18 15.482 18 16c0 .518.114.562.316 1.026m0-2.052a3 3 0 110 2.052m-9.632-6.684A3 3 0 119 12c0-.482-.114-.938-.316-1.342M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Share
              </button>
              
              {showShareTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap">
                  Link copied!
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Clear Filters */}
            {(filters.search || filters.workshops.length > 0 || filters.year !== null || (filters.topics && filters.topics.length > 0)) && (
              <button
                onClick={() => onFiltersChange({
                  search: '',
                  workshops: [],
                  year: null,
                  topics: [],
                  includeChildTopics: true
                })}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};