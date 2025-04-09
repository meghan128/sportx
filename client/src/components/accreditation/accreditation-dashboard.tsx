import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AccreditationBadge, AccreditationBody, AccreditationStatus } from "./accreditation-badge";
import ConnectAccountForm from "./connect-account-form";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  Link2, 
  PlusCircle, 
  RefreshCw, 
  Settings, 
  Trash2, 
  Unlink
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ConnectedAccount {
  id: string;
  body: AccreditationBody;
  membershipId: string;
  status: AccreditationStatus;
  lastSynced: string;
  totalCredits: number;
  pendingCredits: number;
}

export const AccreditationDashboard = () => {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  
  // Query for fetching connected accounts
  const { data: connectedAccounts, isLoading, refetch } = useQuery<ConnectedAccount[]>({
    queryKey: ['/api/accreditation/accounts'],
    // This would be replaced with the actual API call in a real implementation
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: "1",
          body: "CSP",
          membershipId: "CSP12345",
          status: "approved",
          lastSynced: "2 hours ago",
          totalCredits: 24,
          pendingCredits: 3
        },
        {
          id: "2",
          body: "BASES",
          membershipId: "B98765",
          status: "pending",
          lastSynced: "1 day ago",
          totalCredits: 12,
          pendingCredits: 6
        }
      ];
    }
  });
  
  // Query for fetching recent activities
  const { data: recentActivities } = useQuery({
    queryKey: ['/api/accreditation/activities'],
    // This would be replaced with the actual API call in a real implementation
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: "1",
          body: "CSP",
          activity: "Course completion: Advanced Rehabilitation Techniques",
          points: 3,
          status: "approved",
          date: "2023-05-12"
        },
        {
          id: "2",
          body: "CSP",
          activity: "Workshop attendance: Knee Injury Assessment",
          points: 2,
          status: "pending",
          date: "2023-05-10"
        },
        {
          id: "3",
          body: "BASES",
          activity: "Webinar: Performance Analytics in Team Sports",
          points: 1,
          status: "approved",
          date: "2023-05-05"
        }
      ];
    }
  });
  
  const handleConnectAccount = async (data: any) => {
    console.log("Connecting account:", data);
    // This would be an API call in a real implementation
    await new Promise(resolve => setTimeout(resolve, 1500));
    refetch();
    setIsConnectOpen(false);
  };
  
  const handleSyncAccount = async (accountId: string) => {
    console.log("Syncing account:", accountId);
    // This would be an API call in a real implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    refetch();
  };
  
  const handleDisconnectAccount = async (accountId: string) => {
    console.log("Disconnecting account:", accountId);
    // This would be an API call in a real implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    refetch();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Professional Accreditation</h2>
          <p className="text-muted-foreground">
            Manage your professional body connections and CPD credit synchronization
          </p>
        </div>
        
        <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <ConnectAccountForm 
              onConnect={handleConnectAccount}
              onCancel={() => setIsConnectOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Connected Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Your linked professional body accounts for automatic CPD credit tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-muted-foreground">Loading accounts...</p>
            </div>
          ) : connectedAccounts && connectedAccounts.length > 0 ? (
            <div className="space-y-4">
              {connectedAccounts.map(account => (
                <Card key={account.id} className="bg-muted/40">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start md:items-center gap-3">
                        <div className="rounded-full p-2 bg-primary/10">
                          <Link2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{account.body}</h3>
                            <AccreditationBadge 
                              body={account.body}
                              status={account.status}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">ID: {account.membershipId}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="px-2 py-1 rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {account.totalCredits} credits
                          </span>
                          {account.pendingCredits > 0 && (
                            <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              {account.pendingCredits} pending
                            </span>
                          )}
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSyncAccount(account.id)}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Sync
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Last synced: {account.lastSynced}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on {account.body}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Account Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDisconnectAccount(account.id)}
                            >
                              <Unlink className="h-4 w-4 mr-2" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="rounded-full bg-muted p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Link2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No accounts connected</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Connect your professional body accounts to automatically track and submit your CPD activities for accreditation.
              </p>
              <Button onClick={() => setIsConnectOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Connect Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Activities Section */}
      {(connectedAccounts && connectedAccounts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Recent CPD Activities</CardTitle>
            <CardDescription>
              Your recent CPD activities and their submission status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Body</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities?.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.date}</TableCell>
                    <TableCell>{activity.activity}</TableCell>
                    <TableCell>
                      <AccreditationBadge body={activity.body as AccreditationBody} size="sm" />
                    </TableCell>
                    <TableCell>{activity.points}</TableCell>
                    <TableCell>
                      {activity.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" /> Approved
                        </Badge>
                      ) : activity.status === "pending" ? (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          <AlertCircle className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          <AlertCircle className="mr-1 h-3 w-3" /> Rejected
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="ml-auto" asChild>
              <a href="/cpd-credits">View All CPD Activities</a>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Information & Help Section */}
      <Alert>
        <AlertTitle>About Professional Accreditation Integration</AlertTitle>
        <AlertDescription>
          Book My Workshop integrates with leading professional bodies to make tracking your CPD 
          easy. Connected accounts automatically sync your completed courses and attended events 
          to your professional body's CPD record system. Please note that some accreditation bodies 
          may require additional verification steps.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AccreditationDashboard;