import { useState, useEffect, useMemo } from 'react';
import type { Faculty, Participation, FacultyProfile, Workshop } from '../types';
import { generateFacultyProfiles } from '../utils/dataTransform';
import facultyDataJson from '../data/facultyData.json';
import workshopsJson from '../data/workshops.json';

export function useFacultyData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facultyData, setFacultyData] = useState<{
    faculty: Faculty[];
    participations: Participation[];
    workshops: { [key: string]: Workshop };
  }>({
    faculty: [],
    participations: [],
    workshops: {}
  });

  useEffect(() => {
    try {
      // Transform the faculty data from the JSON structure
      const faculty: Faculty[] = (facultyDataJson as any).faculty.map((f: any) => ({
        id: f.id,
        firstName: f.firstName,
        lastName: f.lastName
      }));

      const participations: Participation[] = (facultyDataJson as any).participations.map((p: any) => ({
        facultyId: p.facultyId,
        workshopId: p.workshopId,
        year: p.year,
        role: p.role
      }));

      setFacultyData({
        faculty,
        participations,
        workshops: workshopsJson as { [key: string]: Workshop }
      });
      setLoading(false);
    } catch (err) {
      console.error('Error loading faculty data:', err);
      setError('Failed to load faculty data');
      setLoading(false);
    }
  }, []);

  const profiles = useMemo(() => {
    if (facultyData.faculty.length === 0) return [];
    return generateFacultyProfiles(facultyData.faculty, facultyData.participations);
  }, [facultyData]);

  return {
    loading,
    error,
    profiles,
    workshops: facultyData.workshops
  };
}