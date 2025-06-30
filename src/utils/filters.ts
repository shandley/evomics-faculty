import type { FacultyProfile, Filters, SortOption } from '../types';

export function filterFacultyProfiles(
  profiles: FacultyProfile[],
  filters: Filters
): FacultyProfile[] {
  return profiles.filter(profile => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName = `${profile.faculty.firstName} ${profile.faculty.lastName}`.toLowerCase();
      if (!fullName.includes(searchLower)) {
        return false;
      }
    }

    // Workshop filter
    if (filters.workshops.length > 0) {
      const hasWorkshop = filters.workshops.some(workshopId => 
        profile.participations[workshopId] && profile.participations[workshopId].length > 0
      );
      if (!hasWorkshop) {
        return false;
      }
    }

    // Year filter - show faculty who taught in the selected year
    if (filters.year !== null) {
      const facultyYears = Object.values(profile.participations).flat();
      if (!facultyYears.includes(filters.year)) {
        return false;
      }
    }

    return true;
  });
}

export function sortFacultyProfiles(
  profiles: FacultyProfile[],
  sortOption: SortOption
): FacultyProfile[] {
  const sorted = [...profiles];
  
  switch (sortOption) {
    case 'lastName':
      return sorted.sort((a, b) => 
        a.faculty.lastName.localeCompare(b.faculty.lastName) ||
        a.faculty.firstName.localeCompare(b.faculty.firstName)
      );
    
    case 'firstName':
      return sorted.sort((a, b) => 
        a.faculty.firstName.localeCompare(b.faculty.firstName) ||
        a.faculty.lastName.localeCompare(b.faculty.lastName)
      );
    
    case 'participationCount':
      return sorted.sort((a, b) => 
        b.statistics.totalYears - a.statistics.totalYears ||
        a.faculty.lastName.localeCompare(b.faculty.lastName)
      );
    
    case 'recentYear':
      return sorted.sort((a, b) => 
        b.statistics.lastYear - a.statistics.lastYear ||
        a.faculty.lastName.localeCompare(b.faculty.lastName)
      );
    
    case 'firstYear':
      return sorted.sort((a, b) => 
        a.statistics.firstYear - b.statistics.firstYear ||
        a.faculty.lastName.localeCompare(b.faculty.lastName)
      );
    
    default:
      return sorted;
  }
}