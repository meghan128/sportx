import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Discussion, ForumCategory, MentorshipOpportunity } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, PlusCircle, Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const Community = () => {
  const { data: forumCategories, isLoading: categoriesLoading } = useQuery<ForumCategory[]>({
    queryKey: ['/api/community/categories'],
  });

  const { data: discussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/community/discussions/trending'],
  });

  const { data: mentorships, isLoading: mentorshipsLoading } = useQuery<MentorshipOpportunity[]>({
    queryKey: ['/api/community/mentorships'],
  });

  return (
    <DashboardLayout title="Community">
      <div className="space-y-6">
        {/* Forum Header with Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Professional Community</CardTitle>
                <CardDescription>
                  Connect with peers, share knowledge, and find mentorship opportunities
                </CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Discussion
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search discussions, mentors, and topics..."
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <Tabs defaultValue="forums">
          <TabsList className="mb-6">
            <TabsTrigger value="forums">Forums</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="myactivity">My Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forums">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Forum Categories */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Forum Categories</h3>
                <div className="space-y-3">
                  {categoriesLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                          <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    forumCategories?.map((category) => (
                      <Link href={`/community/forums/${category.id}`} key={category.id}>
                        <a className="block">
                          <Card className="hover:border-primary transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="mt-1 rounded-full bg-primary bg-opacity-10 p-2 text-primary">
                                  {getCategoryIcon(category.icon)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{category.name}</h4>
                                  <p className="text-sm text-muted-foreground">{category.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>{category.topics} topics</span>
                                    <span>{category.posts} posts</span>
                                    {category.lastActivity && <span>Last activity: {category.lastActivity}</span>}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </Link>
                    ))
                  )}
                </div>
                
                {/* Trending Discussions */}
                <h3 className="text-lg font-semibold mt-8 mb-4">Trending Discussions</h3>
                <div className="space-y-4">
                  {discussionsLoading ? (
                    Array(3).fill(0).map((_, i) => (
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
                    ))
                  ) : (
                    discussions?.map((discussion) => (
                      <Link href={`/community/discussions/${discussion.id}`} key={discussion.id}>
                        <a className="block">
                          <Card className="hover:border-primary transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <Avatar className="mt-0.5 h-10 w-10 mr-3">
                                  <AvatarImage src={discussion.author.profileImage} />
                                  <AvatarFallback>{discussion.author.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-base">{discussion.title}</h4>
                                    <div className="flex items-center space-x-3 text-gray-500 text-sm">
                                      <span className="flex items-center"><MessageCircle className="mr-1 h-3 w-3" /> {discussion.comments}</span>
                                      <span className="flex items-center"><Heart className="mr-1 h-3 w-3" /> {discussion.likes}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <span>Posted by</span>
                                    <span className="font-medium text-gray-700 mx-1">{discussion.author.name}</span>
                                    <span>in</span>
                                    <span className="font-medium text-primary mx-1">{discussion.forum}</span>
                                    <span>{discussion.timeAgo}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{discussion.content}</p>
                                  {discussion.tags && discussion.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {discussion.tags.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </Link>
                    ))
                  )}
                </div>
              </div>
              
              {/* Community Stats & Quick Links */}
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Members</p>
                        <p className="font-medium">2,450+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Discussions</p>
                        <p className="font-medium">1,280+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Active Today</p>
                        <p className="font-medium">120+</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/community/forums/physiotherapy">
                        Physio Hub
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/community/forums/nutrition">
                        Sports Nutrition
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/community/forums/psychology">
                        Mental Performance
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/community/forums/research">
                        Research Collaboration
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our community thrives on respectful, constructive, and evidence-based discussions. 
                      Please review our guidelines to ensure a positive experience for all members.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="px-0" asChild>
                      <Link href="/community/guidelines">
                        Read Guidelines
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mentorship">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Available Mentors</h3>
                <Button asChild>
                  <Link href="/community/become-mentor">
                    Become a Mentor
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentorshipsLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex">
                          <div className="h-12 w-12 rounded-full bg-gray-200 mr-3"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="flex gap-1">
                              <div className="h-6 w-16 bg-gray-200 rounded"></div>
                              <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  mentorships?.map((mentor) => (
                    <Card key={mentor.id} className="hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <Avatar className="w-12 h-12 mr-3">
                            <AvatarImage src={mentor.profileImage} />
                            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{mentor.name}</h4>
                            <p className="text-sm text-gray-600">{mentor.position}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {mentor.specialties.map((specialty, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                            <div className="mt-3">
                              <Link href={`/community/mentors/${mentor.id}`} className="text-xs font-medium text-primary hover:text-primary-dark">
                                View profile & apply
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              <div className="text-center">
                <Button variant="outline" asChild>
                  <Link href="/community/mentors">
                    View All Mentors
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Resource Library Coming Soon</h3>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                We're building a comprehensive resource library for our community members. 
                Stay tuned for valuable materials, research papers, and clinical guidelines.
              </p>
              <Button variant="outline" asChild>
                <Link href="/community/forums">
                  Explore Forums Instead
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="myactivity">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Your Community Activity</h3>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                Here you'll find your discussions, replies, saved posts, and mentorship activity.
              </p>
              <Button asChild>
                <Link href="/community/forums">
                  Start Participating
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Helper function to get the appropriate icon based on category
const getCategoryIcon = (icon?: string) => {
  const IconComponent = icon || "MessageCircle";
  
  switch (IconComponent) {
    case "Users":
      return <Users className="h-5 w-5" />;
    case "Heart":
      return <Heart className="h-5 w-5" />;
    default:
      return <MessageCircle className="h-5 w-5" />;
  }
};

export default Community;
