import React from 'react';
import type { EnrichedFacultyProfile, Workshop } from '../types';
import workshopsData from '../data/workshops.json';

interface CommunityOverviewProps {
  profiles: EnrichedFacultyProfile[];
}

export const CommunityOverview: React.FC<CommunityOverviewProps> = ({ profiles }) => {
  // Calculate year range for the community (including teaching history)
  const allYears = new Set<number>();
  profiles.forEach(profile => {
    // Include participation years
    Object.values(profile.participations).forEach(years => {
      years.forEach(year => allYears.add(year));
    });
    
    // Include teaching history years
    if (profile.teaching?.yearsActive) {
      profile.teaching.yearsActive.forEach(year => allYears.add(year));
    }
  });
  
  const minYear = allYears.size > 0 ? Math.min(...allYears) : 2011;
  const maxYear = allYears.size > 0 ? Math.max(...allYears) : new Date().getFullYear();
  const yearRange = `${minYear} - ${maxYear}`;
  const totalYears = maxYear - minYear + 1;
  
  // Calculate teaching statistics
  const facultyWithTeaching = profiles.filter(p => p.teaching && p.teaching.totalSessions > 0);
  
  // Calculate workshop statistics
  const workshops = workshopsData as { [key: string]: Workshop };
  const activeWorkshops = Object.values(workshops).filter(w => w.active).length;
  const historicalWorkshops = Object.values(workshops).filter(w => !w.active).length;
  const totalWorkshops = Object.values(workshops).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Evomics Alumni Community
        </h2>
        <p className="text-gray-600">
          Connecting faculty and students across the global genomics education network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Faculty Alumni */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-blue-700">{profiles.length}</div>
              <div className="text-sm font-medium text-blue-600">Faculty Alumni</div>
              <div className="text-xs text-blue-500 mt-1">{facultyWithTeaching.length} with teaching history</div>
            </div>
            <div className="text-blue-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          </div>
          <div className="text-blue-600 text-sm font-medium">
            Complete Historical Dataset
            <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Student Alumni */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-purple-700">1,411</div>
              <div className="text-sm font-medium text-purple-600">Student Alumni</div>
              <div className="text-xs text-purple-500 mt-1">Core workshop series</div>
            </div>
            <div className="text-purple-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <a
            href="https://shandley.github.io/evomics-students/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors duration-200"
          >
            View Student Dashboard
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-green-700">{totalYears}</div>
              <div className="text-sm font-medium text-green-600">Years of Excellence</div>
              <div className="text-xs text-green-500 mt-1">{yearRange}</div>
            </div>
            <div className="text-green-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-green-600 text-sm font-medium">
            {totalWorkshops} Workshop Series
            <div className="text-xs text-green-500 font-normal mt-1">
              {activeWorkshops} Active • {historicalWorkshops} Historical
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          <strong>Building the future of genomics education</strong> — 
          Where world-class faculty and{' '}
          <a 
            href="https://shandley.github.io/evomics-students/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 underline decoration-dotted"
          >
            dedicated students
          </a>
          {' '}create lasting impact in evolutionary genomics
        </p>
      </div>
    </div>
  );
};