import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Cloud, 
  Server, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Zap,
  Shield,
  Users,
  BarChart3
} from "lucide-react";

const StorageStatus = () => {
  const [storageType, setStorageType] = useState<'memory' | 'supabase' | 'loading'>('loading');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    // Check storage type by making a test API call
    fetch('/api/storage/status')
      .then(res => res.json())
      .then(data => {
        setStorageType(data.type || 'memory');
        setConnectionStatus(data.connected ? 'connected' : 'disconnected');
      })
      .catch(() => {
        setStorageType('memory');
        setConnectionStatus('disconnected');
      });
  }, []);

  const getStorageIcon = () => {
    switch (storageType) {
      case 'supabase':
        return <Cloud className="h-6 w-6 text-blue-500" />;
      case 'memory':
        return <Server className="h-6 w-6 text-orange-500" />;
      default:
        return <Database className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500 animate-spin" />;
    }
  };

  const getStorageLabel = () => {
    switch (storageType) {
      case 'supabase':
        return 'Supabase Database';
      case 'memory':
        return 'In-Memory Storage';
      default:
        return 'Checking...';
    }
  };

  const features = {
    memory: [
      { icon: <Server className="h-4 w-4" />, label: 'Local Development', available: true },
      { icon: <Zap className="h-4 w-4" />, label: 'Fast Performance', available: true },
      { icon: <Database className="h-4 w-4" />, label: 'Data Persistence', available: false },
      { icon: <Users className="h-4 w-4" />, label: 'Multi-User Support', available: false },
      { icon: <Shield className="h-4 w-4" />, label: 'Real-time Updates', available: false },
      { icon: <BarChart3 className="h-4 w-4" />, label: 'Analytics', available: false }
    ],
    supabase: [
      { icon: <Database className="h-4 w-4" />, label: 'Data Persistence', available: true },
      { icon: <Users className="h-4 w-4" />, label: 'Multi-User Support', available: true },
      { icon: <Shield className="h-4 w-4" />, label: 'Real-time Updates', available: true },
      { icon: <BarChart3 className="h-4 w-4" />, label: 'Analytics', available: true },
      { icon: <Cloud className="h-4 w-4" />, label: 'Cloud Backup', available: true },
      { icon: <Zap className="h-4 w-4" />, label: 'Edge Performance', available: true }
    ]
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStorageIcon()}
            <div>
              <CardTitle className="text-lg">{getStorageLabel()}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon()}
                <span className="text-sm text-gray-600">
                  {connectionStatus === 'connected' ? 'Connected' : 
                   connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
                </span>
              </div>
            </div>
          </div>
          <Badge 
            variant={storageType === 'supabase' ? 'default' : 'secondary'}
            className={storageType === 'supabase' ? 'bg-green-500' : ''}
          >
            {storageType === 'supabase' ? 'Production Ready' : 'Development Mode'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {features[storageType]?.map((feature, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                feature.available 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              <span className={feature.available ? 'text-green-600' : 'text-gray-400'}>
                {feature.icon}
              </span>
              <span className="text-sm font-medium">{feature.label}</span>
              {feature.available ? (
                <CheckCircle className="h-3 w-3 text-green-600 ml-auto" />
              ) : (
                <div className="w-3 h-3 ml-auto"></div>
              )}
            </div>
          ))}
        </div>

        {storageType === 'memory' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Upgrade to Supabase</h4>
                <p className="text-sm text-amber-700 mb-3">
                  Get real-time features, data persistence, and production-ready scalability.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => window.open('https://supabase.com', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Setup Supabase
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/supabase-setup-guide.md', '_blank')}
                  >
                    View Guide
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {storageType === 'supabase' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Supabase Connected</h4>
                <p className="text-sm text-green-700">
                  Your platform is running on production-ready infrastructure with real-time capabilities.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StorageStatus;