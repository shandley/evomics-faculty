# Scientific Topics Dictionary - Detailed Implementation Plan

## Project Overview
Implement a hierarchical standardized scientific topics dictionary for the Evomics Faculty Alumni system to improve searchability, consistency, and user experience.

## Success Criteria
- [ ] Reduce 446 unique terms to ~200 standardized terms with mappings
- [ ] Maintain 100% backward compatibility (preserve original terms)
- [ ] Achieve 95% automated mapping accuracy
- [ ] Zero data loss during migration
- [ ] Improved search success rate by 40%

## Phase 1: Foundation & Data Structure (Week 1-2)

### Phase 1A: Define Taxonomy Structure (Day 1-2)
**Goal**: Create the hierarchical category structure for Levels 1 & 2

**Tasks**:
1. Create `scientificTopics.json` with Level 1 categories
2. Define Level 2 disciplines under each Level 1 category
3. Establish naming conventions and ID structure
4. Document category descriptions and scope

**Deliverables**:
- [ ] `src/data/taxonomy/scientificTopics.json`
- [ ] `src/data/taxonomy/README.md` with conventions
- [ ] Level 1: 10-12 major domains defined
- [ ] Level 2: 40-50 core disciplines defined

**Files to create**:
```
src/data/taxonomy/
├── scientificTopics.json
├── README.md
└── examples/
    └── sampleMappings.json
```

### Phase 1B: Term Mapping Analysis (Day 3-4)
**Goal**: Create mappings for the top 100 most frequent current terms

**Tasks**:
1. Extract and rank current research terms by frequency
2. Create mapping table for top 100 terms
3. Identify synonym groups
4. Document mapping rules and exceptions

**Deliverables**:
- [ ] `src/data/taxonomy/termMappings.json`
- [ ] `scripts/analyzeCurrentTerms.js`
- [ ] Mapping coverage report
- [ ] Unmapped terms list for manual review

### Phase 1C: Build Core Data Structures (Day 5-6)
**Goal**: Implement the taxonomy hierarchy and utility functions

**Tasks**:
1. Create TypeScript interfaces for taxonomy
2. Build topic hierarchy data structure
3. Implement utility functions for traversal
4. Create validation functions

**Deliverables**:
- [ ] `src/types/taxonomy.ts`
- [ ] `src/utils/topicHierarchy.ts`
- [ ] `src/utils/topicValidation.ts`
- [ ] Unit tests for utilities

**Key Interfaces**:
```typescript
interface TopicNode {
  id: string;
  label: string;
  level: 1 | 2 | 3 | 4;
  description?: string;
  synonyms?: string[];
  parentId?: string;
  childIds?: string[];
}

interface TopicMapping {
  originalTerm: string;
  standardizedId: string;
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
}
```

## Phase 2: Data Migration & Integration (Week 3-4)

### Phase 2A: Migration Script Development (Day 7-9)
**Goal**: Create scripts to migrate existing faculty data

**Tasks**:
1. Build migration script with rollback capability
2. Implement automated mapping logic
3. Create validation and reporting
4. Test with subset of data

**Deliverables**:
- [ ] `scripts/migrateToStandardizedTopics.js`
- [ ] `scripts/validateMigration.js`
- [ ] `scripts/rollbackMigration.js`
- [ ] Migration test results

**Migration Features**:
- Preserve original terms in `researchAreas.raw`
- Apply automated mappings
- Flag low-confidence mappings
- Generate migration report
- Support dry-run mode

### Phase 2B: Update Data Models (Day 10-11)
**Goal**: Extend TypeScript interfaces and React components

**Tasks**:
1. Update faculty enrichment interfaces
2. Modify data loading logic
3. Update faculty profile types
4. Ensure backward compatibility

**Deliverables**:
- [ ] Updated `src/types/index.ts`
- [ ] Modified `src/hooks/useFacultyData.ts`
- [ ] Updated `facultyEnriched.json` structure
- [ ] Type safety verification

**Updated Interface**:
```typescript
interface EnrichedFacultyProfile {
  // ... existing fields
  enrichment?: {
    // ... existing fields
    academic?: {
      researchAreas?: string[] | {
        raw: string[];
        standardized: {
          primary: TopicNode[];
          secondary: TopicNode[];
          techniques: TopicNode[];
        };
      };
      // ... other fields
    };
  };
}
```

### Phase 2C: Data Quality Assurance (Day 12-13)
**Goal**: Validate migration and ensure data integrity

**Tasks**:
1. Run full migration on copy of data
2. Validate all mappings
3. Review unmapped terms
4. Create manual mapping overrides

**Deliverables**:
- [ ] Migration validation report
- [ ] Manual mappings file
- [ ] Data quality metrics
- [ ] Sign-off checklist

## Phase 3: User Interface Implementation (Week 5-6)

### Phase 3A: Hierarchical Filter Component (Day 14-16)
**Goal**: Build interactive topic filter tree

**Tasks**:
1. Create `TopicFilterTree` component
2. Implement expand/collapse functionality
3. Add checkbox selection with counts
4. Connect to filter state

**Deliverables**:
- [ ] `src/components/TopicFilterTree.tsx`
- [ ] `src/components/TopicFilterTree.css`
- [ ] Integration with `FilterPanel.tsx`
- [ ] Filter functionality tests

**Component Features**:
- Hierarchical display with indentation
- Expand/collapse nodes
- Multi-select with parent/child logic
- Real-time faculty counts
- Search within tree

### Phase 3B: Faculty Display Updates (Day 17-18)
**Goal**: Update faculty cards and modals for standardized topics

**Tasks**:
1. Modify `FacultyCard` topic display
2. Update `FacultyModal` with topic hierarchy
3. Create `TopicBadge` component
4. Implement topic tooltips

**Deliverables**:
- [ ] Updated `src/components/FacultyCard.tsx`
- [ ] Updated `src/components/FacultyModal.tsx`
- [ ] New `src/components/TopicBadge.tsx`
- [ ] Visual regression tests

**Display Changes**:
- Group topics by level (Primary, Methods, Focus)
- Color-code by domain
- Show topic hierarchy on hover
- Link topics to filter

### Phase 3C: Search Enhancement (Day 19-20)
**Goal**: Implement topic-aware search functionality

**Tasks**:
1. Extend search to include topic hierarchy
2. Add topic suggestions/autocomplete
3. Implement synonym search
4. Create "Find experts in..." interface

**Deliverables**:
- [ ] Enhanced `src/utils/search.ts`
- [ ] `src/components/TopicSearch.tsx`
- [ ] Search suggestion API
- [ ] Search accuracy tests

### Phase 3D: Testing & Polish (Day 21-22)
**Goal**: Comprehensive testing and UI polish

**Tasks**:
1. End-to-end testing
2. Performance optimization
3. Accessibility review
4. Documentation update

**Deliverables**:
- [ ] E2E test suite
- [ ] Performance benchmarks
- [ ] Accessibility audit
- [ ] Updated user documentation

## Implementation Checkpoints

### Week 1 Checkpoint
- [ ] Complete taxonomy structure (L1 & L2)
- [ ] Top 100 terms mapped
- [ ] Core data structures implemented
- [ ] 30% of terms standardized

### Week 2 Checkpoint  
- [ ] Migration script functional
- [ ] Data models updated
- [ ] Test migration successful
- [ ] 70% of terms standardized

### Week 3 Checkpoint
- [ ] Filter UI implemented
- [ ] Faculty displays updated
- [ ] Search enhanced
- [ ] 95% of terms standardized

### Final Checkpoint
- [ ] All features implemented
- [ ] Full data migration complete
- [ ] Documentation updated
- [ ] Production ready

## Risk Management

### Technical Risks
1. **Data Loss**: Mitigated by preserving raw terms and rollback capability
2. **Performance**: Mitigated by memoization and lazy loading
3. **Breaking Changes**: Mitigated by backward compatibility layer

### User Experience Risks
1. **Confusion**: Mitigated by gradual rollout and clear communication
2. **Search Disruption**: Mitigated by supporting both old and new terms
3. **Filter Complexity**: Mitigated by progressive disclosure

## Testing Strategy

### Unit Tests
- Topic hierarchy utilities
- Mapping functions
- Search algorithms
- Filter logic

### Integration Tests
- Data migration process
- UI component interaction
- Search and filter combination
- Performance benchmarks

### User Acceptance Tests
- Faculty can find colleagues by topic
- Filters produce expected results
- Search returns relevant faculty
- Original functionality preserved

## Documentation Updates

### Technical Documentation
- [ ] API documentation for new endpoints
- [ ] Component storybook entries
- [ ] Migration guide
- [ ] Troubleshooting guide

### User Documentation
- [ ] Updated help text
- [ ] New feature announcement
- [ ] Video tutorial (optional)
- [ ] FAQ updates

## Success Metrics Tracking

### Quantitative Metrics
- Term reduction: 446 → ~200 (55% reduction)
- Mapping accuracy: Target 95%
- Search success rate: +40% improvement
- Filter usage: +50% increase

### Qualitative Metrics
- User feedback surveys
- Faculty satisfaction with representation
- Ease of finding experts
- System maintainability

## Post-Implementation Tasks

### Week 7+ (Maintenance Phase)
1. Monitor usage analytics
2. Collect user feedback
3. Address unmapped terms
4. Plan quarterly updates
5. Document lessons learned

### Future Enhancements
1. Level 3 & 4 expansion
2. External taxonomy integration
3. Machine learning suggestions
4. Collaborative filtering
5. Topic trend analysis

## Resource Requirements

### Development Time
- Developer: 160 hours (4 weeks)
- Code Review: 20 hours
- Testing: 20 hours
- Documentation: 10 hours

### Stakeholder Time
- Domain Expert Consultation: 20 hours
- User Testing: 10 hours
- Faculty Feedback: 5 hours

## Communication Plan

### Stakeholder Updates
- Weekly progress reports
- Checkpoint demos
- Final presentation

### User Communication
- Pre-launch announcement
- Feature introduction email
- In-app guidance
- Feedback collection

## Definition of Done

### Feature Complete When:
1. ✓ All 446 terms mapped or documented
2. ✓ UI components fully functional
3. ✓ Search and filter working with new taxonomy
4. ✓ Zero data loss verified
5. ✓ Performance benchmarks met
6. ✓ Documentation complete
7. ✓ Tests passing (>90% coverage)
8. ✓ Stakeholder sign-off received

---

## Next Steps
1. Review and approve implementation plan
2. Set up development branch
3. Begin Phase 1A: Define taxonomy structure
4. Schedule weekly check-ins
5. Prepare stakeholder communication