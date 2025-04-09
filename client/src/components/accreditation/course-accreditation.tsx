import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AccreditationBadge, AccreditationBody } from "./accreditation-badge";
import { CheckCircle, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseAccreditationProps {
  accreditedBy: AccreditationBody | string;
  cpdPoints: number;
  validUntil?: string;
  learningOutcomes?: string[];
  showAdditionalInfo?: boolean;
}

export const CourseAccreditation = ({
  accreditedBy,
  cpdPoints,
  validUntil,
  learningOutcomes,
  showAdditionalInfo = true
}: CourseAccreditationProps) => {
  // Handle non-standard accreditation bodies
  const accreditationBody = Object.values(
    ["CSP", "BASES", "HCPC", "ACSM", "ISSN", "NSCA"]
  ).includes(accreditedBy) 
    ? accreditedBy as AccreditationBody 
    : "Other";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          Accredited Course
        </CardTitle>
        <CardDescription>
          This course is officially recognized for Continuing Professional Development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <AccreditationBadge 
            body={accreditationBody} 
            points={cpdPoints}
            expiryDate={validUntil}
            size="lg"
          />
        </div>
        
        {showAdditionalInfo && (
          <>
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Accreditation Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accredited by</span>
                  <span className="font-medium">{accreditedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPD Points</span>
                  <span className="font-medium">{cpdPoints}</span>
                </div>
                {validUntil && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid until</span>
                    <span className="font-medium">{validUntil}</span>
                  </div>
                )}
              </div>
            </div>
            
            {learningOutcomes && learningOutcomes.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Learning Outcomes</h4>
                <ul className="space-y-1 text-sm">
                  {learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col pt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on {accreditedBy}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View accreditation details on the {accreditedBy} website</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="mt-4 flex items-start bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-xs">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <p>
                  Upon completion, this course's CPD points will be automatically added to your 
                  professional record if you have connected your {accreditedBy} account.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseAccreditation;