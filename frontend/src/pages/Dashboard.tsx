import { useEffect, useState } from 'react';
import { ThreatStats, ThreatStatsApiResponse } from '@/types/threat';
import { Threat } from '@/types/threat';
import { StatCard } from '@/components/dashboard/StatCard';
import { ThreatChart } from '@/components/dashboard/ThreatChart';
import { Shield, AlertTriangle, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function getSeverityLabel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 4) return 'CRITICAL';
  if (score === 3) return 'HIGH';
  if (score === 2) return 'MEDIUM';
  return 'LOW';
}

function getSeverityClass(label: string) {
  switch (label) {
    case 'CRITICAL': return 'bg-red-600 text-white';
    case 'HIGH': return 'bg-orange-600 text-white';
    case 'MEDIUM': return 'bg-yellow-500 text-black';
    case 'LOW': return 'bg-green-600 text-white';
    default: return 'bg-muted text-foreground';
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState<ThreatStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentThreats, setRecentThreats] = useState<Threat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch from real API
        const response = await fetch('http://localhost:3000/api/threats/stats');
        const apiData: ThreatStatsApiResponse = await response.json();
        // Map API response to ThreatStats shape for UI
        const mappedStats: ThreatStats = {
          totalThreats: apiData.totalThreats,
          threatsBySeverity: {
            low: apiData.severityCounts.find(s => s.severity === 1)?.count || 0,
            medium: apiData.severityCounts.find(s => s.severity === 2)?.count || 0,
            high: apiData.severityCounts.find(s => s.severity === 3)?.count || 0,
            critical: apiData.severityCounts.find(s => s.severity === 4 || s.severity === 5)?.count || 0,
          },
          threatsByCategory: Object.fromEntries(apiData.categoryCounts.map(c => [c.category, c.count])),
          latestThreatDate: '', // Not provided by API
          recentThreats: [] // Not provided by API
        };
        setStats(mappedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentThreats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/threats?limit=5&sort=createdAt_desc');
        const data = await response.json();
        setRecentThreats(data.data || []);
      } catch (error) {
        console.error('Error fetching recent threats:', error);
      }
    };

    fetchStats();
    fetchRecentThreats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>;
  }

  const severityData = [
    { name: 'Critical', value: stats.threatsBySeverity.critical, color: '#dc2626' },
    { name: 'High', value: stats.threatsBySeverity.high, color: '#ea580c' },
    { name: 'Medium', value: stats.threatsBySeverity.medium, color: '#ca8a04' },
    { name: 'Low', value: stats.threatsBySeverity.low, color: '#16a34a' },
  ];

  const categoryData = Object.entries(stats.threatsByCategory).map(([name, value]) => ({
    name,
    value,
    color: '#3b82f6'
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of current threat landscape and security metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Threats"
          value={stats.totalThreats}
          icon={Shield}
          change={{ value: 12, type: 'increase' }}
          variant="critical"
        />
        {Object.entries(stats.threatsByCategory).slice(0, 4).map(([cat, count], idx) => {
          const iconMap = [Activity, Shield, AlertTriangle, Clock];
          const variantMap: ("default" | "success" | "warning" | "critical")[] = ['default', 'success', 'warning', 'critical'];
          return (
            <StatCard
              key={cat}
              title={`${cat} Threats`}
              value={count}
              icon={iconMap[idx % iconMap.length]}
              variant={variantMap[idx % variantMap.length]}
            />
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ThreatChart
          data={severityData.filter(d => d.value > 0)}
          title="Threats by Severity"
          type="pie"
        />
        <ThreatChart
          data={categoryData}
          title="Threats by Category"
          type="line"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentThreats.length === 0 ? (
              <div className="text-muted-foreground">No recent threats found.</div>
            ) : (
              recentThreats.map((threat) => {
                const severityLabel = getSeverityLabel(threat.severityScore);
                return (
                  <div key={threat.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{threat.threatCategory}</h4>
                      <p className="text-sm text-muted-foreground">{threat.threatActor}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityClass(severityLabel)}`}>
                        {severityLabel}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {threat.createdAt ? new Date(threat.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;