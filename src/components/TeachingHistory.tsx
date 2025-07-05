import React from 'react';

interface TeachingSession {
  date: string;
  time: string;
  topic: string;
  type: string;
  location: string;
  coPresenters: string[];
}

interface TeachingData {
  totalSessions: number;
  workshopsHistory: {
    [workshop: string]: {
      [year: number]: TeachingSession[];
    };
  };
  specializations: string[];
  lastTaught: number;
}

interface TeachingHistoryProps {
  teaching: TeachingData;
  facultyName: string;
}

export const TeachingHistory: React.FC<TeachingHistoryProps> = ({ 
  teaching, 
  facultyName 
}) => {
  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'practical':
      case 'lab':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'practical': return 'bg-green-50 text-green-700 border-green-200';
      case 'lab': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Teaching Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Teaching History Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{teaching.totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Object.keys(teaching.workshopsHistory).length}
            </div>
            <div className="text-sm text-gray-600">Workshops</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {teaching.specializations.length}
            </div>
            <div className="text-sm text-gray-600">Specializations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{teaching.lastTaught}</div>
            <div className="text-sm text-gray-600">Last Taught</div>
          </div>
        </div>

        {/* Specializations */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Teaching Specializations:</h4>
          <div className="flex flex-wrap gap-2">
            {teaching.specializations.map((spec, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Workshop Sessions by Year */}
      {Object.entries(teaching.workshopsHistory).map(([workshop, years]) => (
        <div key={workshop} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {workshop === 'WoG' ? 'Workshop on Genomics' :
               workshop === 'WPSG' ? 'Workshop on Population & Speciation Genomics' :
               workshop === 'WPhylo' ? 'Workshop on Phylogenomics' : workshop}
            </h3>
          </div>
          
          <div className="p-6">
            {Object.entries(years)
              .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort years descending
              .map(([year, sessions]) => (
                <div key={year} className="mb-6 last:mb-0">
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm mr-2">
                      {year}
                    </span>
                    <span>{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
                  </h4>
                  
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSessionTypeColor(session.type)}`}>
                                {getSessionTypeIcon(session.type)}
                                {session.type}
                              </span>
                              <span className="text-sm text-gray-500">
                                {session.date} • {session.time}
                              </span>
                              {session.location && (
                                <span className="text-sm text-gray-500">
                                  @ {session.location}
                                </span>
                              )}
                            </div>
                            
                            <h5 className="font-medium text-gray-900 mb-1">
                              {session.topic}
                            </h5>
                            
                            {session.coPresenters.length > 0 && (
                              <p className="text-sm text-gray-600">
                                Co-presented with: {session.coPresenters.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};