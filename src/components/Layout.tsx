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
      
      {/* Simplified Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display tracking-tight">
              Faculty Alumni Directory
            </h1>
            <p className="text-base md:text-lg text-gray-600 mt-2 font-medium">
              Explore the educators who have shaped genomics education across our workshop series
            </p>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        {children}
      </main>
      
      <footer className="mt-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Evomics Faculty Alumni</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A comprehensive directory of 172 educators who have shaped genomics education through hands-on workshops worldwide.
              </p>
            </div>

            {/* Affiliated Sites */}
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Affiliated Sites</h4>
              <div className="space-y-2">
                <a
                  href="https://shandley.github.io/evomics-students/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-violet-600 transition-colors"
                >
                  <span className="text-base">🎓</span>
                  <span>Student Alumni Portal</span>
                  <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a
                  href="https://shandley.github.io/evomics-workshops/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <span className="text-base">📚</span>
                  <span>Workshop Archives</span>
                  <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-right">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Resources</h4>
              <div className="space-y-2">
                <a
                  href="https://evomics.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Main Website
                </a>
                <a
                  href="https://github.com/shandley/evomics-faculty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Evomics Workshops. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                Data last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};