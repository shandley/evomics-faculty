import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Fab,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  RateReview as ReviewIcon,
  FilterList as FilterIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import { ROUTES, STATUS_COLORS, CONTAINMENT_COLORS } from '@/constants';
import { Protocol, ProtocolStatus, ContainmentLevel, ProtocolPriority } from '@/types';
import { ProtocolStatusChip } from '@/components/protocols/ProtocolStatusChip';
import { ProtocolStatusTransition } from '@/components/protocols/ProtocolStatusTransition';
import { ProtocolVersionHistory } from '@/components/protocols/ProtocolVersionHistory';
import { CreateVersionDialog } from '@/components/protocols/CreateVersionDialog';

// Department options for filtering
const DEPARTMENT_OPTIONS = [
  'Biology',
  'Microbiology', 
  'Virology',
  'Infectious Diseases',
  'Epidemiology',
  'Chemistry',
  'Medical School',
];

interface SearchFilters {
  query: string;
  status: ProtocolStatus[];
  containmentLevel: ContainmentLevel[];
  department: string[];
  priority: ProtocolPriority[];
}


export const ProtocolsPage = () => {
  const navigate = useNavigate();
  const { canCreateProtocols, user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: [],
    containmentLevel: [],
    department: [],
    priority: [],
  });
  const [createVersionDialog, setCreateVersionDialog] = useState<{
    open: boolean;
    protocolId?: string;
    protocol?: Protocol;
  }>({ open: false });

  // Fetch protocols from real API
  const { data: protocolsResponse, isLoading, refetch } = useQuery({
    queryKey: ['protocols', page, filters, refreshTrigger],
    staleTime: 0, // Always consider data stale to force refresh
    gcTime: 0, // Don't cache data
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      // Add enhanced filters to params
      if (filters.query) {
        params.append('search', filters.query); // Use general search parameter
      }
      
      if (filters.status.length > 0) {
        params.append('status', filters.status[0]); // Backend supports single status filter
      }
      
      if (filters.containmentLevel.length > 0) {
        params.append('containment_level', filters.containmentLevel[0]);
      }
      
      if (filters.department.length > 0) {
        params.append('department', filters.department[0]);
      }
      
      if (filters.priority.length > 0) {
        params.append('priority', filters.priority[0]);
      }
      
      const response = await api.get(`/api/protocols?${params}`);
      const data = response.data;
      
      return {
        protocols: data.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          principalInvestigator: item.principalInvestigator,
          department: item.department || 'Unknown',
          status: item.status as ProtocolStatus,
          containmentLevel: item.containmentLevel as ContainmentLevel,
          priority: 'MEDIUM' as ProtocolPriority, // Default priority
          biologicalAgents: item.biologicalAgents || [],
          procedures: item.procedures || [],
          riskFactors: item.riskFactors || [],
          documents: item.documents || [],
          coInvestigators: [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          submittedAt: item.submittedAt,
          reviewedAt: item.reviewedAt,
          approvedAt: item.approvedAt,
        })),
        total: data.total,
        page: data.page,
        totalPages: Math.ceil(data.total / data.limit),
      };
    },
  });

  const protocols = protocolsResponse?.protocols || [];
  const totalPages = protocolsResponse?.totalPages || 1;

  // Fetch search facets for filter options
  const { data: facetsData } = useQuery({
    queryKey: ['protocol-facets'],
    queryFn: async () => {
      const response = await api.get('/api/protocols/search-facets');
      return response.data;
    }
  });

  // Helper functions
  const getStatusColor = (status: ProtocolStatus) => {
    return STATUS_COLORS[status] || '#757575';
  };

  const canReviewProtocol = (protocol: Protocol) => {
    // Committee members and admins can review protocols that are submitted or under review
    const userRoles = user?.roles || [];
    const canReview = userRoles.includes('COMMITTEE_MEMBER') || userRoles.includes('ADMIN') || userRoles.includes('BIOSAFETY_OFFICER');
    const reviewableStatus = [ProtocolStatus.SUBMITTED, ProtocolStatus.UNDER_REVIEW].includes(protocol.status);
    return canReview && reviewableStatus;
  };

  const getContainmentColor = (level: ContainmentLevel) => {
    return CONTAINMENT_COLORS[level] || '#757575';
  };

  const getPriorityColor = (priority: ProtocolPriority) => {
    switch (priority) {
      case ProtocolPriority.URGENT: return '#d32f2f';
      case ProtocolPriority.HIGH: return '#f57c00';
      case ProtocolPriority.MEDIUM: return '#1976d2';
      case ProtocolPriority.LOW: return '#388e3c';
      default: return '#757575';
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      status: [],
      containmentLevel: [],
      department: [],
      priority: [],
    });
    setPage(1);
  };

  const hasActiveFilters = filters.query || 
    filters.status.length > 0 || 
    filters.containmentLevel.length > 0 || 
    filters.department.length > 0 ||
    filters.priority.length > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScienceIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4">
              Protocols
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              disabled={isLoading}
            >
              Refresh
            </Button>
            {canCreateProtocols() && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(ROUTES.CREATE_PROTOCOL)}
              >
                New Protocol
              </Button>
            )}
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage and review biosafety protocols
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScienceIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{protocolsResponse?.total || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Protocols
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssessmentIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {protocols.filter(p => p.status === ProtocolStatus.UNDER_REVIEW).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Under Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {protocols.filter(p => p.status === ProtocolStatus.APPROVED).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon color="action" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {protocols.filter(p => p.status === ProtocolStatus.DRAFT).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drafts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Statistics */}
      {facetsData && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Protocol Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {Object.values(facetsData.statusCounts).reduce((a: number, b: number) => a + b, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Protocols
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {facetsData.statusCounts.APPROVED || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {facetsData.statusCounts.UNDER_REVIEW || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Under Review
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {facetsData.statusCounts.SUBMITTED || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Submitted
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search protocols..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{
                minWidth: '200px',
                '& .MuiInputLabel-root': {
                  fontSize: '1.2rem !important',
                  fontWeight: '600 !important',
                  color: '#2c3e50 !important',
                  backgroundColor: 'white',
                  padding: '0 8px'
                },
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.2rem !important',
                  minHeight: '64px !important',
                  backgroundColor: '#f8f9fa !important',
                  '& .MuiSelect-select': {
                    padding: '18px 16px !important',
                    fontSize: '1.2rem !important',
                    fontWeight: '500 !important'
                  },
                  '& .MuiSelect-icon': {
                    fontSize: '2rem !important',
                    color: '#4CAF50 !important'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px !important',
                    borderColor: '#ddd !important'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50 !important'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50 !important'
                  }
                }
              }}>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as ProtocolStatus[] }))}
                  input={<OutlinedInput label="Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value.replace('_', ' ')} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '& .MuiMenuItem-root': {
                          fontSize: '1rem',
                          padding: '10px 16px'
                        }
                      }
                    }
                  }}
                >
                  {(facetsData?.availableFilters?.status || Object.values(ProtocolStatus)).map((status: string) => (
                    <MenuItem key={status} value={status}>
                      {status.replace('_', ' ')} 
                      {facetsData?.statusCounts?.[status] && ` (${facetsData.statusCounts[status]})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{
                minWidth: '200px',
                '& .MuiInputLabel-root': {
                  fontSize: '1.2rem !important',
                  fontWeight: '600 !important',
                  color: '#2c3e50 !important',
                  backgroundColor: 'white',
                  padding: '0 8px'
                },
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.2rem !important',
                  minHeight: '64px !important',
                  backgroundColor: '#f8f9fa !important',
                  '& .MuiSelect-select': {
                    padding: '18px 16px !important',
                    fontSize: '1.2rem !important',
                    fontWeight: '500 !important'
                  },
                  '& .MuiSelect-icon': {
                    fontSize: '2rem !important',
                    color: '#4CAF50 !important'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px !important',
                    borderColor: '#ddd !important'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50 !important'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50 !important'
                  }
                }
              }}>
                <InputLabel>Containment</InputLabel>
                <Select
                  multiple
                  value={filters.containmentLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, containmentLevel: e.target.value as ContainmentLevel[] }))}
                  input={<OutlinedInput label="Containment" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '& .MuiMenuItem-root': {
                          fontSize: '1rem',
                          padding: '10px 16px'
                        }
                      }
                    }
                  }}
                >
                  {(facetsData?.availableFilters?.containmentLevel || Object.values(ContainmentLevel)).map((level: string) => (
                    <MenuItem key={level} value={level}>
                      {level}
                      {facetsData?.containmentLevelCounts?.[level] && ` (${facetsData.containmentLevelCounts[level]})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{
                minWidth: '200px',
                '& .MuiInputLabel-root': {
                  fontSize: '1.2rem !important',
                  fontWeight: '600 !important',
                  color: '#2c3e50 !important',
                  backgroundColor: 'white',
                  padding: '0 8px'
                },
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.2rem !important',
                  minHeight: '64px !important',
                  backgroundColor: '#f8f9fa !important',
                  '& .MuiSelect-select': {
                    padding: '18px 16px !important',
                    fontSize: '1.2rem !important',
                    fontWeight: '500 !important'
                  },
                  '& .MuiSelect-icon': {
                    fontSize: '2rem !important',
                    color: '#4CAF50 !important'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px !important',
                    borderColor: '#ddd !important'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50 !important'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50 !important'
                  }
                }
              }}>
                <InputLabel>Department</InputLabel>
                <Select
                  multiple
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value as string[] }))}
                  input={<OutlinedInput label="Department" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '& .MuiMenuItem-root': {
                          fontSize: '1rem',
                          padding: '10px 16px'
                        }
                      }
                    }
                  }}
                >
                  {(facetsData?.departments || DEPARTMENT_OPTIONS).map((dept: string) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    size="small"
                  >
                    Clear
                  </Button>
                )}
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Protocols Table */}
      <Card>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '25%' }}>Protocol</TableCell>
                <TableCell sx={{ width: '15%' }}>Principal Investigator</TableCell>
                <TableCell sx={{ width: '15%' }}>Status & Workflow</TableCell>
                <TableCell sx={{ width: '10%' }}>Priority</TableCell>
                <TableCell sx={{ width: '10%' }}>Containment</TableCell>
                <TableCell sx={{ width: '10%' }}>Version</TableCell>
                <TableCell sx={{ width: '15%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {protocols.map((protocol) => (
                <TableRow key={protocol.id} hover>
                  <TableCell>
                    <Box
                      onClick={() => navigate(`/protocols/${protocol.id}`)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          '& .protocol-title': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        className="protocol-title"
                        sx={{ 
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {protocol.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}
                      >
                        {protocol.description}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}
                      >
                        {protocol.department}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {protocol.principalInvestigator}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ProtocolStatusTransition
                      protocolId={protocol.id}
                      currentStatus={protocol.status}
                      onStatusChanged={() => {
                        // Refresh the protocols list
                        // The query will be invalidated by the ProtocolStatusTransition component
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={protocol.priority}
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor(protocol.priority),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={protocol.containmentLevel}
                      size="small"
                      sx={{
                        backgroundColor: getContainmentColor(protocol.containmentLevel),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`v${protocol.version || 1}`}
                        size="small"
                        variant="outlined"
                      />
                      <IconButton
                        size="small"
                        onClick={() => setCreateVersionDialog({
                          open: true,
                          protocolId: protocol.id,
                          protocol
                        })}
                        title="Create new version"
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/protocols/${protocol.id}`)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    {canReviewProtocol(protocol) && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/protocols/${protocol.id}/review`)}
                      >
                        <ReviewIcon />
                      </IconButton>
                    )}
                    {protocol.status === ProtocolStatus.DRAFT && (
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/protocols/${protocol.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Card>

      {/* Floating Action Button */}
      {canCreateProtocols() && (
        <Fab
          color="primary"
          aria-label="add protocol"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate(ROUTES.CREATE_PROTOCOL)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create Version Dialog */}
      <CreateVersionDialog
        open={createVersionDialog.open}
        onClose={() => setCreateVersionDialog({ open: false })}
        protocolId={createVersionDialog.protocolId || ''}
        currentProtocol={createVersionDialog.protocol}
      />
    </Container>
  );
};