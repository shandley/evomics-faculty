import React from 'react';
import type { EnrichedFacultyProfile } from '../types';
import { getTopicById, getTopicPath } from '../models/taxonomyData';

interface TopicDisplayProps {
  profile: EnrichedFacultyProfile;
  variant?: 'card' | 'modal';
  maxItems?: number;
}

const topicLevelColors = {
  1: 'bg-gray-100 text-gray-700 border-gray-200',
  2: 'bg-gray-100 text-gray-700 border-gray-200',
  3: 'bg-gray-100 text-gray-700 border-gray-200',
  4: 'bg-gray-100 text-gray-700 border-gray-200'
};

export const TopicDisplay: React.FC<TopicDisplayProps> = ({ 
  profile, 
  variant = 'card',
  maxItems = 3 
}) => {
  // Check if profile has standardized research areas
  if (!profile.enrichment?.academic?.researchAreas) {
    return null;
  }
  
  const researchAreas = profile.enrichment.academic.researchAreas;
  
  // Handle legacy format (just an array of strings)
  if (Array.isArray(researchAreas)) {
    if (variant === 'card') {
      return null; // Don't show raw areas on cards
    }
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Research Areas</h4>
        <div className="flex flex-wrap gap-2">
          {researchAreas.map((area, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    );
  }
  
  // Handle new format with standardized topics
  const { primary = [], secondary = [], techniques = [] } = researchAreas.standardized || {};
  const allTopics = [...primary, ...secondary, ...techniques];
  
  if (allTopics.length === 0) {
    return null;
  }
  
  if (variant === 'card') {
    // Card view: show condensed version
    const topicsToShow = allTopics.slice(0, maxItems);
    const remainingCount = allTopics.length - topicsToShow.length;
    
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-1">
          {topicsToShow.map((topic, index) => {
            const colors = topicLevelColors[topic.level as keyof typeof topicLevelColors] || topicLevelColors[2];
            return (
              <span
                key={`${topic.id}-${index}`}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors}`}
                title={topic.description || topic.label}
              >
                {topic.label}
              </span>
            );
          })}
          {remainingCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
              +{remainingCount} more
            </span>
          )}
        </div>
      </div>
    );
  }
  
  // Modal view: show simplified topics
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">Research Topics</h3>

        {/* Combined topics display without categories */}
        <div className="flex flex-wrap gap-2">
          {primary.map((topic, index) => (
            <span
              key={`primary-${index}`}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-violet-50 text-violet-700 border border-violet-200"
              title={topic.description || topic.label}
            >
              {topic.label}
            </span>
          ))}
          {secondary.map((topic, index) => (
            <span
              key={`secondary-${index}`}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-gray-50 text-gray-700 border border-gray-200"
              title={topic.description || topic.label}
            >
              {topic.label}
            </span>
          ))}
          {techniques.map((topic, index) => (
            <span
              key={`technique-${index}`}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-emerald-50 text-emerald-700 border border-emerald-200"
              title={topic.description || topic.label}
            >
              {topic.label}
            </span>
          ))}
        </div>
      </div>

      {/* Raw Areas (if no standardized topics) */}
      {allTopics.length === 0 && researchAreas.raw && researchAreas.raw.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Original Research Areas</h3>
          <div className="flex flex-wrap gap-2">
            {researchAreas.raw.map((area, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface TopicBadgeProps {
  topic: any;
  showPath?: boolean;
}

const TopicBadge: React.FC<TopicBadgeProps> = ({ topic, showPath = false }) => {
  const colors = topicLevelColors[topic.level as keyof typeof topicLevelColors] || topicLevelColors[2];
  
  if (showPath) {
    const path = getTopicPath(topic.id);
    const pathLabels = path.slice(0, -1).map(t => t.label).join(' › ');
    
    return (
      <div className="inline-flex items-center">
        {pathLabels && (
          <span className="text-xs text-gray-500 mr-1">{pathLabels} ›</span>
        )}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors}`}
          title={topic.description || topic.label}
        >
          {topic.label}
        </span>
      </div>
    );
  }
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors}`}
      title={topic.description || topic.label}
    >
      {topic.label}
    </span>
  );
};