import { useState } from 'react';
import { AnalysisResult } from '@/types/threat';
import { mockApiCall } from '@/lib/dummy-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Analysis = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateDummyResult = (inputText: string): AnalysisResult => {
    // Simple keyword-based analysis for demo
    const lowerInput = inputText.toLowerCase();
    
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let category = 'Unknown';
    let confidence = 0.7;
    let tags: string[] = [];

    if (lowerInput.includes('malware') || lowerInput.includes('virus') || lowerInput.includes('trojan')) {
      category = 'Malware';
      severity = 'critical';
      confidence = 0.95;
      tags = ['malware', 'malicious-software'];
    } else if (lowerInput.includes('phishing') || lowerInput.includes('email') || lowerInput.includes('fake')) {
      category = 'Social Engineering';
      severity = 'high';
      confidence = 0.88;
      tags = ['phishing', 'social-engineering'];
    } else if (lowerInput.includes('network') || lowerInput.includes('traffic') || lowerInput.includes('port')) {
      category = 'Network Security';
      severity = 'medium';
      confidence = 0.75;
      tags = ['network', 'traffic-analysis'];
    } else if (lowerInput.includes('sql') || lowerInput.includes('injection') || lowerInput.includes('web')) {
      category = 'Web Security';
      severity = 'high';
      confidence = 0.82;
      tags = ['web-attack', 'sql-injection'];
    } else if (lowerInput.includes('data') || lowerInput.includes('file') || lowerInput.includes('access')) {
      category = 'Data Loss Prevention';
      severity = 'medium';
      confidence = 0.71;
      tags = ['data-access', 'file-security'];
    }

    return {
      prediction: `Analyzed threat description indicates a ${severity} severity ${category.toLowerCase()} incident with ${Math.round(confidence * 100)}% confidence.`,
      confidence,
      category,
      severity,
      tags
    };
  };

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a threat description to analyze.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to /api/analyze
      const analysisResult = generateDummyResult(input);
      const data = await mockApiCall(analysisResult, 2000);
      setResult(data);
      
      toast({
        title: "Analysis Complete",
        description: "Threat analysis has been successfully processed.",
      });
    } catch (error) {
      console.error('Error analyzing threat:', error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing the threat. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Search className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Threat Analysis</h1>
        <p className="text-muted-foreground">
          Analyze threat descriptions using machine learning to predict severity and categorize threats
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Threat Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste or type the threat description here... (e.g., 'Suspicious email with attachment containing malware signature detected')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={10}
              className="resize-none"
            />
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !input.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Threat
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </Button>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>API Endpoint:</strong> POST /api/analyze<br />
                <strong>Expected Response:</strong> JSON with prediction, confidence, category, severity, and tags
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Analyzing threat description...</p>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Enter a threat description and click analyze to see results</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Prediction</h4>
                  <p className="text-sm leading-relaxed">{result.prediction}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <Badge variant="outline" className="text-sm">
                      {result.category}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Severity</h4>
                    <Badge variant={getSeverityVariant(result.severity)} className="text-sm">
                      {getSeverityIcon(result.severity)}
                      <span className="ml-1">{result.severity.toUpperCase()}</span>
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Confidence Score</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(result.confidence * 100)}%</span>
                  </div>
                </div>

                {result.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;