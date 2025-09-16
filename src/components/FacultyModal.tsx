import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import type { EnrichedFacultyProfile, Workshop } from '../types';
import { TopicDisplay } from './TopicDisplay';

// Lazy load the TeachingHistory component for better performance
const TeachingHistory = lazy(() => import('./TeachingHistory').then(module => ({ default: module.TeachingHistory })));

interface FacultyModalProps {
  profile: EnrichedFacultyProfile | null;
  workshops: { [key: string]: Workshop };
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export const FacultyModal: React.FC<FacultyModalProps> = ({
  profile,
  workshops,
  isOpen,
  onClose,
  onNavigate
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'teaching'>('overview');

  // Reset tab when modal opens or faculty changes
  useEffect(() => {
    if (isOpen && profile) {
      setActiveTab('overview');
    }
  }, [isOpen, profile?.faculty.id]);

  // Handle ESC key and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onNavigate) {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight' && onNavigate) {
        onNavigate('next');
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !profile) return null;

  const { faculty, participations, statistics, enrichment } = profile;
  const fullName = `${faculty.firstName} ${faculty.lastName}`;

  // Create timeline visualization data
  const allYears = new Set<number>();
  Object.values(participations).flat().forEach(year => allYears.add(year));
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const yearRange = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-2">{fullName}</h2>

          {enrichment?.professional && (
            <div className="text-gray-600">
              {enrichment.professional.title && (
                <p className="text-base font-medium text-gray-700">{enrichment.professional.title}</p>
              )}
              {enrichment.professional.affiliation && (
                <p className="text-sm">{enrichment.professional.affiliation}</p>
              )}
              {enrichment.professional.department && (
                <p className="text-sm text-gray-500">{enrichment.professional.department}</p>
              )}
            </div>
          )}

          {/* Confidence indicator */}
          {enrichment && (
            <div className="mt-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                ${enrichment.confidence === 'high' ? 'bg-green-50 text-green-700 border border-green-200' :
                  enrichment.confidence === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                  'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                Data confidence: {enrichment.confidence}
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 pt-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Overview
              </div>
            </button>
            {profile?.teaching && (
              <button
                onClick={() => setActiveTab('teaching')}
                className={`pb-3 pt-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === 'teaching'
                    ? 'border-violet-600 text-violet-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Teaching History
                  <span className="ml-1 bg-violet-50 text-violet-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {profile.teaching.totalSessions}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-250px)] p-6">
          {activeTab === 'overview' && (
            <>
              {/* Links */}
              {(enrichment?.professional?.labWebsite || enrichment?.academic?.orcid) && (
                <div className="mb-6 flex flex-wrap gap-3">
                  {enrichment?.professional?.labWebsite && (
                    <a
                      href={enrichment.professional.labWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Lab Website
                    </a>
                  )}

                  {enrichment?.academic?.orcid && (
                    <a
                      href={`https://orcid.org/${enrichment.academic.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors border border-green-200"
                    >
                      <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c2.5 0 3.872-1.866 3.872-3.722 0-1.856-1.372-3.722-3.872-3.722h-2.297z"/>
                      </svg>
                      ORCID: {enrichment.academic.orcid}
                    </a>
                  )}
                </div>
              )}

          {/* Bio */}
          {enrichment?.profile?.shortBio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{enrichment.profile.shortBio}</p>
              {enrichment.profile.source && (
                <p className="text-xs text-gray-500 mt-1">Source: {enrichment.profile.source}</p>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Teaching Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{statistics.totalYears}</p>
                <p className="text-xs text-gray-500 mt-1">Total Years</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{statistics.workshopCount}</p>
                <p className="text-xs text-gray-500 mt-1">Workshops</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{statistics.firstYear}</p>
                <p className="text-xs text-gray-500 mt-1">First Year</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{statistics.lastYear}</p>
                <p className="text-xs text-gray-500 mt-1">Last Year</p>
              </div>
            </div>
          </div>

          {/* Research Areas with Topics */}
          <div className="mb-6">
            <TopicDisplay profile={profile} variant="modal" />
          </div>

          {/* Workshop Participation */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Workshop Participation</h3>
            <div className="space-y-3">
              {Object.entries(participations).map(([workshopId, years]) => {
                const workshop = workshops[workshopId];
                if (!workshop) return null;

                const colors = {
                  wog: 'border-slate-400 bg-slate-50',
                  wpsg: 'border-violet-400 bg-violet-50',
                  wphylo: 'border-emerald-400 bg-emerald-50'
                };

                const dotColors = {
                  wog: 'bg-slate-400',
                  wpsg: 'bg-violet-400',
                  wphylo: 'bg-emerald-400'
                };

                return (
                  <div key={workshopId} className={`p-3 rounded-lg border ${colors[workshopId as keyof typeof colors] || 'border-gray-300 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{workshop.name}</h4>
                      <span className="text-xs text-gray-600 font-semibold">{years.length} years</span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Years: {years.sort((a, b) => a - b).join(', ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Data Attribution */}
          {enrichment && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Professional information last updated: {new Date(enrichment.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* No enrichment fallback */}
          {!enrichment && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">Additional information not yet available for this faculty member.</p>
            </div>
          )}
          
              {/* Update Request Button - Always visible */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  {enrichment ? 'Is this information outdated or incorrect?' : 'Help us add information for this faculty member'}
                </p>
                <a
                  href={`mailto:fourthculture@gmail.com?subject=Faculty Profile Update Request - ${fullName}&body=I would like to update my faculty profile information.%0A%0AName: ${fullName}%0AFaculty ID: ${faculty.id}%0A%0APlease send me the update form link.`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {enrichment ? 'Request Update' : 'Add Information'}
                </a>
              </div>
            </>
          )}

          {activeTab === 'teaching' && profile?.teaching && (
            <div className="animate-fade-in">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-8 h-8 border-4 border-primary-200 rounded-full"></div>
                    <div className="w-8 h-8 border-4 border-primary-600 rounded-full animate-spin border-t-transparent absolute top-0"></div>
                  </div>
                  <span className="ml-3 text-gray-600">Loading teaching history...</span>
                </div>
              }>
                <TeachingHistory 
                  teaching={profile.teaching} 
                  facultyName={fullName}
                />
              </Suspense>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {onNavigate && (
          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-2 pointer-events-none">
            <button
              onClick={() => onNavigate('prev')}
              className="pointer-events-auto bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-900 p-1.5 rounded-lg shadow-sm border border-gray-200 transition-all duration-200"
              aria-label="Previous faculty member"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="pointer-events-auto bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-900 p-1.5 rounded-lg shadow-sm border border-gray-200 transition-all duration-200"
              aria-label="Next faculty member"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};