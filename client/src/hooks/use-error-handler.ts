
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: Error | ErrorInfo, context?: string) => {
    // Log error for debugging
    console.error('Error occurred:', error, context ? `Context: ${context}` : '');

    // Determine error message
    const message = error instanceof Error ? error.message : error.message;
    
    // Show user-friendly toast
    toast({
      title: 'Error',
      description: getUserFriendlyMessage(message),
      variant: 'destructive',
    });

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      reportError(error, context);
    }
  }, [toast]);

  const handleApiError = useCallback((error: any, operation?: string) => {
    const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
    const status = error?.response?.status;
    
    console.error('API Error:', { error, operation, status });
    
    let userMessage = message;
    
    // Map specific status codes to user-friendly messages
    if (status === 401) {
      userMessage = 'Please log in to continue';
    } else if (status === 403) {
      userMessage = 'You do not have permission to perform this action';
    } else if (status === 404) {
      userMessage = 'The requested resource was not found';
    } else if (status >= 500) {
      userMessage = 'Server error. Please try again later';
    }
    
    toast({
      title: operation ? `Failed to ${operation}` : 'Error',
      description: userMessage,
      variant: 'destructive',
    });
  }, [toast]);

  return { handleError, handleApiError };
}

function getUserFriendlyMessage(message: string): string {
  // Map technical errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    'Network Error': 'Please check your internet connection',
    'Failed to fetch': 'Unable to connect to server. Please try again',
    'Unauthorized': 'Please log in to continue',
    'Forbidden': 'You do not have permission to perform this action',
    'Not Found': 'The requested resource was not found',
    'Internal Server Error': 'Server error. Please try again later',
  };

  return errorMappings[message] || 'An unexpected error occurred. Please try again';
}

function reportError(error: Error | ErrorInfo, context?: string) {
  // Implement error reporting to external service
  // Example: Sentry, LogRocket, etc.
  try {
    // Send error to monitoring service
    console.log('Reporting error to monitoring service:', { error, context });
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
}
