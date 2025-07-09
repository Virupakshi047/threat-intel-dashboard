import { useEffect, useState, useMemo } from 'react';
import { Threat } from '@/types/threat';
import { dummyThreats, mockApiCall } from '@/lib/dummy-data';
import { ThreatTable } from '@/components/threats/ThreatTable';
import { ThreatFilters } from '@/components/threats/ThreatFilters';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const Threats = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [selectedSeverity, setSelectedSeverity] = useState('all-severities');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        // Simulate API call
        const data = await mockApiCall(dummyThreats, 1000);
        setThreats(data);
      } catch (error) {
        console.error('Error fetching threats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(threats.map(threat => threat.category)));
  }, [threats]);

  const filteredThreats = useMemo(() => {
    return threats.filter(threat => {
      const matchesSearch = threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           threat.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === 'all-categories' || threat.category === selectedCategory;
      const matchesSeverity = !selectedSeverity || selectedSeverity === 'all-severities' || threat.severity === selectedSeverity;
      
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [threats, searchTerm, selectedCategory, selectedSeverity]);

  const paginatedThreats = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredThreats.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredThreats, currentPage]);

  const totalPages = Math.ceil(filteredThreats.length / ITEMS_PER_PAGE);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all-categories');
    setSelectedSeverity('all-severities');
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchTerm, selectedCategory, selectedSeverity]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Threat Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage security threats across your organization
        </p>
      </div>

      <ThreatFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedSeverity={selectedSeverity}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSeverityChange={setSelectedSeverity}
        onClearFilters={handleClearFilters}
      />

      <ThreatTable threats={paginatedThreats} loading={loading} />

      {!loading && filteredThreats.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredThreats.length)} of{' '}
            {filteredThreats.length} threats
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
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

      {!loading && filteredThreats.length === 0 && (
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