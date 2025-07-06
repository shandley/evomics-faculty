import React from 'react';
import { UnifiedNavigation } from './UnifiedNavigationSimple';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleUniversalSearch = (query: string) => {
    // For faculty site, implement search functionality
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('search', query);
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
    
    // Trigger a custom event for the search
    window.dispatchEvent(new CustomEvent('universalSearch', { detail: { query } }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Unified Navigation */}
      <UnifiedNavigation 
        currentSite="faculty" 
        onUniversalSearch={handleUniversalSearch}
      />
      
      {/* Faculty Site Specific Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90 backdrop-blur-sm"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
                Evomics Faculty Alumni
              </h1>
              <p className="text-primary-100 mt-2 text-lg">
                Celebrating the educators who have shaped genomics education worldwide, inspiring our{' '}
                <a 
                  href="https://shandley.github.io/evomics-students/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-200 hover:text-white underline decoration-dotted"
                >
                  1,411 student alumni
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
      
      <footer className="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Evomics Alumni Network</h3>
              <p className="text-sm text-gray-600">
                Connecting 172 faculty and{' '}
                <a 
                  href="https://shandley.github.io/evomics-students/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 underline decoration-dotted"
                >
                  1,411 student alumni
                </a>
                {' '}across the global genomics education community
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://shandley.github.io/evomics-students/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Student Alumni
              </a>
              <a
                href="https://evomics.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <span>evomics.org</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Evomics Workshops. Data last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};