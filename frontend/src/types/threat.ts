export interface Threat {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  status: 'active' | 'resolved' | 'investigating';
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