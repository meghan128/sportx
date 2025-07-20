
import { useState } from "react";
import { useToast } from "./use-toast";

export interface AsyncToastOptions {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  duration?: number;
}

export function useAsyncToast() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const executeWithToast = async <T>(
    asyncFn: () => Promise<T>,
    options: AsyncToastOptions = {}
  ): Promise<T | null> => {
    const {
      loadingMessage = "Processing...",
      successMessage = "Operation completed successfully",
      errorMessage = "An error occurred",
      duration = 5000
    } = options;

    setIsLoading(true);

    // Show loading toast
    const loadingToast = toast({
      title: loadingMessage,
      description: "Please wait...",
      duration: 0, // Keep it open until we dismiss it
    });

    try {
      const result = await asyncFn();
      
      // Dismiss loading toast
      loadingToast.dismiss();
      
      // Show success toast
      toast({
        title: "Success",
        description: successMessage,
        duration,
        variant: "default",
      });

      setIsLoading(false);
      return result;
    } catch (error) {
      // Dismiss loading toast
      loadingToast.dismiss();
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : errorMessage,
        duration,
        variant: "destructive",
      });

      setIsLoading(false);
      return null;
    }
  };

  const showSuccess = (message: string, title: string = "Success") => {
    toast({
      title,
      description: message,
      variant: "default",
    });
  };

  const showError = (message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  };

  const showInfo = (message: string, title: string = "Info") => {
    toast({
      title,
      description: message,
      variant: "default",
    });
  };

  return {
    executeWithToast,
    showSuccess,
    showError,
    showInfo,
    isLoading,
  };
}
