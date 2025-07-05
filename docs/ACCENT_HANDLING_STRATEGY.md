# Accent & Special Character Handling Strategy

## 🎯 **Current Issue Analysis**

### **Identified Problems in Our Dataset:**

1. **Mercè Montoliu Nerín** → Faculty DB has **"Mercè Montoliu-Nerin"** (hyphen vs space!)
2. **Petr Daněček** → Not in faculty database (needs addition)
3. **Successful Matches**: Dag Ahrén, Rosa Fernández (already working)

### **Root Cause**: 
- **Primary issue**: Hyphenation differences (Nerín vs Nerin, space vs hyphen)
- **Secondary issue**: Missing faculty in database
- **Accent handling**: Actually working well with our normalization

## 🔧 **Immediate Fixes for Current Data**

### **Faculty Database Corrections Needed:**

1. **Name Variants to Add**:
   ```json
   {
     "Mercè Montoliu-Nerin": ["Mercè Montoliu Nerín", "Merce Montoliu Nerin", "Merce Montoliu-Nerin"]
   }
   ```

2. **Missing Faculty to Research & Add**:
   - **Ben Langmead**: Johns Hopkins University, prominent bioinformatician
   - **Petr Daněček**: Wellcome Sanger Institute, genomics specialist
   - **Daniel Kintzl**: Workshop coordinator (verify if academic faculty)

### **Expected Improvement**: 28/33 → **31/33** (93.9% match rate)

## 🛠 **Enhanced Matching Algorithm**

### **Current Algorithm Issues:**
```javascript
// Current: Basic normalization only
if (facultyFirst === firstName && facultyLast === lastName) return faculty;
```

### **Robust Algorithm (Already Developed):**
```javascript
function normalizeForMatching(name) {
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
    .replace(/[-\s]+/g, ' ')            // Normalize hyphens/spaces
    .trim();
}
```

## 📋 **Implementation Plan**

### **Phase 1: Immediate Data Fixes** (This Week)

1. **Update Faculty Database**:
   ```javascript
   // Add name variants for existing faculty
   const nameVariants = {
     "merce-montoliu-nerin": [
       "Mercè Montoliu-Nerin",
       "Mercè Montoliu Nerín", 
       "Merce Montoliu Nerin",
       "Merce Montoliu-Nerin"
     ]
   };
   ```

2. **Add Missing Faculty**:
   - Research Ben Langmead, Petr Daněček
   - Add to facultyData.json with proper metadata

3. **Deploy Enhanced Matching**:
   - Replace current matching algorithm
   - Test with all 33 workshop presenters

### **Phase 2: Robust Data Collection Pipeline** (Next Week)

1. **Name Normalization Service**:
   ```javascript
   class NameNormalizer {
     static normalize(name) { /* robust normalization */ }
     static generateVariants(name) { /* create common variations */ }
     static fuzzyMatch(name1, name2, threshold = 0.8) { /* similarity scoring */ }
   }
   ```

2. **Extraction Enhancement**:
   ```javascript
   // Enhanced WebFetch processing
   function extractPresenterNames(htmlContent) {
     return names.map(name => ({
       original: name,
       normalized: NameNormalizer.normalize(name),
       variants: NameNormalizer.generateVariants(name)
     }));
   }
   ```

3. **Confidence Scoring**:
   ```javascript
   {
     presenter: "Mercè Montoliu Nerín",
     matches: [
       { faculty: "Mercè Montoliu-Nerin", confidence: 0.95, reason: "exact_after_normalization" },
       { faculty: "Merce Montoliu", confidence: 0.75, reason: "partial_match" }
     ]
   }
   ```

### **Phase 3: Systematic Quality Assurance** (Ongoing)

1. **Manual Review Queue**:
   - Flag matches below 90% confidence
   - Human review for edge cases
   - Build curated name mapping database

2. **Data Validation Tools**:
   ```bash
   npm run validate-names    # Check for encoding issues
   npm run match-presenters  # Test matching algorithm
   npm run review-queue     # Show uncertain matches
   ```

## 🌐 **Future Data Collection Strategy**

### **Extraction Process Enhancement:**

1. **Multi-Source Name Collection**:
   ```javascript
   const presenterSources = [
     'workshop_schedule_html',      // Primary source
     'faculty_bio_pages',          // Cross-reference
     'institutional_directories',   // Verification
     'orcid_database'              // Authoritative names
   ];
   ```

2. **Character Encoding Standardization**:
   ```javascript
   // Always use UTF-8, normalize immediately
   function processExtractedName(rawName) {
     return {
       original: rawName,
       utf8: Buffer.from(rawName, 'utf8').toString(),
       normalized: NameNormalizer.normalize(rawName),
       ascii: rawName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     };
   }
   ```

3. **Real-time Validation**:
   ```javascript
   // During extraction, immediately flag potential issues
   function validateExtractedPresenter(name) {
     const warnings = [];
     if (hasUncommonChars(name)) warnings.push('special_characters');
     if (!findFacultyMatch(name)) warnings.push('no_database_match');
     return { name, warnings, needsReview: warnings.length > 0 };
   }
   ```

### **Database Maintenance Strategy:**

1. **Name Variant Database**:
   ```json
   {
     "canonical_name": "Mercè Montoliu-Nerin",
     "variants": [
       "Mercè Montoliu Nerín",
       "Merce Montoliu-Nerin", 
       "Merce Montoliu Nerin",
       "M. Montoliu-Nerin"
     ],
     "source": "workshop_schedules",
     "confidence": "verified",
     "last_updated": "2025-01-05"
   }
   ```

2. **Automated Enrichment**:
   ```javascript
   // Automatically suggest variants when adding new faculty
   function suggestNameVariants(canonicalName) {
     return [
       removeAccents(canonicalName),
       addCommonAbbreviations(canonicalName),
       tryAlternativeHyphenation(canonicalName),
       checkInstitutionalDirectory(canonicalName)
     ];
   }
   ```

## 📊 **Success Metrics & Monitoring**

### **Target Improvements:**
- **Current**: 28/33 matches (84.8%)
- **Phase 1**: 31/33 matches (93.9%) - database fixes
- **Phase 2**: 32/33 matches (97.0%) - algorithm enhancement
- **Phase 3**: 33/33 matches (100%) - manual curation

### **Quality Indicators:**
```javascript
const qualityMetrics = {
  matchRate: 'percentage of auto-matched presenters',
  confidenceScore: 'average matching confidence',
  manualReviewRate: 'percentage needing human review',
  falsePositiveRate: 'incorrect matches detected',
  dataCompleteness: 'faculty with full name variants'
};
```

### **Monitoring Dashboard:**
- Real-time matching success rates
- New presenter detection alerts  
- Encoding issue warnings
- Database completeness metrics

## 🔄 **Integration with Current Workflow**

### **WebFetch Enhancement:**
```javascript
// Enhanced workshop extraction with accent handling
async function extractWorkshopWithNameNormalization(url) {
  const schedule = await WebFetch(url, 'extract complete schedule...');
  
  const processedSessions = schedule.sessions.map(session => ({
    ...session,
    presenters: session.presenters.map(presenter => ({
      original: presenter,
      normalized: NameNormalizer.normalize(presenter),
      facultyMatch: findRobustFacultyMatch(presenter),
      needsReview: !findRobustFacultyMatch(presenter)
    }))
  }));
  
  return { ...schedule, processedSessions };
}
```

### **Faculty Integration Ready:**
```javascript
// Enhanced teaching data with confidence scores
const teachingData = {
  facultyId: 'merce-montoliu-nerin',
  teachingSessions: [...],
  nameVariants: ['Mercè Montoliu Nerín', 'Merce Montoliu-Nerin'],
  matchConfidence: 0.98,
  lastVerified: '2025-01-05'
};
```

## ✅ **Action Items for Implementation**

### **This Week:**
1. ✅ Update facultyData.json with name variants for Mercè Montoliu-Nerin
2. ✅ Research and add Ben Langmead, Petr Daněček to database  
3. ✅ Deploy enhanced matching algorithm
4. ✅ Re-run processing to achieve 93.9%+ match rate

### **Next Week:**
1. Create NameNormalizer service class
2. Enhance WebFetch extraction with normalization
3. Build confidence scoring system
4. Create manual review tools

### **Month 1:**
1. Establish systematic quality monitoring
2. Build automated variant suggestion system
3. Create faculty database maintenance tools
4. Document best practices for international names

The enhanced approach will ensure robust handling of international faculty names while maintaining high matching accuracy for future workshop data collection.