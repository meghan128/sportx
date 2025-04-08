import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOnboardingTour } from "@/hooks/use-onboarding-tour";

interface TourButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function TourButton({ 
  className = "", 
  variant = "ghost", 
  size = "icon" 
}: TourButtonProps) {
  const { startTour } = useOnboardingTour();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className={className}
            onClick={startTour}
            aria-label="Start platform tour"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Take a guided tour</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}