import React from 'react';
import type { FacultyProfile, EnrichedFacultyProfile } from '../types';
import { TopicDisplay } from './TopicDisplay';
import { SearchHighlight } from './SearchHighlight';

interface FacultyCardProps {
  profile: FacultyProfile | EnrichedFacultyProfile;
  workshops: { [key: string]: { name: string; shortName: string } };
  onClick?: () => void;
  searchTerm?: string;
}

// Define workshop colors - harmonious and sophisticated palette
const workshopColors = {
  wog: 'from-slate-400 to-slate-500',      // Sophisticated slate blue
  wpsg: 'from-violet-400 to-violet-500',   // Refined violet
  wphylo: 'from-emerald-400 to-emerald-500' // Elegant emerald
};

const workshopBadgeColors = {
  wog: 'bg-slate-50 text-slate-700 border-slate-200',
  wpsg: 'bg-violet-50 text-violet-700 border-violet-200',
  wphylo: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export const FacultyCard: React.FC<FacultyCardProps> = ({ profile, workshops, onClick, searchTerm }) => {
  // Get primary workshop for gradient
  const primaryWorkshop = Object.keys(profile.participations)[0] || 'wog';
  const gradientClass = workshopColors[primaryWorkshop as keyof typeof workshopColors] || workshopColors.wog;
  
  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden animate-slide-up cursor-pointer border border-gray-100 hover:border-gray-200"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}>
      {/* Gradient accent bar - thinner and more subtle */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradientClass} opacity-80`}></div>
      
      <div className="p-6">
        {/* Header with name and years badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {profile.faculty.firstName} {profile.faculty.lastName}
            </h3>
            {profile.faculty.currentAffiliation && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1 font-medium">{profile.faculty.currentAffiliation}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              {profile.statistics.totalYears} {profile.statistics.totalYears === 1 ? 'year' : 'years'}
            </span>
          </div>
        </div>

        {/* Workshop participation */}
        <div className="space-y-3 mb-4">
          {Object.entries(profile.participations).map(([workshopId, years]) => {
            const badgeColor = workshopBadgeColors[workshopId as keyof typeof workshopBadgeColors] || workshopBadgeColors.wog;
            return (
              <div key={workshopId} className="group/workshop">
                <div className="flex items-center justify-between mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${badgeColor}`}>
                    {workshops[workshopId]?.shortName || workshopId}
                  </span>
                  <span className="text-xs text-gray-500">
                    {years.length} {years.length === 1 ? 'year' : 'years'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {years.map(year => (
                    <span
                      key={year}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
                    >
                      {year}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Topics Display (if enriched profile) */}
        {'enrichment' in profile && (
          <TopicDisplay profile={profile as EnrichedFacultyProfile} variant="card" />
        )}
        
        {/* Search Highlight */}
        {searchTerm && 'enrichment' in profile && (
          <SearchHighlight profile={profile as EnrichedFacultyProfile} searchTerm={searchTerm} />
        )}

        {/* Footer with timeline info - more elegant styling */}
        <div className="pt-3 mt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className="font-medium text-gray-600">{profile.statistics.firstYear}</span>
            <span className="text-gray-400">–</span>
            <span className="font-medium text-gray-600">{profile.statistics.lastYear}</span>
          </div>
          <div className="text-xs text-gray-400 italic">
            {profile.statistics.lastYear - profile.statistics.firstYear + 1} year span
          </div>
        </div>
      </div>
      
      {/* Subtle hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};