import React from 'react';
import type { FacultyProfile, Workshop } from '../types';

interface StatsCardsProps {
  profiles: FacultyProfile[];
  workshops: { [key: string]: Workshop };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ profiles, workshops }) => {
  // Calculate statistics
  const totalFaculty = profiles.length;
  const totalWorkshops = Object.keys(workshops).filter(id => workshops[id].active).length;
  
  // Get all unique years across all workshops (including teaching history)
  const allYears = new Set<number>();
  profiles.forEach(profile => {
    // Include participation years
    Object.values(profile.participations).flat().forEach(year => allYears.add(year));
    
    // Include teaching history years if available
    if (profile.teaching?.yearsActive) {
      profile.teaching.yearsActive.forEach(year => allYears.add(year));
    }
  });
  
  const minYear = allYears.size > 0 ? Math.min(...allYears) : new Date().getFullYear();
  const maxYear = allYears.size > 0 ? Math.max(...allYears) : new Date().getFullYear();
  const yearRange = maxYear - minYear + 1;
  
  // Calculate average years per faculty
  const avgYears = profiles.length > 0
    ? (profiles.reduce((sum, p) => sum + p.statistics.totalYears, 0) / profiles.length).toFixed(1)
    : '0';
  
  // Count faculty by workshop
  const workshopCounts = Object.keys(workshops).reduce((acc, workshopId) => {
    acc[workshopId] = profiles.filter(p => p.participations[workshopId]?.length > 0).length;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      label: 'Total Faculty',
      value: totalFaculty,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active Workshops',
      value: totalWorkshops,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Historical Coverage',
      value: `${minYear}-${maxYear}`,
      description: `${yearRange} years`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Avg. Years/Faculty',
      value: avgYears,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {(stat as any).description && (
                  <p className="text-sm text-gray-500 mt-1">{(stat as any).description}</p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workshop breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty by Workshop</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(workshops).map(([id, workshop]) => {
            const count = workshopCounts[id] || 0;
            const percentage = totalFaculty > 0 ? ((count / totalFaculty) * 100).toFixed(0) : '0';
            
            // Calculate years of operation for this workshop
            const workshopYears = new Set<number>();
            profiles.forEach(profile => {
              if (profile.participations[id]?.length > 0) {
                profile.participations[id].forEach(year => workshopYears.add(year));
              }
              if (profile.teaching?.workshopsHistory?.[id.toUpperCase()]) {
                Object.keys(profile.teaching.workshopsHistory[id.toUpperCase()]).forEach(year => 
                  workshopYears.add(parseInt(year))
                );
              }
            });
            
            const workshopMinYear = workshopYears.size > 0 ? Math.min(...workshopYears) : workshop.startYear;
            const workshopMaxYear = workshopYears.size > 0 ? Math.max(...workshopYears) : new Date().getFullYear();
            const workshopRange = `${workshopMinYear}-${workshopMaxYear}`;
            
            const colors = {
              wog: 'bg-blue-100 text-blue-800',
              wpsg: 'bg-purple-100 text-purple-800',
              wphylo: 'bg-green-100 text-green-800'
            };
            
            return (
              <div key={id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${colors[id as keyof typeof colors] || colors.wog}`}>
                    {workshop.shortName}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{workshop.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Active: {workshopRange}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{percentage}% of total</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teaching History Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-slide-up mt-6" style={{ animationDelay: '500ms' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching History Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            // Calculate teaching statistics
            const facultyWithTeaching = profiles.filter(p => p.teaching?.totalSessions > 0);
            const totalSessions = facultyWithTeaching.reduce((sum, p) => sum + (p.teaching?.totalSessions || 0), 0);
            const allSpecializations = new Set<string>();
            facultyWithTeaching.forEach(p => {
              p.teaching?.specializations?.forEach(spec => allSpecializations.add(spec));
            });
            
            const teachingStats = [
              {
                label: 'Faculty with Teaching History',
                value: facultyWithTeaching.length,
                subtitle: `${totalFaculty > 0 ? Math.round((facultyWithTeaching.length / totalFaculty) * 100) : 0}% of total`
              },
              {
                label: 'Total Teaching Sessions',
                value: totalSessions,
                subtitle: `Across ${yearRange} years`
              },
              {
                label: 'Teaching Specializations',
                value: allSpecializations.size,
                subtitle: 'Unique topic areas'
              },
              {
                label: 'Avg Sessions/Faculty',
                value: facultyWithTeaching.length > 0 ? Math.round(totalSessions / facultyWithTeaching.length) : 0,
                subtitle: 'For teaching faculty'
              }
            ];

            return teachingStats.map((stat, index) => (
              <div key={stat.label} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};