import { useEffect, useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Threat } from '@/types/threat';
import { ThreatTable } from '@/components/threats/ThreatTable';
import { ThreatFilters } from '@/components/threats/ThreatFilters';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const Threats = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [selectedSeverity, setSelectedSeverity] = useState('all-severities');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  const debouncedSetSearchTerm = useMemo(() => debounce((value: string) => {
    setSearchTerm(value);
  }, 400), []);


  useEffect(() => {
    debouncedSetSearchTerm(searchInput);
    return () => { debouncedSetSearchTerm.cancel(); };
  }, [searchInput, debouncedSetSearchTerm]);

  useEffect(() => {
    const fetchThreats = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(selectedCategory !== 'all-categories' && { category: selectedCategory }),
          ...(selectedSeverity !== 'all-severities' && { severity: severityStringToNumber(selectedSeverity)?.toString() }),
          ...(searchTerm && { search: searchTerm }),
        });
        const response = await fetch(`http://localhost:3000/api/threats?${params}`);
        const result = await response.json();

        
        const mapSeverityScore = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
          if (score >= 4) return 'critical';
          if (score === 3) return 'high';
          if (score === 2) return 'medium';
          return 'low';
        };
        const mappedThreats = (result.data as Threat[]).map((t: Threat) => ({
          ...t,
          title: t.predictedThreatCategory || t.topicModelingLabels || 'Unknown',
          description: t.cleanedText || '',
          category: t.threatCategory,
          severity: mapSeverityScore(t.severityScore),
          date: t.createdAt,
          status: 'active' as const, 
        }));
        setThreats(mappedThreats as Threat[]);
        setTotal(result.total);
      
        const uniqueCategories = Array.from(new Set(mappedThreats.map((t) => t.category)));
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Error fetching threats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchThreats();
  }, [currentPage, selectedCategory, selectedSeverity, searchTerm]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all-categories');
    setSelectedSeverity('all-severities');
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1); 
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchTerm, selectedCategory, selectedSeverity]);

  const severityStringToNumber = (severity: string) => {
    switch (severity) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4; 
      default: return undefined;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Threat Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage security threats across your organization
        </p>
      </div>

      <ThreatFilters
        searchTerm={searchInput}
        selectedCategory={selectedCategory}
        selectedSeverity={selectedSeverity}
        categories={categories}
        onSearchChange={setSearchInput}
        onCategoryChange={setSelectedCategory}
        onSeverityChange={setSelectedSeverity}
        onClearFilters={handleClearFilters}
      />

      <ThreatTable threats={threats} loading={loading} />

      {!loading && total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, total)} of{' '}
            {total} threats
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, idx) =>
                page === '...'
                  ? <span key={idx} className="px-2">...</span>
                  : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(Number(page))}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {!loading && total === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No threats found matching your criteria.</p>
          <Button variant="outline" onClick={handleClearFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Threats;