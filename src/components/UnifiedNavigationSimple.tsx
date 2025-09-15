import React, { useState } from 'react';

export interface Site {
  id: string;
  name: string;
  shortName: string;
  url: string;
  description: string;
  icon: string;
}

export const EVOMICS_SITES: Site[] = [
  {
    id: 'faculty',
    name: 'Faculty Alumni',
    shortName: 'Faculty',
    url: 'https://shandley.github.io/evomics-faculty/',
    description: 'Explore detailed faculty profiles and teaching histories',
    icon: '👥'
  },
  {
    id: 'workshops',
    name: 'Workshop Archive',
    shortName: 'Workshops',
    url: 'https://shandley.github.io/evomics-workshops/',
    description: 'Browse 580+ teaching sessions across 15 years',
    icon: '📚'
  },
  {
    id: 'students',
    name: 'Student Portal',
    shortName: 'Students',
    url: 'https://shandley.github.io/evomics-students/',
    description: 'Student resources and program information',
    icon: '🎓'
  }
];

interface UnifiedNavigationProps {
  currentSite: string;
  onUniversalSearch?: (query: string) => void;
}

export function UnifiedNavigation({ 
  currentSite, 
  onUniversalSearch
}: UnifiedNavigationProps) {
  const [showSiteMenu, setShowSiteMenu] = useState(false);
  const [showUniversalSearch, setShowUniversalSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSiteInfo = EVOMICS_SITES.find(site => site.id === currentSite);
  const otherSites = EVOMICS_SITES.filter(site => site.id !== currentSite);

  const handleUniversalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onUniversalSearch) {
      onUniversalSearch(searchQuery.trim());
    }
  };

  const handleSiteNavigation = (siteUrl: string) => {
    if (siteUrl === '#') return;
    
    // Add current search context if applicable
    let targetUrl = siteUrl;
    if (searchQuery) {
      targetUrl += `?search=${encodeURIComponent(searchQuery)}`;
    }
    
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 border-b border-primary-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Site Identity */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div>
                <div className="text-white font-bold text-lg">Evomics</div>
                <div className="text-primary-100 text-xs">Genomics Education Ecosystem</div>
              </div>
            </div>
            
            {/* Site Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSiteMenu(!showSiteMenu)}
                className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-400 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                <span className="text-lg">{currentSiteInfo?.icon}</span>
                <span className="font-medium">{currentSiteInfo?.shortName}</span>
                <svg className={`w-4 h-4 transition-transform ${showSiteMenu ? 'rotate-180' : ''}`} 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSiteMenu && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">Evomics Ecosystem</div>
                    <div className="text-xs text-gray-500">Seamlessly explore all platforms</div>
                  </div>
                  
                  {/* Current Site */}
                  <div className="px-4 py-2">
                    <div className="flex items-center space-x-3 p-2 bg-primary-50 rounded-md">
                      <span className="text-lg">{currentSiteInfo?.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-primary-900">{currentSiteInfo?.name}</div>
                        <div className="text-xs text-primary-600">{currentSiteInfo?.description}</div>
                        <div className="text-xs text-primary-500 mt-1">Current Site</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Sites */}
                  <div className="border-t border-gray-100 pt-2">
                    {otherSites.map(site => (
                      <button
                        key={site.id}
                        onClick={() => handleSiteNavigation(site.url)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 p-2">
                          <span className="text-lg">{site.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{site.name}</div>
                            <div className="text-xs text-gray-500">{site.description}</div>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Universal Search */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowUniversalSearch(!showUniversalSearch)}
                className="text-primary-100 hover:text-white transition-colors p-2 rounded-md hover:bg-primary-500"
                title="Universal Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {showUniversalSearch && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-900">Universal Search</div>
                    <div className="text-xs text-gray-500">Search across Faculty, Workshops, and Students</div>
                  </div>
                  
                  <form onSubmit={handleUniversalSearch} className="space-y-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search faculty, expertise, institutions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      autoFocus
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Press Enter or click Search
                      </div>
                      <button
                        type="submit"
                        disabled={!searchQuery.trim()}
                        className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Quick Actions:</div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setSearchQuery('population genetics')}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                      >
                        Population Genetics
                      </button>
                      <button 
                        onClick={() => setSearchQuery('phylogenetics')}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                      >
                        Phylogenetics
                      </button>
                      <button 
                        onClick={() => setSearchQuery('Harvard')}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                      >
                        Harvard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb Context */}
      <div className="bg-primary-800 border-b border-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2 text-primary-200 text-sm">
              <span>Evomics Ecosystem</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">{currentSiteInfo?.name}</span>
            </div>
            
            <div className="text-xs text-primary-300">
              Part of the integrated genomics education platform
            </div>
          </div>
        </div>
      </div>
      
      {/* Click outside handler */}
      {(showSiteMenu || showUniversalSearch) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowSiteMenu(false);
            setShowUniversalSearch(false);
          }}
        />
      )}
    </header>
  );
}

export default UnifiedNavigation;