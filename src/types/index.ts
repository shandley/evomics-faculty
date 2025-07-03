// Core data types for the faculty alumni system

import type { StandardizedResearchAreas, TopicNode } from './taxonomy';

export interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  currentAffiliation?: string;
  website?: string;
  orcid?: string;
  photo?: string;
  bio?: string;
}

export interface Workshop {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  active: boolean;
  startYear: number;
  endYear?: number;
}

export interface Participation {
  facultyId: string;
  workshopId: string;
  year: number;
  role: ParticipationRole;
}

export const ParticipationRole = {
  FACULTY: 'faculty',
  INSTRUCTOR: 'instructor',
  ORGANIZER: 'organizer',
  DIRECTOR: 'director',
  GUEST: 'guest'
} as const;

export type ParticipationRole = typeof ParticipationRole[keyof typeof ParticipationRole];

export interface FacultyProfile {
  faculty: Faculty;
  participations: {
    [workshopId: string]: number[];
  };
  statistics: {
    totalYears: number;
    workshopCount: number;
    firstYear: number;
    lastYear: number;
    primaryWorkshop: string;
  };
}

export interface Filters {
  search: string;
  workshops: string[];
  year: number | null;  // null means "All Years"
  topics?: string[];  // Selected topic IDs
  includeChildTopics?: boolean;
}

export type SortOption = 'lastName' | 'firstName' | 'totalYears' | 'participationCount' | 'recentYear' | 'firstYear';

// Enriched faculty data from web scraping
export interface FacultyEnrichment {
  lastUpdated: string;
  confidence: 'high' | 'medium' | 'low';
  professional?: {
    title?: string;
    affiliation?: string;
    department?: string;
    labWebsite?: string;
  };
  academic?: {
    orcid?: string;
    googleScholarId?: string;
    researchAreas?: {
      raw: string[];
      standardized?: StandardizedResearchAreas['standardized'];
      lastMigrated?: string;
    };
  };
  profile?: {
    photoUrl?: string;
    shortBio?: string;
    source?: string;
  };
}

export interface EnrichedFacultyProfile extends FacultyProfile {
  enrichment?: FacultyEnrichment;
}

// Re-export taxonomy types for convenience
export type { 
  TopicNode, 
  StandardizedResearchAreas, 
  TopicMapping,
  TaxonomyData,
  MappingData,
  TopicHierarchyNode,
  TopicSearchResult,
  TopicFilter,
  TopicStats
} from './taxonomy';

// Type guards
export function hasStandardizedResearchAreas(
  enrichment?: FacultyEnrichment
): enrichment is FacultyEnrichment & {
  academic: {
    researchAreas: {
      raw: string[];
      standardized: StandardizedResearchAreas['standardized'];
    };
  };
} {
  return !!(
    enrichment?.academic?.researchAreas &&
    'raw' in enrichment.academic.researchAreas &&
    'standardized' in enrichment.academic.researchAreas
  );
}

export function isLegacyResearchAreas(
  researchAreas: any
): researchAreas is string[] {
  return Array.isArray(researchAreas);
}