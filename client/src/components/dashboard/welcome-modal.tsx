import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOnboardingTour } from "@/hooks/use-onboarding-tour";

interface WelcomeModalProps {
  userName?: string;
}

export function WelcomeModal({ userName }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { startTour, hasSeenTour } = useOnboardingTour();

  useEffect(() => {
    // Check if it's user's first visit
    const hasVisited = localStorage.getItem('sportx_first_visit');
    
    if (!hasVisited) {
      // Show the modal only if user hasn't visited before
      setIsOpen(true);
      // Mark first visit
      localStorage.setItem('sportx_first_visit', 'true');
    }
  }, []);

  const handleStartTour = () => {
    setIsOpen(false);
    // Small delay to ensure the modal is closed before starting the tour
    setTimeout(() => {
      startTour();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to SportX India CPD Platform{userName ? `, ${userName.split(' ')[0]}` : ''}!</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Your all-in-one platform for continuing professional development in sports and allied health professions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-3">
          <p>Here's what you can do on the platform:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Track your CPD credits across different accreditation bodies</li>
            <li>Discover and register for industry events and webinars</li>
            <li>Access specialized courses for your professional growth</li>
            <li>Connect with peers and find mentorship opportunities</li>
            <li>Access the resource library for research papers and tools</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            Would you like a quick guided tour to help you get started?
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="sm:flex-1"
          >
            Skip for now
          </Button>
          <Button 
            onClick={handleStartTour}
            className="sm:flex-1"
          >
            Take the tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}