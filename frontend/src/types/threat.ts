export interface Threat {
  id: number;
  threatCategory: string;
  iocs: string;
  threatActor: string;
  attackVector: string;
  geographicalLocation: string;
  sentimentInForums: string;
  severityScore: number;
  predictedThreatCategory: string;
  suggestedDefenseMechanism: string;
  riskLevelPrediction: string;
  cleanedText: string;
  keywordExtraction: string;
  namedEntities: string;
  topicModelingLabels: string;
  wordCount: number;
  createdAt: string;
  title?: string;
  description?: string;
  category?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  date?: string;
  status?: 'active' | 'resolved' | 'investigating';
}

export interface ThreatStats {
  totalThreats: number;
  threatsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  threatsByCategory: Record<string, number>;
  latestThreatDate: string;
  recentThreats: Threat[];
}

export interface ThreatStatsApiResponse {
  totalThreats: number;
  categoryCounts: { category: string; count: number }[];
  severityCounts: { severity: number; count: number }[];
}

export interface AnalysisResult {
  prediction: string;
  confidence: number;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}