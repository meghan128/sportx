import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  User,
  Calendar,
  FileText,
  Award,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Send,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Approval {
  id: number;
  type: 'course_publication' | 'cpd_credit_application' | 'workshop_approval' | 'certification_request';
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'needs_clarification';
  priority: 'high' | 'medium' | 'low';
  reviewComments?: string;
  attachments?: string[];
  metadata?: {
    cpdPoints?: number;
    duration?: string;
    category?: string;
    targetAudience?: string;
  };
}

export default function ResourceApprovals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [comments, setComments] = useState("");
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'clarification'>('approve');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch approvals
  const { data: approvals = [], isLoading } = useQuery<Approval[]>({
    queryKey: ['/api/resource/approvals/pending'],
  });

  // Submit approval action mutation
  const submitApprovalAction = useMutation({
    mutationFn: async (data: { approvalId: number; action: string; comments: string }) => {
      const response = await fetch(`/api/resource/approvals/${data.approvalId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token-resource',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit approval action');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/resource/approvals/pending'] });
      setReviewDialog(false);
      setSelectedApproval(null);
      setComments("");
      toast({
        title: `${data.action === 'approve' ? 'Approved' : data.action === 'reject' ? 'Rejected' : 'Clarification requested'}`,
        description: `Approval request has been ${data.action}d successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit approval action.",
        variant: "destructive",
      });
    },
  });

  // Filter approvals
  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = 
      approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || approval.status === statusFilter;
    const matchesType = typeFilter === "all" || approval.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || approval.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'needs_clarification': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'needs_clarification': return <MessageSquare className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course_publication': return <FileText className="h-4 w-4" />;
      case 'cpd_credit_application': return <Award className="h-4 w-4" />;
      case 'workshop_approval': return <Calendar className="h-4 w-4" />;
      case 'certification_request': return <CheckSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleReviewApproval = (approval: Approval) => {
    setSelectedApproval(approval);
    setComments(approval.reviewComments || "");
    setReviewAction('approve');
    setReviewDialog(true);
  };

  const handleSubmitReview = () => {
    if (!selectedApproval) return;

    submitApprovalAction.mutate({
      approvalId: selectedApproval.id,
      action: reviewAction,
      comments,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <ResourceSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading approval requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <ResourceSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Approval Requests</h1>
              <p className="text-muted-foreground">Review and approve content and CPD requests</p>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary">
                {filteredApprovals.filter(a => a.status === 'pending_review').length} Pending Review
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or submitter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="needs_clarification">Needs Clarification</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course_publication">Course Publication</SelectItem>
                <SelectItem value="cpd_credit_application">CPD Credit Application</SelectItem>
                <SelectItem value="workshop_approval">Workshop Approval</SelectItem>
                <SelectItem value="certification_request">Certification Request</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredApprovals.length > 0 ? (
            <div className="space-y-4">
              {filteredApprovals.map((approval) => (
                <Card key={approval.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(approval.type)}
                              <h3 className="font-semibold text-lg">{approval.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatType(approval.type)}
                            </p>
                            <p className="text-sm">{approval.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-white ${getStatusColor(approval.status)}`}>
                              {getStatusIcon(approval.status)}
                              <span className="ml-1 capitalize">{approval.status.replace('_', ' ')}</span>
                            </Badge>
                            <Badge className={`border ${getPriorityColor(approval.priority)}`}>
                              {approval.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Metadata */}
                        {approval.metadata && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {approval.metadata.cpdPoints && (
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                {approval.metadata.cpdPoints} CPD Points
                              </div>
                            )}
                            {approval.metadata.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {approval.metadata.duration}
                              </div>
                            )}
                            {approval.metadata.category && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {approval.metadata.category}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {approval.submittedBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(approval.submittedAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </div>

                        {approval.reviewComments && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">
                              <strong>Previous Comments:</strong> {approval.reviewComments}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        {approval.status === 'pending_review' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReviewApproval(approval)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </>
                        )}
                        {approval.attachments && approval.attachments.length > 0 && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Attachments
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No approval requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters to see more requests"
                  : "No approval requests available at the moment"
                }
              </p>
            </Card>
          )}
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Approval Request</DialogTitle>
              <DialogDescription>
                Review and take action on "{selectedApproval?.title}"
              </DialogDescription>
            </DialogHeader>

            {selectedApproval && (
              <div className="space-y-6">
                {/* Request Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p>{formatType(selectedApproval.type)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submitted By</Label>
                    <p>{selectedApproval.submittedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <p className="capitalize">{selectedApproval.priority}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submitted</Label>
                    <p>{format(new Date(selectedApproval.submittedAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedApproval.description}</p>
                  </div>
                </div>

                {/* Metadata */}
                {selectedApproval.metadata && (
                  <div className="space-y-2">
                    <Label>Additional Details</Label>
                    <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                      {selectedApproval.metadata.cpdPoints && (
                        <div>
                          <Label className="text-xs">CPD Points</Label>
                          <p className="text-sm">{selectedApproval.metadata.cpdPoints}</p>
                        </div>
                      )}
                      {selectedApproval.metadata.duration && (
                        <div>
                          <Label className="text-xs">Duration</Label>
                          <p className="text-sm">{selectedApproval.metadata.duration}</p>
                        </div>
                      )}
                      {selectedApproval.metadata.category && (
                        <div>
                          <Label className="text-xs">Category</Label>
                          <p className="text-sm">{selectedApproval.metadata.category}</p>
                        </div>
                      )}
                      {selectedApproval.metadata.targetAudience && (
                        <div>
                          <Label className="text-xs">Target Audience</Label>
                          <p className="text-sm">{selectedApproval.metadata.targetAudience}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Action */}
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={reviewAction} onValueChange={(value: 'approve' | 'reject' | 'clarification') => setReviewAction(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          Approve
                        </div>
                      </SelectItem>
                      <SelectItem value="reject">
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                          Reject
                        </div>
                      </SelectItem>
                      <SelectItem value="clarification">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          Request Clarification
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <Label>Comments</Label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={
                      reviewAction === 'approve' 
                        ? "Add any approval comments or conditions..."
                        : reviewAction === 'reject'
                        ? "Explain the reasons for rejection..."
                        : "Specify what clarification is needed..."
                    }
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setReviewDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={submitApprovalAction.isPending || !comments.trim()}
                    className={
                      reviewAction === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700'
                        : reviewAction === 'reject'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitApprovalAction.isPending ? 'Processing...' : 
                     reviewAction === 'approve' ? 'Approve Request' :
                     reviewAction === 'reject' ? 'Reject Request' : 'Request Clarification'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}