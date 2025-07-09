import { useState } from 'react';
import { Threat } from '@/types/threat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ThreatTableProps {
  threats: Threat[];
  loading?: boolean;
}

export const ThreatTable = ({ threats, loading }: ThreatTableProps) => {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'destructive';
      case 'investigating':
        return 'secondary';
      case 'resolved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading threats...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threats.map((threat) => (
                <TableRow key={threat.id}>
                  <TableCell className="font-medium">{threat.title}</TableCell>
                  <TableCell>{threat.category}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(threat.status)}>
                      {threat.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(threat.date)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedThreat(threat);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedThreat?.title}</DialogTitle>
                            </DialogHeader>
                            {selectedThreat && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Description</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedThreat.description}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-1">Category</h4>
                                    <p className="text-sm">{selectedThreat.category}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-1">Severity</h4>
                                    <Badge variant={getSeverityVariant(selectedThreat.severity)}>
                                      {selectedThreat.severity.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-1">Status</h4>
                                    <Badge variant={getStatusVariant(selectedThreat.status)}>
                                      {selectedThreat.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-1">Date</h4>
                                    <p className="text-sm">{formatDate(selectedThreat.date)}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};