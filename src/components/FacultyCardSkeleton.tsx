import React from 'react';

export const FacultyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Avatar skeleton */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          {/* Name skeleton */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>

      {/* Workshop badges skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Participation years skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <div className="flex flex-col items-center">
          <div className="h-5 w-8 bg-gray-200 rounded mb-1 animate-pulse" />
          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-center">
          <div className="h-5 w-8 bg-gray-200 rounded mb-1 animate-pulse" />
          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};