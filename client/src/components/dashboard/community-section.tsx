import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Heart, MessageCircle } from "lucide-react";
import { Discussion, MentorshipOpportunity } from "@/lib/types";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CommunitySection = () => {
  const { data: discussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/community/discussions/recent'],
  });
  
  const { data: mentorships, isLoading: mentorshipsLoading } = useQuery<MentorshipOpportunity[]>({
    queryKey: ['/api/community/mentorships'],
  });

  return (
    <div id="community-section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Community Highlights</h2>
        <Link href="/community" className="text-sm text-primary hover:text-primary-dark flex items-center">
          Visit forums <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="font-semibold mb-4">Recent Discussions</h3>
              
              {discussionsLoading ? (
                <div className="space-y-5 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {discussions && discussions.length > 0 ? (
                    discussions.map((discussion) => (
                      <div key={discussion.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarImage src={discussion.author.profileImage} />
                            <AvatarFallback>{discussion.author.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{discussion.title}</h4>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <span>Posted by</span>
                                  <span className="font-medium text-gray-700 mx-1">{discussion.author.name}</span>
                                  <span>in</span>
                                  <span className="font-medium text-primary mx-1">{discussion.forum}</span>
                                  <span>{discussion.timeAgo}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 text-gray-500 text-sm">
                                <span className="flex items-center"><MessageCircle className="mr-1 h-3 w-3" /> {discussion.comments}</span>
                                <span className="flex items-center"><Heart className="mr-1 h-3 w-3" /> {discussion.likes}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{discussion.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">No recent discussions</p>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/community">Start a discussion</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="font-semibold mb-4">Mentorship Opportunities</h3>
              
              {mentorshipsLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mentorships && mentorships.length > 0 ? (
                    mentorships.map((mentor) => (
                      <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
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
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">No mentorship opportunities available</p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/community/become-mentor">
                        Become a mentor
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
