import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, PlusCircle, ArrowUpRightFromCircle, ListFilter, ArrowUpDown } from "lucide-react";
import { ForumCategory, Discussion } from "@/lib/types";
import DiscussionCard from "@/components/community/forums/discussion-card";
import CreateDiscussionForm from "@/components/community/forums/create-discussion-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ForumsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: categories, isLoading: categoriesLoading } = useQuery<ForumCategory[]>({
    queryKey: ['/api/community/categories'],
  });
  
  const { data: trendingDiscussions, isLoading: trendingLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/community/discussions/trending'],
  });
  
  const { data: recentDiscussions, isLoading: recentLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/community/discussions/recent'],
  });
  
  // Filter and sort discussions
  const filterDiscussions = (discussions: Discussion[] | undefined) => {
    if (!discussions) return [];
    
    let filtered = discussions;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        d => d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             d.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (d.tags && d.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(d => d.forum.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Sort discussions
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime();
        case "popular":
          return b.likes - a.likes;
        case "active":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });
    
    return filtered;
  };
  
  const filteredTrending = filterDiscussions(trendingDiscussions);
  const filteredRecent = filterDiscussions(recentDiscussions);
  
  const handleCreateDiscussion = (data: any) => {
    console.log("Creating discussion:", data);
    setCreateDialogOpen(false);
    // In a real implementation, this would make an API request
  };
  
  return (
    <DashboardLayout title="Community Forums">
      <div className="space-y-6">
        {/* Header with Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Sports Allied Health Community</CardTitle>
                <CardDescription>
                  Connect with peers, share insights, and stay updated with the latest in sports allied health
                </CardDescription>
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <CreateDiscussionForm 
                    onSubmit={handleCreateDiscussion}
                    onCancel={() => setCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search discussions, topics, and tags..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.name.toLowerCase()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="active">Most Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Forums Content */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Discussions</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {recentLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex">
                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRecent && filteredRecent.length > 0 ? (
              <div className="space-y-4">
                {filteredRecent.map(discussion => (
                  <DiscussionCard 
                    key={discussion.id} 
                    discussion={discussion}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search filters"
                    : "Be the first to start a discussion in this forum"
                  }
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Discussion
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-6">
            {trendingLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex">
                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTrending && filteredTrending.length > 0 ? (
              <div className="space-y-4">
                {filteredTrending.map(discussion => (
                  <DiscussionCard 
                    key={discussion.id} 
                    discussion={discussion}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No trending discussions match your filters</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bookmarked" className="space-y-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold mb-2">No bookmarked discussions</h3>
              <p className="text-muted-foreground mb-4">
                Save discussions to find them here later
              </p>
              <Button variant="outline" asChild>
                <a href="#all">
                  Browse All Discussions
                </a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="my-posts" className="space-y-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold mb-2">You haven't posted yet</h3>
              <p className="text-muted-foreground mb-6">
                Share your knowledge and questions with the community
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Post
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ForumsPage;