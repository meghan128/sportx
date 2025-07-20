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
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  User,
  Calendar,
  Download,
  Star,
  AlertCircle,
  CheckCheck,
  RotateCcw,
  Send
} from "lucide-react";
import { Link } from "wouter";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Submission {
  id: number;
  studentName: string;
  studentEmail: string;
  courseName: string;
  submissionType: 'assignment' | 'quiz' | 'project' | 'final_assessment';
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'needs_revision';
  score?: number;
  maxScore?: number;
  feedback?: string;
  attachments?: string[];
  priority: 'high' | 'medium' | 'low';
}

export default function ResourceSubmissions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'needs_revision'>('approved');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch submissions
  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/resource/submissions/pending'],
  });

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async (data: { submissionId: number; status: string; feedback: string; score?: number }) => {
      const response = await fetch(`/api/resource/submissions/${data.submissionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token-resource',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit review');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resource/submissions/pending'] });
      setReviewDialog(false);
      setSelectedSubmission(null);
      setFeedback("");
      setScore("");
      toast({
        title: "Review submitted",
        description: "Student submission has been reviewed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive",
      });
    },
  });

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submissionType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    const matchesType = typeFilter === "all" || submission.submissionType === typeFilter;
    const matchesPriority = priorityFilter === "all" || submission.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'needs_revision': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'needs_revision': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleReviewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || "");
    setScore(submission.score?.toString() || "");
    setReviewStatus(submission.status === 'needs_revision' ? 'needs_revision' : 'approved');
    setReviewDialog(true);
  };

  const handleSubmitReview = () => {
    if (!selectedSubmission) return;

    submitReview.mutate({
      submissionId: selectedSubmission.id,
      status: reviewStatus,
      feedback,
      score: score ? parseInt(score) : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <ResourceSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading submissions...</p>
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
              <h1 className="text-2xl font-bold">Student Submissions</h1>
              <p className="text-muted-foreground">Review and provide feedback on student work</p>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary">
                {filteredSubmissions.filter(s => s.status === 'pending').length} Pending Review
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, course, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="needs_revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="final_assessment">Final Assessment</SelectItem>
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
          {filteredSubmissions.length > 0 ? (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{submission.courseName}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {submission.submissionType.replace('_', ' ')} Submission
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-white ${getStatusColor(submission.status)}`}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1 capitalize">{submission.status.replace('_', ' ')}</span>
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(submission.priority)}>
                              {submission.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {submission.studentName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(submission.submittedAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                          {submission.score && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {submission.score}/{submission.maxScore}
                            </div>
                          )}
                        </div>

                        {submission.feedback && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">
                              <strong>Previous Feedback:</strong> {submission.feedback}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        {submission.attachments && submission.attachments.length > 0 && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
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
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters to see more submissions"
                  : "No student submissions available at the moment"
                }
              </p>
            </Card>
          )}
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Submission</DialogTitle>
              <DialogDescription>
                Provide feedback and grade for {selectedSubmission?.studentName}'s submission
              </DialogDescription>
            </DialogHeader>

            {selectedSubmission && (
              <div className="space-y-6">
                {/* Submission Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Student</Label>
                    <p>{selectedSubmission.studentName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Course</Label>
                    <p>{selectedSubmission.courseName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="capitalize">{selectedSubmission.submissionType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submitted</Label>
                    <p>{format(new Date(selectedSubmission.submittedAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>

                {/* Review Status */}
                <div className="space-y-2">
                  <Label>Review Status</Label>
                  <Select value={reviewStatus} onValueChange={(value: 'approved' | 'needs_revision') => setReviewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="needs_revision">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="h-4 w-4 text-red-600" />
                          Needs Revision
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Score (if applicable) */}
                {selectedSubmission.maxScore && (
                  <div className="space-y-2">
                    <Label>Score (out of {selectedSubmission.maxScore})</Label>
                    <Input
                      type="number"
                      min="0"
                      max={selectedSubmission.maxScore}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder={`Enter score (0-${selectedSubmission.maxScore})`}
                    />
                  </div>
                )}

                {/* Feedback */}
                <div className="space-y-2">
                  <Label>Feedback</Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide detailed feedback for the student..."
                    rows={6}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setReviewDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={submitReview.isPending || !feedback.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
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