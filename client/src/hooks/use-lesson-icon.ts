
import { 
  Play, 
  FileText, 
  ChevronRight, 
  Download, 
  BookOpen, 
  Zap, 
  Users, 
  Layers, 
  MessageCircle 
} from "lucide-react";

export const useLessonIcon = () => {
  const getLessonIcon = (type: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (type) {
      case 'video':
        return <Play {...iconProps} className="h-4 w-4 text-primary" />;
      case 'text':
        return <FileText {...iconProps} className="h-4 w-4 text-primary" />;
      case 'quiz':
        return <ChevronRight {...iconProps} className="h-4 w-4 text-primary" />;
      case 'download':
        return <Download {...iconProps} className="h-4 w-4 text-primary" />;
      case 'interactive':
        return <Zap {...iconProps} className="h-4 w-4 text-purple-600" />;
      case 'case_study':
        return <Users {...iconProps} className="h-4 w-4 text-blue-600" />;
      case 'simulation':
        return <Layers {...iconProps} className="h-4 w-4 text-orange-600" />;
      case 'reflective':
        return <BookOpen {...iconProps} className="h-4 w-4 text-teal-600" />;
      case 'discussion':
        return <MessageCircle {...iconProps} className="h-4 w-4 text-indigo-600" />;
      default:
        return <BookOpen {...iconProps} className="h-4 w-4 text-primary" />;
    }
  };

  return { getLessonIcon };
};
