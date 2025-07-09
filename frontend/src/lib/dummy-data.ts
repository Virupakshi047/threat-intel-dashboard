import { Threat, ThreatStats } from '@/types/threat';

export const dummyThreats: Threat[] = [
  {
    id: '1',
    title: 'Suspicious Network Activity Detected',
    description: 'Unusual traffic patterns observed from external IP addresses attempting to access restricted ports.',
    category: 'Network Security',
    severity: 'high',
    date: '2024-01-15T10:30:00Z',
    status: 'investigating'
  },
  {
    id: '2',
    title: 'Malware Signature Identified',
    description: 'Known malware signature detected in incoming email attachments from suspicious sender.',
    category: 'Malware',
    severity: 'critical',
    date: '2024-01-14T14:22:00Z',
    status: 'active'
  },
  {
    id: '3',
    title: 'Failed Login Attempts',
    description: 'Multiple failed login attempts detected from various IP addresses targeting admin accounts.',
    category: 'Authentication',
    severity: 'medium',
    date: '2024-01-13T09:15:00Z',
    status: 'resolved'
  },
  {
    id: '4',
    title: 'Data Exfiltration Attempt',
    description: 'Large data transfer detected during off-hours from internal systems to unknown external servers.',
    category: 'Data Loss Prevention',
    severity: 'critical',
    date: '2024-01-12T23:45:00Z',
    status: 'investigating'
  },
  {
    id: '5',
    title: 'Phishing Email Campaign',
    description: 'Coordinated phishing emails targeting employees with fake login pages and credential harvesting.',
    category: 'Social Engineering',
    severity: 'high',
    date: '2024-01-11T11:20:00Z',
    status: 'resolved'
  },
  {
    id: '6',
    title: 'Unauthorized File Access',
    description: 'Unauthorized access attempts to sensitive files in the document management system.',
    category: 'Access Control',
    severity: 'medium',
    date: '2024-01-10T16:30:00Z',
    status: 'resolved'
  },
  {
    id: '7',
    title: 'SQL Injection Attempt',
    description: 'SQL injection patterns detected in web application logs targeting customer database.',
    category: 'Web Security',
    severity: 'high',
    date: '2024-01-09T13:45:00Z',
    status: 'resolved'
  },
  {
    id: '8',
    title: 'Insider Threat Indicator',
    description: 'Employee accessing files outside normal scope during unusual hours, potential insider threat.',
    category: 'Insider Threat',
    severity: 'medium',
    date: '2024-01-08T20:10:00Z',
    status: 'investigating'
  }
];

export const dummyStats: ThreatStats = {
  totalThreats: 8,
  threatsBySeverity: {
    low: 0,
    medium: 3,
    high: 3,
    critical: 2
  },
  threatsByCategory: {
    'Network Security': 1,
    'Malware': 1,
    'Authentication': 1,
    'Data Loss Prevention': 1,
    'Social Engineering': 1,
    'Access Control': 1,
    'Web Security': 1,
    'Insider Threat': 1
  },
  latestThreatDate: '2024-01-15T10:30:00Z',
  recentThreats: dummyThreats.slice(0, 5)
};

// API placeholder functions
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3000/api';

export const mockApiCall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};