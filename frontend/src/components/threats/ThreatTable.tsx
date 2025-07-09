import { useState } from 'react';
import { Threat } from '@/types/threat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ThreatTableProps {
  threats: Threat[];
  loading?: boolean;
}

export const ThreatTable = ({ threats, loading }: ThreatTableProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threats.map((threat) => (
                <>
                  <TableRow key={threat.id}>
                    <TableCell className="font-medium">{threat.title}</TableCell>
                    <TableCell>{threat.category}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityVariant(threat.severity)}>
                        {threat.severity?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(threat.date)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setExpandedId(expandedId === threat.id ? null : threat.id)}
                        aria-label="Show details"
                      >
                        {expandedId === threat.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedId === threat.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted">
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: 'Description', key: 'description' },
                            { label: 'Threat Actor', key: 'threatActor' },
                            { label: 'Attack Vector', key: 'attackVector' },
                            { label: 'Geographical Location', key: 'geographicalLocation' },
                            { label: 'Sentiment In Forums', key: 'sentimentInForums' },
                            { label: 'Suggested Defense Mechanism', key: 'suggestedDefenseMechanism' },
                            { label: 'Risk Level Prediction', key: 'riskLevelPrediction' },
                            { label: 'Keyword Extraction', key: 'keywordExtraction' },
                            { label: 'Named Entities', key: 'namedEntities' },
                            { label: 'Topic Modeling Labels', key: 'topicModelingLabels' },
                            { label: 'IOCs', key: 'iocs' },
                            { label: 'Word Count', key: 'wordCount' },
                          ].map(({ label, key }) => (
                            <div key={key}>
                              <strong>{label}:</strong>{' '}
                              <span className="text-muted-foreground">{threat[key as keyof Threat]}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};