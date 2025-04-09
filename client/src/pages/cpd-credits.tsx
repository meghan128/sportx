import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { CpdSummary, CpdActivity } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  Download,
  FileText,
  Filter,
  Medal,
  PieChart,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const CpdCredits = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("2023");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: cpdSummary, isLoading: summaryLoading } = useQuery<CpdSummary>({
    queryKey: ['/api/cpd/summary'],
  });

  const { data: cpdActivities, isLoading: activitiesLoading } = useQuery<CpdActivity[]>({
    queryKey: ['/api/cpd/activities', yearFilter, categoryFilter, searchQuery],
  });

  const downloadCpdReport = () => {
    // This would trigger a report download
    window.open('/api/cpd/reports/download', '_blank');
  };

  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return (
    <DashboardLayout title="CPD Credits">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total CPD Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  `${cpdSummary?.currentPoints || 0}/${cpdSummary?.requiredPoints || 0}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{cpdSummary?.period || 'Current Period'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Events Attended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  "5"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last 12 months</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  "3"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last 12 months</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Certificates Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  "8"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>
        
        {/* CPD Analytics & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>CPD Distribution</CardTitle>
              <CardDescription>Points by category</CardDescription>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <div className="h-64 w-full bg-gray-100 animate-pulse rounded flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-gray-300" />
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cpdSummary?.categories || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 'dataMax + 2']} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} points`, 'Earned']}
                        labelFormatter={(value) => `Category: ${value}`}
                      />
                      <Bar dataKey="earnedPoints" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                        {cpdSummary?.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="space-y-2 mt-4">
                {summaryLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  cpdSummary?.categories.map((category, index) => (
                    <div key={category.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        ></div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {category.earnedPoints}/{category.requiredPoints}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>CPD Activities</CardTitle>
                  <CardDescription>All your CPD credit sources</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/accreditation">
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Manage Accreditations
                    </Link>
                  </Button>
                  <Button onClick={downloadCpdReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Activities</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search activities..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="clinical">Clinical Skills</SelectItem>
                      <SelectItem value="research">Research & Publication</SelectItem>
                      <SelectItem value="development">Professional Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {activitiesLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cpdActivities && cpdActivities.length > 0 ? (
                        cpdActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {getActivityIcon(activity.type)}
                                <span className="ml-2">{activity.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(activity.date)}</TableCell>
                            <TableCell>{activity.category}</TableCell>
                            <TableCell className="text-right font-medium">{activity.points}</TableCell>
                            <TableCell>
                              {activity.certificateUrl && (
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No activities found matching your filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper functions
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'Event':
      return <Calendar className="h-4 w-4 text-primary" />;
    case 'Course':
      return <FileText className="h-4 w-4 text-secondary" />;
    case 'Publication':
      return <ArrowUpRight className="h-4 w-4 text-accent" />;
    default:
      return <Medal className="h-4 w-4 text-warning" />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric',
    month: 'short', 
    year: 'numeric' 
  });
};

export default CpdCredits;
