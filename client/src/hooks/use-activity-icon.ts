
import { Calendar, FileText, ArrowUpRight, Medal } from "lucide-react";

export const useActivityIcon = () => {
  const getActivityIcon = (type: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (type) {
      case 'Event':
        return <Calendar {...iconProps} className="h-4 w-4 text-primary" />;
      case 'Course':
        return <FileText {...iconProps} className="h-4 w-4 text-secondary" />;
      case 'Publication':
        return <ArrowUpRight {...iconProps} className="h-4 w-4 text-accent" />;
      default:
        return <Medal {...iconProps} className="h-4 w-4 text-warning" />;
    }
  };

  return { getActivityIcon };
};
