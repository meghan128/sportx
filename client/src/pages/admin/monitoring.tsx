import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users, Server, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonitoringMetrics {
  totalUsers: number;
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
  uptime: number;
  responseTime: number;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'critical';
  api: 'healthy' | 'warning' | 'critical';
  storage: 'healthy' | 'warning' | 'critical';
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    totalUsers: 1245,
    activeUsers: 89,
    requestsPerMinute: 145,
    errorRate: 0.5,
    uptime: 99.9,
    responseTime: 120
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy'
  });

  const [performanceData] = useState([
    { time: '00:00', responseTime: 120, requests: 45 },
    { time: '06:00', responseTime: 110, requests: 67 },
    { time: '12:00', responseTime: 145, requests: 89 },
    { time: '18:00', responseTime: 125, requests: 156 },
    { time: '24:00', responseTime: 115, requests: 134 }
  ]);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <Badge variant="outline" className="text-green-600">
          All Systems Operational
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              of {metrics.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests/Min</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.requestsPerMinute}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              99.9% SLA target
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(systemHealth).map(([component, status]) => (
                  <div key={component} className="flex items-center space-x-2">
                    <div className={getHealthColor(status)}>
                      {getHealthIcon(status)}
                    </div>
                    <span className="capitalize font-medium">{component}</span>
                    <Badge variant={status === 'healthy' ? 'default' : 'destructive'}>
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Response time and request volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Response Time (ms)"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Requests/Min"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed performance analytics and optimizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Bundle Size Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Total bundle size: 250KB (gzipped)<br />
                      Compression ratio: 75%<br />
                      Lazy loading: Enabled
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Core Web Vitals</h4>
                    <p className="text-sm text-muted-foreground">
                      LCP: 1.2s (Good)<br />
                      FID: 45ms (Good)<br />
                      CLS: 0.1 (Good)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Rate limiting, authentication, and security measures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Active rate limits and current usage
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>API Requests:</span>
                        <span>145/1000 per 15min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auth Attempts:</span>
                        <span>2/5 per 15min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>File Uploads:</span>
                        <span>8/50 per hour</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Security Headers</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Helmet.js security headers enabled
                    </p>
                    <div className="space-y-1">
                      <Badge variant="outline">CSP Enabled</Badge>
                      <Badge variant="outline">HSTS Active</Badge>
                      <Badge variant="outline">XSS Protection</Badge>
                      <Badge variant="outline">Secure Cookies</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Logs</CardTitle>
              <CardDescription>System logs and error tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                  <span className="text-green-600">[INFO]</span> 2025-07-20 14:55:01 - User authentication successful
                </div>
                <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                  <span className="text-blue-600">[HTTP]</span> 2025-07-20 14:55:01 - GET /api/events/upcoming 200 in 15ms
                </div>
                <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                  <span className="text-blue-600">[HTTP]</span> 2025-07-20 14:55:01 - GET /api/courses/recommended 200 in 23ms
                </div>
                <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                  <span className="text-green-600">[INFO]</span> 2025-07-20 14:54:59 - Database connection healthy
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MonitoringDashboard;