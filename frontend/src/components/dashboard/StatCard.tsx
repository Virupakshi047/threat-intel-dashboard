import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  variant?: 'default' | 'success' | 'warning' | 'critical';
}

export const StatCard = ({ title, value, icon: Icon, change, variant = 'default' }: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'critical':
        return 'border-critical/20 bg-critical/5';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-critical';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getIconColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={change.type === 'increase' ? 'text-critical' : 'text-success'}>
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
            </span>{' '}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};