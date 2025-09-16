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
    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Evomics Alumni Community
        </h2>
        <p className="text-lg text-gray-700 mb-3 font-medium">
          Connecting faculty and students across the global genomics education network
        </p>
        <p className="text-base text-gray-600">
          Celebrating the educators who have shaped genomics education worldwide, inspiring our{' '}
          <a
            href="https://shandley.github.io/evomics-students/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:text-violet-700 font-semibold underline decoration-dotted"
          >
            1,411 student alumni
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Faculty Alumni */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-gray-900">{profiles.length}</div>
              <div className="text-base font-semibold text-gray-800">Faculty Alumni</div>
              <div className="text-sm text-gray-500 mt-1">{facultyWithTeaching.length} with teaching history</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center text-slate-600 text-sm font-semibold">
            <span>Complete Historical Dataset</span>
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Student Alumni */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-gray-900">1,411</div>
              <div className="text-base font-semibold text-gray-800">Student Alumni</div>
              <div className="text-sm text-gray-500 mt-1">Core workshop series</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
          </div>
          <a
            href="https://shandley.github.io/evomics-students/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors duration-200"
          >
            View Student Dashboard
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-gray-900">{totalYears}</div>
              <div className="text-base font-semibold text-gray-800">Years of Excellence</div>
              <div className="text-sm text-gray-500 mt-1">{yearRange}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
          </div>
          <div className="text-gray-700 text-base font-semibold">
            {totalWorkshops} Workshop Series
            <div className="text-sm text-gray-500 font-normal mt-0.5">
              {activeWorkshops} Active • {historicalWorkshops} Historical
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-lg font-bold text-gray-900 mb-2">
          Building the future of genomics education
        </p>
        <p className="text-base text-gray-600">
          Where world-class faculty and{' '}
          <a
            href="https://shandley.github.io/evomics-students/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:text-violet-700 font-semibold underline decoration-dotted"
          >
            dedicated students
          </a>
          {' '}create lasting impact in evolutionary genomics
        </p>
      </div>
    </div>
  );
};