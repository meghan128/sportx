import { useState, useEffect } from "react";
import { Search, X, BookOpen, Calendar, Users, FileText, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'event' | 'resource' | 'forum' | 'mentorship';
  href: string;
  relevance: number;
}

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'event': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'resource': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'forum': return <Users className="h-4 w-4 text-orange-500" />;
      case 'mentorship': return <Award className="h-4 w-4 text-pink-500" />;
      default: return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: SearchResult['type']) => {
    const badges = {
      course: { label: "Course", variant: "secondary" as const },
      event: { label: "Event", variant: "secondary" as const },
      resource: { label: "Resource", variant: "secondary" as const },
      forum: { label: "Forum", variant: "secondary" as const },
      mentorship: { label: "Mentorship", variant: "secondary" as const }
    };
    return badges[type];
  };

  // Mock search function - in real app, this would call an API
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "Advanced Sports Psychology",
        description: "Master psychological techniques for athlete performance",
        type: "course",
        href: "/courses/details/1",
        relevance: 95
      },
      {
        id: "2",
        title: "Mental Health Workshop",
        description: "Upcoming workshop on mental health in sports",
        type: "event",
        href: "/events/details/2",
        relevance: 88
      },
      {
        id: "3",
        title: "Sports Psychology Research",
        description: "Latest research papers and findings",
        type: "resource",
        href: "/resources",
        relevance: 82
      },
      {
        id: "4",
        title: "Psychology Discussion Group",
        description: "Community discussion on sports psychology",
        type: "forum",
        href: "/forums",
        relevance: 75
      }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setLoading(false);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('global-search');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="global-search" className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search courses, events, resources..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (query || results.length > 0) && (
        <Card className="absolute top-12 w-full z-50 max-h-96 overflow-y-auto shadow-xl">
          <CardContent className="p-2">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-6 w-6 mx-auto mb-2 animate-spin" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <Link key={result.id} href={result.href}>
                    <div
                      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        {getTypeIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {result.title}
                            </h4>
                            <Badge {...getTypeBadge(result.type)}>
                              {getTypeBadge(result.type).label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                No results found for "{query}"
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <div className="space-y-2">
                  <p className="text-sm">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Psychology", "Rehabilitation", "Nutrition", "Leadership"].map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(term)}
                        className="text-xs"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;