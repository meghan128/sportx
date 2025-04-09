import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Clock, AlertCircle, HelpCircle } from "lucide-react";

export type AccreditationBody = 
  | "CSP" // Chartered Society of Physiotherapy
  | "BASES" // British Association of Sport and Exercise Sciences
  | "HCPC" // Health and Care Professions Council
  | "ACSM" // American College of Sports Medicine
  | "ISSN" // International Society of Sports Nutrition
  | "NSCA" // National Strength and Conditioning Association
  | "Other";

export type AccreditationStatus = 
  | "approved" 
  | "pending" 
  | "not_approved" 
  | "expired";

interface AccreditationBadgeProps {
  body: AccreditationBody;
  status?: AccreditationStatus;
  points?: number;
  expiryDate?: string;
  size?: "sm" | "md" | "lg";
}

const bodyFullNames: Record<AccreditationBody, string> = {
  "CSP": "Chartered Society of Physiotherapy",
  "BASES": "British Association of Sport and Exercise Sciences",
  "HCPC": "Health and Care Professions Council",
  "ACSM": "American College of Sports Medicine",
  "ISSN": "International Society of Sports Nutrition",
  "NSCA": "National Strength and Conditioning Association",
  "Other": "Other Accreditation Body"
};

const bodyColors: Record<AccreditationBody, string> = {
  "CSP": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "BASES": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "HCPC": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "ACSM": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "ISSN": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "NSCA": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "Other": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
};

const statusIcons: Record<AccreditationStatus, React.ReactNode> = {
  "approved": <CheckCircle className="h-3.5 w-3.5 mr-1" />,
  "pending": <Clock className="h-3.5 w-3.5 mr-1" />,
  "not_approved": <AlertCircle className="h-3.5 w-3.5 mr-1" />,
  "expired": <AlertCircle className="h-3.5 w-3.5 mr-1" />
};

const statusMessages: Record<AccreditationStatus, string> = {
  "approved": "Approved for CPD credits",
  "pending": "Accreditation pending",
  "not_approved": "Not currently approved",
  "expired": "Accreditation expired"
};

export const AccreditationBadge = ({ 
  body, 
  status = "approved", 
  points, 
  expiryDate,
  size = "md" 
}: AccreditationBadgeProps) => {
  const sizeClasses = {
    "sm": "text-xs py-0.5 px-1.5",
    "md": "text-xs py-1 px-2",
    "lg": "text-sm py-1 px-2.5"
  };

  const tooltipContent = (
    <div className="max-w-xs">
      <p className="font-medium">{bodyFullNames[body]}</p>
      <p className="text-sm">{statusMessages[status]}</p>
      {points && <p className="text-sm mt-1">Credits: {points}</p>}
      {expiryDate && status === "approved" && (
        <p className="text-sm mt-1">Valid until: {expiryDate}</p>
      )}
      {status === "expired" && expiryDate && (
        <p className="text-sm mt-1">Expired on: {expiryDate}</p>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline"
            className={`font-medium rounded-md cursor-help ${bodyColors[body]} ${sizeClasses[size]}`}
          >
            {status !== "approved" && statusIcons[status]}
            {body}
            {points && status === "approved" && ` • ${points} pts`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AccreditationBadge;