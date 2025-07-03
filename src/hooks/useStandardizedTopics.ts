/**
 * Custom hook for accessing faculty data with standardized topics
 */

import { useMemo, useState, useCallback } from 'react';
import type { EnrichedFacultyProfile, TopicFilter } from '../types';
import { hasStandardizedResearchAreas } from '../types';
import { getAllFaculty, getFacultyByTopic, getTopicUsageStats } from '../models/facultyData';
import { getTopicById, getTopicPath } from '../models/taxonomyData';

interface UseStandardizedTopicsOptions {
  topicFilter?: TopicFilter;
  includeChildTopics?: boolean;
  sortBy?: 'name' | 'topicCount' | 'year';
}

export function useStandardizedTopics(options: UseStandardizedTopicsOptions = {}) {
  const { topicFilter, includeChildTopics = true, sortBy = 'name' } = options;
  
  // Get all faculty
  const allFaculty = useMemo(() => getAllFaculty(), []);
  
  // Filter by topics if provided
  const filteredFaculty = useMemo(() => {
    if (!topicFilter?.selectedTopics?.length) return allFaculty;
    
    const topicIds = new Set<string>(topicFilter.selectedTopics);
    
    // If including child topics, expand the topic set
    if (includeChildTopics) {
      topicFilter.selectedTopics.forEach(topicId => {
        const topic = getTopicById(topicId);
        if (topic?.children) {
          // Add all descendant topics recursively
          const addDescendants = (parentId: string) => {
            const children = topic.children?.filter(childId => getTopicById(childId));
            children?.forEach(childId => {
              topicIds.add(childId);
              addDescendants(childId);
            });
          };
          addDescendants(topicId);
        }
      });
    }
    
    // Filter faculty by topics
    return allFaculty.filter(profile => {
      if (!hasStandardizedResearchAreas(profile.enrichment)) return false;
      
      const { primary, secondary, techniques } = profile.enrichment.academic.researchAreas.standardized;
      const facultyTopics = [...primary, ...secondary, ...techniques];
      
      // Check if faculty has any of the selected topics
      return facultyTopics.some(topic => topicIds.has(topic.id));
    });
  }, [allFaculty, topicFilter, includeChildTopics]);
  
  // Sort faculty
  const sortedFaculty = useMemo(() => {
    const sorted = [...filteredFaculty];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => 
          `${a.faculty.lastName} ${a.faculty.firstName}`.localeCompare(
            `${b.faculty.lastName} ${b.faculty.firstName}`
          )
        );
        break;
        
      case 'topicCount':
        sorted.sort((a, b) => {
          const aCount = hasStandardizedResearchAreas(a.enrichment)
            ? a.enrichment.academic.researchAreas.standardized.primary.length +
              a.enrichment.academic.researchAreas.standardized.secondary.length +
              a.enrichment.academic.researchAreas.standardized.techniques.length
            : 0;
          const bCount = hasStandardizedResearchAreas(b.enrichment)
            ? b.enrichment.academic.researchAreas.standardized.primary.length +
              b.enrichment.academic.researchAreas.standardized.secondary.length +
              b.enrichment.academic.researchAreas.standardized.techniques.length
            : 0;
          return bCount - aCount;
        });
        break;
        
      case 'year':
        sorted.sort((a, b) => b.statistics.lastYear - a.statistics.lastYear);
        break;
    }
    
    return sorted;
  }, [filteredFaculty, sortBy]);
  
  // Get topic usage statistics
  const topicStats = useMemo(() => getTopicUsageStats(), []);
  
  // Get faculty grouped by primary topic
  const facultyByPrimaryTopic = useMemo(() => {
    const grouped = new Map<string, EnrichedFacultyProfile[]>();
    
    allFaculty.forEach(profile => {
      if (hasStandardizedResearchAreas(profile.enrichment)) {
        const primaryTopics = profile.enrichment.academic.researchAreas.standardized.primary;
        
        primaryTopics.forEach(topic => {
          const facultyList = grouped.get(topic.id) || [];
          facultyList.push(profile);
          grouped.set(topic.id, facultyList);
        });
      }
    });
    
    return grouped;
  }, [allFaculty]);
  
  return {
    faculty: sortedFaculty,
    totalFaculty: allFaculty.length,
    filteredCount: filteredFaculty.length,
    topicStats,
    facultyByPrimaryTopic,
  };
}

/**
 * Hook for managing topic filters
 */
export function useTopicFilter() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [includeChildren, setIncludeChildren] = useState(true);
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | undefined>();
  
  const addTopic = useCallback((topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) ? prev : [...prev, topicId]
    );
  }, []);
  
  const removeTopic = useCallback((topicId: string) => {
    setSelectedTopics(prev => prev.filter(id => id !== topicId));
  }, []);
  
  const toggleTopic = useCallback((topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  }, []);
  
  const clearTopics = useCallback(() => {
    setSelectedTopics([]);
  }, []);
  
  const filter: TopicFilter = {
    selectedTopics,
    includeChildren,
    level,
  };
  
  return {
    filter,
    selectedTopics,
    includeChildren,
    level,
    addTopic,
    removeTopic,
    toggleTopic,
    clearTopics,
    setIncludeChildren,
    setLevel,
  };
}