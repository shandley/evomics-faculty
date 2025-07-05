/**
 * Enhanced Name Normalization for International Faculty Matching
 * Handles accents, hyphens, character encoding, and name variations
 */

export class NameNormalizer {
  /**
   * Normalize a name for matching purposes
   * Handles accents, special characters, and common variations
   */
  static normalize(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')                    // Unicode decomposition
      .replace(/[\u0300-\u036f]/g, '')    // Remove diacritics
      .replace(/[àáâãäå]/g, 'a')          // Explicit accent mapping
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[čć]/g, 'c')              // Eastern European
      .replace(/[žš]/g, 's')
      .replace(/[ň]/g, 'n')
      .replace(/[ğ]/g, 'g')               // Turkish
      .replace(/[ł]/g, 'l')               // Polish
      .replace(/[ř]/g, 'r')               // Czech
      .replace(/[ő]/g, 'o')               // Hungarian
      .replace(/[ű]/g, 'u')               // Hungarian
      .replace(/[-\s]+/g, ' ')            // Normalize hyphens/spaces
      .replace(/\s+/g, ' ')               // Normalize multiple spaces
      .trim();
  }

  /**
   * Generate common name variations for a given name
   */
  static generateVariants(fullName: string): string[] {
    const variants = new Set<string>();
    
    // Add original
    variants.add(fullName);
    
    // Add normalized version
    variants.add(this.normalize(fullName));
    
    // Handle hyphen variations
    const withHyphens = fullName.replace(/\s+/g, '-');
    const withoutHyphens = fullName.replace(/-/g, ' ');
    variants.add(withHyphens);
    variants.add(withoutHyphens);
    variants.add(this.normalize(withHyphens));
    variants.add(this.normalize(withoutHyphens));
    
    // Handle accent removal
    const withoutAccents = fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    variants.add(withoutAccents);
    variants.add(this.normalize(withoutAccents));
    
    // Handle common abbreviations (first name to initial)
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      const withInitial = `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
      variants.add(withInitial);
      variants.add(this.normalize(withInitial));
    }
    
    return Array.from(variants).filter(v => v.length > 0);
  }

  /**
   * Calculate similarity score between two names
   */
  static fuzzyMatch(name1: string, name2: string, threshold: number = 0.8): number {
    const norm1 = this.normalize(name1);
    const norm2 = this.normalize(name2);
    
    // Exact match
    if (norm1 === norm2) return 1.0;
    
    // Levenshtein distance similarity
    const distance = this.levenshteinDistance(norm1, norm2);
    const maxLength = Math.max(norm1.length, norm2.length);
    const similarity = 1 - (distance / maxLength);
    
    return similarity;
  }

  /**
   * Find the best faculty match for a presenter name
   */
  static findBestMatch(
    presenterName: string, 
    facultyList: Array<{id: string, firstName: string, lastName: string}>
  ): { faculty: any; confidence: number; reason: string } | null {
    
    const presenterVariants = this.generateVariants(presenterName);
    let bestMatch: { faculty: any; confidence: number; reason: string } | null = null;
    
    for (const faculty of facultyList) {
      const facultyFullName = `${faculty.firstName} ${faculty.lastName}`;
      const facultyVariants = this.generateVariants(facultyFullName);
      
      // Check for exact matches in variants
      for (const presenterVariant of presenterVariants) {
        for (const facultyVariant of facultyVariants) {
          if (this.normalize(presenterVariant) === this.normalize(facultyVariant)) {
            return {
              faculty,
              confidence: 0.95,
              reason: 'exact_after_normalization'
            };
          }
        }
      }
      
      // Check fuzzy matching
      const fuzzyScore = this.fuzzyMatch(presenterName, facultyFullName);
      if (fuzzyScore > 0.8 && (!bestMatch || fuzzyScore > bestMatch.confidence)) {
        bestMatch = {
          faculty,
          confidence: fuzzyScore,
          reason: 'fuzzy_match'
        };
      }
      
      // Check last name + first initial
      const presenterParts = presenterName.split(' ');
      if (presenterParts.length >= 2) {
        const presenterLast = this.normalize(presenterParts[presenterParts.length - 1]);
        const presenterFirst = this.normalize(presenterParts[0]);
        const facultyLast = this.normalize(faculty.lastName);
        const facultyFirst = this.normalize(faculty.firstName);
        
        if (presenterLast === facultyLast && presenterFirst[0] === facultyFirst[0]) {
          const confidence = 0.85;
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = {
              faculty,
              confidence,
              reason: 'last_name_plus_initial'
            };
          }
        }
      }
    }
    
    return bestMatch;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator  // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Validate extracted presenter name for potential issues
   */
  static validateExtractedPresenter(name: string): {
    name: string;
    warnings: string[];
    needsReview: boolean;
  } {
    const warnings: string[] = [];
    
    // Check for special characters
    if (/[àáâãäåèéêëìíîïòóôõöùúûüčćžšňğłřőű]/.test(name)) {
      warnings.push('special_characters');
    }
    
    // Check for unusual patterns
    if (name.includes('  ')) {
      warnings.push('multiple_spaces');
    }
    
    if (name.includes('--')) {
      warnings.push('multiple_hyphens');
    }
    
    // Check for encoding issues
    if (/[\u00C0-\u024F]/.test(name) && !/[a-zA-Z]/.test(name)) {
      warnings.push('encoding_issue');
    }
    
    return {
      name,
      warnings,
      needsReview: warnings.length > 0
    };
  }
}

/**
 * Known name variants for existing faculty
 * This addresses specific cases identified in our analysis
 */
export const KNOWN_NAME_VARIANTS: Record<string, string[]> = {
  'merce-montoliu-nerin': [
    'Mercè Montoliu-Nerin',
    'Mercè Montoliu Nerín', 
    'Merce Montoliu Nerin',
    'Merce Montoliu-Nerin',
    'M. Montoliu-Nerin',
    'M. Montoliu Nerin'
  ],
  'ahren-dag': [
    'Dag Ahrén',
    'Dag Ahren',
    'D. Ahrén',
    'D. Ahren'
  ],
  'fernandez-rosa': [
    'Rosa Fernández',
    'Rosa Fernandez',
    'R. Fernández',
    'R. Fernandez'
  ]
};

/**
 * Enhanced presenter matching with confidence scoring
 */
export function enhancedPresenterMatching(
  presenterName: string,
  facultyList: Array<{id: string, firstName: string, lastName: string}>
): {
  presenter: string;
  matches: Array<{
    faculty: any;
    confidence: number;
    reason: string;
  }>;
  bestMatch?: {
    faculty: any;
    confidence: number;
    reason: string;
  };
} {
  const validation = NameNormalizer.validateExtractedPresenter(presenterName);
  const allMatches: Array<{ faculty: any; confidence: number; reason: string }> = [];
  
  // Try direct matching
  const bestMatch = NameNormalizer.findBestMatch(presenterName, facultyList);
  if (bestMatch) {
    allMatches.push(bestMatch);
  }
  
  // Try known variants
  for (const [facultyId, variants] of Object.entries(KNOWN_NAME_VARIANTS)) {
    for (const variant of variants) {
      if (NameNormalizer.normalize(presenterName) === NameNormalizer.normalize(variant)) {
        const faculty = facultyList.find(f => f.id === facultyId);
        if (faculty) {
          allMatches.push({
            faculty,
            confidence: 0.98,
            reason: 'known_variant'
          });
        }
      }
    }
  }
  
  // Sort by confidence
  allMatches.sort((a, b) => b.confidence - a.confidence);
  
  return {
    presenter: presenterName,
    matches: allMatches,
    bestMatch: allMatches[0] || undefined
  };
}