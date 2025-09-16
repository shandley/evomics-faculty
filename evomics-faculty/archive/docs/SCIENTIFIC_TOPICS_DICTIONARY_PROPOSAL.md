# Standardized Scientific Topics Dictionary Proposal
## Evomics Faculty Alumni System

### Executive Summary

This proposal outlines a comprehensive plan to implement a standardized scientific topics dictionary for the Evomics Faculty Alumni system. Based on analysis of 163 enriched faculty profiles containing 446 unique research terms, we propose a hierarchical taxonomy system that will improve searchability, consistency, and user experience while maintaining the richness of faculty expertise descriptions.

### Current State Analysis

#### Key Statistics
- **163 faculty** with research area data
- **446 unique terms** with significant redundancy
- **984 total mentions** averaging 6 terms per faculty
- **70% of terms** appear only 1-2 times (fragmentation)
- **Top 10 terms** account for 43% of all mentions

#### Major Issues Identified
1. **Terminology Inconsistency**: Same concepts described differently
   - "bioinformatics" (63) vs "computational biology" (40)
   - "next-generation sequencing" vs "NGS" vs "next generation sequencing"
   
2. **No Hierarchical Structure**: Flat list mixing broad fields with specific techniques
   - "biology" appears alongside "CRISPR-Cas9 genome editing"
   
3. **Formatting Variations**: Hyphenation and capitalization inconsistencies
   - "single-cell genomics" vs "single cell genomics"
   
4. **Missing Relationships**: No way to find related expertise
   - Can't easily find all "genomics" experts across subspecialties

### Proposed Solution: Hierarchical Scientific Topics Dictionary

#### Architecture Overview

```
Level 1: Major Scientific Domains (10-12 categories)
  └── Level 2: Core Disciplines (40-50 categories)
      └── Level 3: Specializations (150-200 terms)
          └── Level 4: Techniques/Methods (300-400 terms)
```

#### Detailed Taxonomy Structure

##### Level 1: Major Scientific Domains

1. **Computational Sciences**
2. **Genomics & Omics Sciences**
3. **Evolutionary Biology**
4. **Population & Quantitative Sciences**
5. **Microbiology & Microbiome**
6. **Molecular & Cellular Biology**
7. **Medical & Clinical Sciences**
8. **Ecology & Environmental Sciences**
9. **Mathematical & Statistical Sciences**
10. **Technology & Methodology Development**

##### Level 2: Core Disciplines (Example: Genomics & Omics Sciences)

```yaml
Genomics & Omics Sciences:
  - Comparative Genomics
  - Functional Genomics
  - Population Genomics
  - Evolutionary Genomics
  - Structural Genomics
  - Single-Cell Genomics
  - Metagenomics
  - Transcriptomics
  - Proteomics
  - Metabolomics
  - Epigenomics
  - Pangenomics
```

##### Level 3: Specializations (Example: Comparative Genomics)

```yaml
Comparative Genomics:
  - Vertebrate Genomics
  - Plant Genomics
  - Fungal Genomics
  - Microbial Genomics
  - Synteny Analysis
  - Orthology Prediction
  - Genome Evolution
  - Phylogenomics
```

##### Level 4: Techniques/Methods (Example: Under Phylogenomics)

```yaml
Phylogenomics:
  - Maximum Likelihood Methods
  - Bayesian Inference
  - Coalescent Methods
  - Network Analysis
  - Dating Methods
  - Gene Tree Reconciliation
  - Supertree Methods
```

### Implementation Strategy

#### Phase 1: Foundation (Weeks 1-2)
1. **Create Core Dictionary**
   - Define Level 1 & 2 categories
   - Map top 100 most frequent current terms
   - Establish naming conventions

2. **Build Mapping Table**
   ```javascript
   const termMappings = {
     // Current term -> Standardized term
     "bioinformatics": "Computational Biology",
     "computational biology": "Computational Biology",
     "next-generation sequencing": "High-Throughput Sequencing",
     "NGS": "High-Throughput Sequencing",
     "ngs": "High-Throughput Sequencing"
   };
   ```

3. **Create Hierarchy Structure**
   ```javascript
   const topicHierarchy = {
     "Genomics & Omics Sciences": {
       displayName: "Genomics & Omics Sciences",
       level: 1,
       children: {
         "Comparative Genomics": {
           displayName: "Comparative Genomics",
           level: 2,
           children: {
             "Plant Genomics": { level: 3 },
             "Fungal Genomics": { level: 3 }
           }
         }
       }
     }
   };
   ```

#### Phase 2: Integration (Weeks 3-4)
1. **Update Data Model**
   ```typescript
   interface FacultyResearchAreas {
     raw: string[];           // Original terms (preserved)
     standardized: {
       primary: TopicNode[];  // Main research areas
       secondary: TopicNode[]; // Related/minor areas
       techniques: TopicNode[]; // Specific methods
     };
     lastUpdated: string;
   }
   ```

2. **Migration Script**
   - Preserve original terms
   - Apply automated mapping
   - Flag unmapped terms for review

3. **UI Components**
   - Hierarchical filter tree
   - Tag-based display
   - Breadcrumb navigation

#### Phase 3: Enhanced Features (Weeks 5-6)
1. **Smart Search**
   - Search across hierarchy levels
   - Synonym support
   - "Related topics" suggestions

2. **Analytics Dashboard**
   - Topic distribution charts
   - Trending research areas
   - Workshop-specific expertise maps

3. **Faculty Discovery**
   - "Find experts in..." interface
   - Topic-based recommendations
   - Collaboration network visualization

### Data Structure Examples

#### JSON Schema for Topics Dictionary
```json
{
  "topics": {
    "genomics-omics": {
      "id": "genomics-omics",
      "label": "Genomics & Omics Sciences",
      "level": 1,
      "description": "Study of genomes and molecular data at scale",
      "synonyms": ["omics", "genome science"],
      "children": ["comparative-genomics", "functional-genomics", ...],
      "parentId": null
    },
    "comparative-genomics": {
      "id": "comparative-genomics",
      "label": "Comparative Genomics",
      "level": 2,
      "description": "Comparison of genome sequences between species",
      "synonyms": ["genome comparison", "comparative genome analysis"],
      "children": ["plant-genomics", "fungal-genomics", ...],
      "parentId": "genomics-omics"
    }
  }
}
```

#### Faculty Enrichment Update
```json
{
  "leonard-guy": {
    "enrichment": {
      "academic": {
        "researchAreas": {
          "raw": ["comparative genomics", "phylogenomics", "genome assembly"],
          "standardized": {
            "primary": [
              {
                "id": "comparative-genomics",
                "path": ["genomics-omics", "comparative-genomics"],
                "label": "Comparative Genomics"
              }
            ],
            "techniques": [
              {
                "id": "genome-assembly",
                "path": ["technology-methods", "sequencing-tech", "genome-assembly"],
                "label": "Genome Assembly"
              }
            ]
          }
        }
      }
    }
  }
}
```

### User Interface Enhancements

#### 1. Filter Interface
```
Research Areas
├─ □ Genomics & Omics Sciences (89)
│  ├─ □ Comparative Genomics (34)
│  ├─ □ Functional Genomics (23)
│  └─ □ Population Genomics (19)
├─ □ Evolutionary Biology (72)
│  ├─ □ Molecular Evolution (31)
│  └─ □ Phylogenetics (28)
└─ □ Computational Sciences (95)
   ├─ □ Bioinformatics (63)
   └─ □ Algorithm Development (18)
```

#### 2. Faculty Card Display
Instead of:
```
Research Areas: comparative genomics, phylogenomics, genome assembly, evolutionary relationships, eukaryotes, bioinformatics
```

Display as:
```
Primary Expertise: Comparative Genomics • Phylogenomics
Methods: Genome Assembly • Bioinformatics
Focus: Eukaryotic Evolution
```

#### 3. Advanced Search
```
Find faculty who work on: [________]
                          ↓
Suggestions: • Comparative Genomics (34 faculty)
            • Plant Genomics (12 faculty)
            • Genome Evolution (8 faculty)
```

### Benefits & Impact

#### For Users
1. **Improved Discovery**: Find experts by browsing topics hierarchically
2. **Better Search**: Consistent terminology improves search accuracy
3. **Clear Expertise**: Understand faculty specializations at a glance
4. **Related Experts**: Discover faculty in adjacent fields

#### For System
1. **Data Quality**: Reduced redundancy and inconsistency
2. **Analytics**: Track research trends and gaps
3. **Scalability**: Easy to add new topics as science evolves
4. **Integration**: Compatible with external taxonomies (MeSH, GO, etc.)

#### For Faculty
1. **Accurate Representation**: Expertise properly categorized
2. **Increased Visibility**: Found through multiple search paths
3. **Networking**: Connect with researchers in related fields

### Technical Implementation Details

#### Backend Components
1. **Dictionary Service**
   ```typescript
   class ScientificTopicService {
     getTopicById(id: string): Topic
     getTopicHierarchy(): TopicTree
     searchTopics(query: string): Topic[]
     mapRawTerm(term: string): Topic
     getRelatedTopics(topicId: string): Topic[]
   }
   ```

2. **Migration Utilities**
   ```typescript
   class TopicMigration {
     standardizeResearchAreas(faculty: Faculty[]): MigrationReport
     validateMapping(mappings: Map<string, string>): ValidationResult
     generateUnmappedReport(): UnmappedTerm[]
   }
   ```

3. **Search Enhancement**
   ```typescript
   class EnhancedSearch {
     searchByTopic(topicId: string, includeChildren: boolean): Faculty[]
     suggestTopics(partial: string): Topic[]
     findRelatedFaculty(facultyId: string): Faculty[]
   }
   ```

#### Frontend Components
1. **TopicTree Component**: Hierarchical checkbox tree
2. **TopicTags Component**: Styled topic badges
3. **TopicBreadcrumb Component**: Navigation path display
4. **TopicSearch Component**: Autocomplete with hierarchy

### Maintenance & Governance

#### Update Process
1. **Quarterly Reviews**: Assess new terms and needed additions
2. **Community Input**: Faculty can suggest new topics
3. **Version Control**: Track dictionary changes over time
4. **Deprecation Policy**: Handle obsolete terms gracefully

#### Quality Control
1. **Validation Rules**: Ensure consistency in new entries
2. **Duplicate Detection**: Prevent redundant terms
3. **Synonym Management**: Maintain alternative names
4. **Cross-References**: Link to external taxonomies

### Success Metrics

#### Quantitative
- Reduce unique terms by 60% while maintaining expressiveness
- Improve search success rate by 40%
- Increase filter usage by 50%
- Achieve 95% automated mapping accuracy

#### Qualitative
- User satisfaction with search and discovery
- Faculty approval of expertise representation
- Ease of finding related researchers
- System maintainability improvement

### Timeline & Resources

#### 6-Week Implementation Plan
- **Weeks 1-2**: Dictionary creation and mapping
- **Weeks 3-4**: System integration and migration
- **Weeks 5-6**: UI enhancements and testing

#### Required Resources
- Developer time: 120-160 hours
- Domain expert consultation: 20 hours
- User testing: 10 hours
- Documentation: 10 hours

### Risk Mitigation

1. **Data Loss**: Keep original terms, reversible migration
2. **User Confusion**: Gradual rollout with clear communication
3. **Mapping Errors**: Manual review process for edge cases
4. **Scope Creep**: Start with core disciplines, expand later

### Conclusion

Implementing a standardized scientific topics dictionary will transform the Evomics Faculty Alumni system from a simple directory into a powerful discovery platform. By organizing the current 446 fragmented terms into a coherent hierarchy, we enable better search, filtering, and analytics while maintaining the richness of faculty expertise descriptions.

The phased approach ensures minimal disruption while delivering immediate value through improved consistency and discoverability. This foundation will support future enhancements including recommendation systems, collaboration networks, and trend analysis.

### Next Steps

1. **Approval**: Review and approve the proposed taxonomy structure
2. **Prioritization**: Confirm implementation timeline and resources
3. **Pilot**: Test with a subset of faculty data
4. **Feedback**: Gather input from key stakeholders
5. **Launch**: Roll out with comprehensive documentation

This standardization effort represents a crucial step in evolving the Evomics Faculty Alumni system into a best-in-class academic directory that truly serves its community of world-class educators and researchers.