
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  showDetails?: boolean;
}

export function ErrorFallback({ error, resetError, showDetails = false }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl">Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
          
          {showDetails && process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium mb-2">
                Technical Details
              </summary>
              <div className="space-y-2">
                <div>
                  <strong>Error:</strong> {error.message}
                </div>
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1 text-xs overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
              </div>
            </details>
          )}
          
          <div className="flex flex-col gap-2">
            <Button onClick={resetError} className="w-full">
              Try Again
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleGoHome} variant="outline" className="flex-1">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              <Button onClick={handleReload} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
