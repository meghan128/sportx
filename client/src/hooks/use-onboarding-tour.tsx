import { useState, useEffect } from 'react';
import { driver, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// Define tour steps
const dashboardTourSteps = [
  {
    element: '#welcome-section',
    popover: {
      title: 'Welcome to SportX India',
      description: 'This is your personalized dashboard. Get an overview of your CPD progress and access quick actions.',
      side: 'bottom',
      align: 'start',
    }
  },
  {
    element: '#cpd-tracker',
    popover: {
      title: 'CPD Credit Tracker',
      description: 'Monitor your continuing professional development progress. Track points across different categories for your professional accreditation.',
      side: 'left',
    }
  },
  {
    element: '#upcoming-events',
    popover: {
      title: 'Upcoming Events',
      description: 'Discover workshops, conferences and webinars relevant to your profession. Filter by type and category to find the perfect professional development opportunity.',
      side: 'top',
    }
  },
  {
    element: '#course-progress',
    popover: {
      title: 'Course Progress',
      description: 'Continue learning with your enrolled courses. Track your progress and pick up where you left off.',
      side: 'top',
    }
  },
  {
    element: '#community-section',
    popover: {
      title: 'Community Connections',
      description: 'Engage with other professionals in your field. Join discussions and find mentorship opportunities.',
      side: 'top',
    }
  },
  {
    element: '#main-sidebar',
    popover: {
      title: 'Navigation Menu',
      description: 'Easily navigate to different sections of the platform including Events, Courses, CPD Credits and Resources.',
      side: 'right',
    }
  }
];

export function useOnboardingTour() {
  const [driverObj, setDriverObj] = useState<any>(null);
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(false);

  // Initialize driver on component mount
  useEffect(() => {
    // Check if user has already seen the tour
    const tourSeen = localStorage.getItem('sportx_tour_completed');
    setHasSeenTour(!!tourSeen);

    // Create driver instance
    const driverInstance = driver({
      showProgress: true,
      showButtons: ['close', 'next', 'previous'],
      steps: dashboardTourSteps as any,
      onDestroyStarted: () => {
        if (window.confirm('Are you sure you want to exit the tour?')) {
          // Mark tour as completed even if user exits early
          localStorage.setItem('sportx_tour_completed', 'true');
          return true; // Allow destroy
        }
        return false; // Prevent destroy
      },
      onDestroyed: () => {
        // Mark tour as completed when user finishes or exits
        localStorage.setItem('sportx_tour_completed', 'true');
        setHasSeenTour(true);
      }
    });

    setDriverObj(driverInstance);

    return () => {
      // Clean up
      if (driverInstance) {
        driverInstance.destroy();
      }
    };
  }, []);

  // Function to start the tour
  const startTour = () => {
    if (driverObj) {
      driverObj.drive();
    }
  };

  // Function to reset tour (for testing or if user wants to see it again)
  const resetTour = () => {
    localStorage.removeItem('sportx_tour_completed');
    setHasSeenTour(false);
  };

  return { startTour, resetTour, hasSeenTour };
}